<template>
  <v-container>
    <v-row>
      <h1>Vitality</h1>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-img src="/rat.png" />
      </v-col>
      <v-col cols="12" md="4" class="pl-0 pr-0">
        <h2>Progress</h2>
        <VitalityProgress></VitalityProgress>
      </v-col>
      <v-col cols="12" md="4" class="pl-0 pr-0">
        <h2>Testosterone level</h2>
        <VitalityChart></VitalityChart>
      </v-col>
    </v-row>
    <v-row>
      <h2>Past 30 days</h2>
      <VitalityGraph></VitalityGraph>
    </v-row>
    <v-row>
      <h2>Past emissions</h2>
      <VitalityHistory></VitalityHistory>
    </v-row>
  </v-container>
</template>

<script>
import VitalityProgress from '../components/vitality/Progress'
import VitalityChart from '../components/vitality/Chart'
import VitalityGraph from '../components/vitality/Graph'
import VitalityHistory from '../components/vitality/History'

export default {
  components: {
    VitalityProgress,
    VitalityChart,
    VitalityGraph,
    VitalityHistory,
  },
  created() {
    this.$store.dispatch('initialize')
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

h2
  color: #{map-get($grey, 'darken-1')}
</style>
