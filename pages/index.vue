<template>
  <v-container class="mt-10">
    <v-row>
      <v-col cols="12" md="6" class="pl-0 pr-0">
        <h2>Testosterone level</h2>
        <VitalityChart></VitalityChart>
      </v-col>
      <v-col cols="12" md="6" class="pl-0 pr-0">
        <h2>Past 30 days</h2>
        <VitalityGraph></VitalityGraph>
      </v-col>
    </v-row>
    <v-row>
      <h2>Past emissions</h2>
      <VitalityHistory></VitalityHistory>
    </v-row>
  </v-container>
</template>

<script>
import VitalityChart from '../components/vitality/Chart'
import VitalityGraph from '../components/vitality/Graph'
import VitalityHistory from '../components/vitality/History'

export default {
  components: {
    VitalityChart,
    VitalityGraph,
    VitalityHistory,
  },
  created() {
    this.$store.dispatch('initialize')
  },
}
</script>
