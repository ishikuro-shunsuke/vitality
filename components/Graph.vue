<template>
  <v-sparkline
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
  ></v-sparkline>
</template>

<script>
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
]

const TRACKING_DAYS = 7

export default {
  data: () => ({
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradient: gradients[5],
    gradientDirection: 'top',
    gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: false,
  }),
  computed: {
    value() {
      return this.$store.state.emissions.reduce((histgram, epochTime) => {
        const elapsed = Math.floor(
          (Date.now() / 1000 - epochTime) / (60 * 60 * 24)
        )
        if (elapsed >= 0 && elapsed < TRACKING_DAYS) {
          histgram[elapsed]++
        }
        return histgram
      }, Array(TRACKING_DAYS).fill(0))
    },
  },
}
</script>
