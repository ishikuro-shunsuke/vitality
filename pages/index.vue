<template>
  <v-container>
    <v-row>
      <h1>Vitality</h1>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <Progress></Progress>
      </v-col>
      <v-col cols="12" md="6">
        <Chart></Chart>
      </v-col>
    </v-row>
    <v-row>
      <h3>Past week</h3>
      <Graph></Graph>
    </v-row>
    <v-row>
      <h3>Past emissions</h3>
      <History></History>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Progress from '../components/Progress'
import Chart from '../components/Chart'
import Graph from '../components/Graph'
import History from '../components/History'

export default {
  components: [Progress, Chart, Graph, History],
  computed: {
    ...mapState(['initialized', 'emissions']),
    ...mapGetters(['elapsed']),
  },
  created() {
    this.$store.dispatch('initialize')
  },
  methods: {
    fetchNextPage() {
      this.$store.dispatch('fetchNextPage')
    },
  },
}
</script>
