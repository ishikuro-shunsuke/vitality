<template>
  <v-container>
    <v-row>
      <h1>Vitality</h1>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="pl-0 pr-0">
        <h2>Progress</h2>
        <Progress></Progress>
      </v-col>
      <v-col cols="12" md="6" class="pl-0 pr-0">
        <h2>Testosterone level</h2>
        <Chart></Chart>
      </v-col>
    </v-row>
    <v-row>
      <h2>Past week</h2>
      <Graph></Graph>
    </v-row>
    <v-row>
      <h2>Past emissions</h2>
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

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

h2
  color: #{map-get($grey, 'darken-1')}
</style>
