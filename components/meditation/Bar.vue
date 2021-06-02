<template>
  <v-container class="">
    <BarChart :chart-data="chartdata" :options="options"></BarChart>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import colors from 'vuetify/es5/util/colors'

export default {
  data() {
    return {
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }],
        },
        tooltips: {
          enabled: false,
        },
      },
    }
  },
  computed: {
    chartdata() {
      return {
        labels: Array.from(Array(7).keys()).reverse(),
        datasets: [
          {
            type: 'bar',
            data: this.weekEntries,
            hoverBackgroundColor: colors.green.lighten1,
            backgroundColor: colors.green.base,
          },
          {
            type: 'bar',
            data: this.weekEntries.map((v) => (v > 20 ? 0 : 20 - v)),
            borderWidth: 1,
            borderSkipped: 'top',
            borderColor: colors.deepOrange.darken4,
            backgroundColor: colors.grey.darken2 + '33',
          },
          {
            type: 'bar',
            data: this.weekEntries.map((v) =>
              v > 40 ? 0 : v > 20 ? 40 - v : 20
            ),
            borderWidth: 1,
            borderColor: colors.deepOrange.darken4,
            backgroundColor: colors.grey.darken3 + '33',
          },
        ],
      }
    },
    ...mapState('meditation', ['weekEntries']),
  },
}
</script>
