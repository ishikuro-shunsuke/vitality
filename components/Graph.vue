<template>
  <v-container>
    <v-progress-circular
      v-if="!initialized"
      :size="200"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <v-sparkline
      v-else
      :value="value.reverse()"
      :gradient="gradient"
      :smooth="radius || false"
      :padding="padding"
      :line-width="width"
      :stroke-linecap="lineCap"
      :gradient-direction="gradientDirection"
      :fill="fill"
      :type="type"
      :auto-line-width="autoLineWidth"
      :show-labels="true"
      auto-draw
    >
      <template #label="emission">
        {{ emission.value * -1 }}
      </template>
    </v-sparkline>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import colors from 'vuetify/es5/util/colors'

const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', colors.blue.base],
]

const TRACKING_DAYS = 7

export default {
  data: () => ({
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradientDirection: 'bottom',
    gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: false,
  }),
  computed: {
    gradient() {
      return this.elapsed >= 7 ? [colors.blue.base] : gradients[5]
    },
    value() {
      return this.emissions.reduce((histgram, epochTime) => {
        const elapsed = Math.floor(
          (Date.now() / 1000 - epochTime) / (60 * 60 * 24)
        )
        if (elapsed >= 0 && elapsed < TRACKING_DAYS) {
          histgram[elapsed]--
        }
        return histgram
      }, Array(TRACKING_DAYS).fill(0))
    },
    ...mapState(['emissions', 'initialized']),
    ...mapGetters(['elapsed']),
  },
}
</script>
