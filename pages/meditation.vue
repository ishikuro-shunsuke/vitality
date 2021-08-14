<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Timer</h2>
        <Timer></Timer>
      </v-col>
      <v-col cols="12">
        <h2>Past 7 days</h2>
        <Bar></Bar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Bar from '../components/meditation/Bar'
import Timer from '../components/meditation/Timer'

export default {
  components: {
    Bar,
    Timer,
  },
}
</script>
