<template>
  <LineChart
    height="180"
    :chart-data="chartData"
    :options="options"
  ></LineChart>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import colors from 'vuetify/es5/util/colors'

const TRACKING_DAYS = 30

export default {
  data: () => ({
    options: {
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              max: 0.5,
              stepSize: 1,
              callback(v) {
                return v === 0.5 ? '' : v * -1
              },
            },
            display: true,
          },
        ],
        xAxes: [
          {
            ticks: {
              callback(v) {
                return v % 7 !== 0 ? '' : v + ' days ago'
              },
            },
            display: true,
          },
        ],
      },
    },
  }),
  computed: {
    chartData() {
      return {
        labels: Array.from(Array(this.dataset.length).keys()).reverse(),
        datasets: [
          {
            data: this.dataset,
            borderColor: colors.blue.base,
            pointRadius: 0,
          },
        ],
      }
    },
    dataset() {
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
    ...mapState('vitality', ['emissions']),
    ...mapGetters('vitality', ['elapsed']),
  },
}
</script>
