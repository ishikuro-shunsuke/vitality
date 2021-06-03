<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-progress-circular
        :rotate="-90"
        :size="350"
        :width="80"
        :value="value"
        :color="elapsed <= 7 ? 'primary' : 'warning'"
      >
        {{ elapsed }}/7
        <v-icon color="primary" x-large>mdi-battery-plus</v-icon>
      </v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    value() {
      return (this.elapsed / 7.0) * 100
    },
    ...mapState('vitality', ['pending']),
    ...mapGetters('vitality', ['elapsed']),
  },
  methods: {
    emit() {
      this.$store.dispatch('vitality/emit')
    },
  },
}
</script>
