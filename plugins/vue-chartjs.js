/* eslint-disable vue/one-component-per-file */
import Vue from 'vue'
import { Line, Bar, mixins } from 'vue-chartjs'

const defaultChart = {
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
}

Vue.component('LineChart', { ...defaultChart, extends: Line })
Vue.component('BarChart', { ...defaultChart, extends: Bar })
