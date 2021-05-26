<template>
  <v-container class="d-flex justify-center">
    <LineChart :chart-data="chartdata" :options="options"></LineChart>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import colors from 'vuetify/es5/util/colors'
const dataset = [
  '374',
  '384',
  '375',
  '380',
  '385',
  '404',
  '426',
  '524',
  '417',
  '387',
  '378',
]
export default {
  data() {
    return {
      options: {
        layout: {
          padding: {
            left: 35,
            right: 35,
            top: 0,
            bottom: 0,
          },
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{ ticks: { min: 300 }, display: false }],
          xAxes: [{ display: false }],
        },
      },
    }
  },
  computed: {
    currentLevel() {
      const norm =
        this.elapsed < dataset.length ? this.elapsed : dataset.length - 1
      return Array(dataset.length)
        .fill(-Infinity)
        .map((v, i) => (i === norm ? dataset[norm] : v))
    },
    chartdata() {
      return {
        labels: Array.from(Array(dataset.length).keys()),
        datasets: [
          {
            data: dataset,
            borderColor: colors.grey.darken3,
            backgroundColor: colors.grey.darken4,
            fill: false,
          },
          {
            data: this.currentLevel,
            pointBorderColor: colors.blue.base,
            showLine: false,
            pointRadius: 20,
            pointBorderWidth: 5,
          },
        ],
      }
    },
    ...mapGetters(['elapsed']),
  },
}
</script>
