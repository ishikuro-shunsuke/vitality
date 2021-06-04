<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-progress-circular
        :rotate="-90"
        :size="350"
        :width="80"
        :value="(count / 7) * 100"
        color="orange"
      >
        {{ count }}/7
        <v-icon color="orange" x-large>mdi-run</v-icon>
      </v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('exercise', ['achivements']),
    count() {
      return this.achivements.reduce((s, v) => (v.active ? s + 1 : s), 0)
    },
  },
  methods: {
    emit() {
      this.$store.dispatch('vitality/emit')
    },
  },
}
</script>
