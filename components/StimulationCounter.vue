<template>
  <v-card @click="stimulate">
    <v-card-text>
      <LineChart
        :height="79"
        :chart-data="chartData"
        :options="options"
      ></LineChart>
      <v-overlay absolute class="text-h3">
        <v-icon size="50" color="pink"> mdi-head-snowflake </v-icon>
        {{ today }}
      </v-overlay>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import colors from 'vuetify/es5/util/colors'

const TRACKING_DAYS = 30
export default {
  data() {
    return {
      pending: false,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
              display: false,
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
      },
    }
  },
  computed: {
    ...mapState('dopamine', ['stimulation', 'today']),
    chartData() {
      return {
        labels: Array.from(Array(this.histgram.length).keys()),
        datasets: [
          {
            borderColor: colors.pink.base,
            backgroundColor: colors.pink.darken3,
            pointRadius: 0,
            data: this.histgram,
          },
        ],
      }
    },
    histgram() {
      const msecInDay = 60 * 60 * 24 * 1000
      const tomorrow = new Date()
      const hist = Array(TRACKING_DAYS)
        .fill(0)
        .map((_, i) => {
          const date = this.$toyyyymmdd(new Date(tomorrow - msecInDay * i))
          return this.stimulation.find((s) => s.date === date)?.count || 0
        })
        .reverse()
      return hist
    },
  },
  methods: {
    stimulate() {
      this.$store.dispatch('dopamine/stimulate')
    },
  },
}
</script>
