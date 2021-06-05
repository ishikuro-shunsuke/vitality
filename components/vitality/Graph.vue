<template>
  <v-container>
    <v-progress-circular
      v-if="pending"
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

const TRACKING_DAYS = 30

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
      return this.elapsed >= 30 ? [colors.blue.base] : defaultTheme
    },
    value() {
      const secondsInDay = 60 * 60 * 24
      const now = new Date()
      const tomorrow =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) / 1000
      return this.emissions
        .filter((v) => v > tomorrow - secondsInDay * TRACKING_DAYS)
        .reduce((histgram, epochTime) => {
          const elapsed = Math.floor((tomorrow - epochTime) / secondsInDay)
          if (elapsed >= 0 && elapsed < TRACKING_DAYS) {
            histgram[elapsed]--
          }
          return histgram
        }, Array(TRACKING_DAYS).fill(0))
    },
    ...mapState('vitality', ['emissions', 'pending']),
    ...mapGetters('vitality', ['elapsed']),
  },
}
</script>
