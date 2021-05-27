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
      color="accent"
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

const TRACKING_DAYS = 7

export default {
  data: () => ({
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradientDirection: 'bottom',
    fill: false,
    type: 'trend',
    autoLineWidth: false,
  }),
  computed: {
    gradient() {
      const defaultTheme = [
        this.$vuetify.theme.themes.dark.error,
        colors.grey.darken4,
        colors.blue.base,
      ]
      return this.elapsed >= 7 ? [colors.blue.base] : defaultTheme
    },
    value() {
      return this.emissions.reduce((histgram, epochTime) => {
        const now = new Date()
        const today =
          new Date(now.getFullYear(), now.getMonth(), now.getDate()) / 1000
        const elapsed = Math.floor((today - epochTime) / (60 * 60 * 24))
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
