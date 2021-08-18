<template>
  <v-card @click="stimulate">
    <v-card-text class="text-h3 d-flex align-right align-center">
      <v-sparkline
        smooth
        :gradient="gradients"
        :value="value"
        height="80"
      ></v-sparkline>
      {{ today }}
      <v-icon size="50"> mdi-head-snowflake </v-icon>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
const gradients = ['#f72047', '#ffd200', '#1feaea']
export default {
  data() {
    return {
      pending: false,
      gradients,
    }
  },
  computed: {
    ...mapState('dopamine', ['stimulation', 'today']),
    value() {
      return [1, 2, 3, 2, 1, 5, 1, 2, 3, 2, 1, 5, 1, 2, 3, 2, 1, 5]
    },
  },
  methods: {
    stimulate() {
      this.$store.dispatch('dopamine/stimulate')
    },
  },
}
</script>
