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
      <v-icon size="50">
        {{ pending ? 'mdi-head-sync' : 'mdi-head-snowflake' }}
      </v-icon>
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
    async stimulate() {
      this.pending = true
      await this.$store.dispatch('dopamine/stimulate')
      this.pending = false
    },
  },
}
</script>
