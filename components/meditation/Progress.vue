<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-progress-circular
        :rotate="-90"
        :size="350"
        :width="80"
        :value="(weekTotal / 280) * 100"
        color="green"
      >
        {{ pending ? 0 : Math.floor(weekTotal) }}/280
        <v-icon color="green" x-large>mdi-meditation</v-icon>
      </v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('meditation', ['pending']),
    ...mapGetters('meditation', ['weekTotal']),
  },
}
</script>
