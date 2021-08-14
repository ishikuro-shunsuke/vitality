<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <Progress :color="color" :value="(count / 7) * 100" icon="mdi-run">
        <v-icon v-if="!loggedIn" :color="color">mdi-sync-alert</v-icon>
        <span>{{ count }}/7</span>
      </Progress>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Progress from '@/components/Progress'

export default {
  components: { Progress },
  computed: {
    ...mapState('exercise', ['achievements', 'loggedIn']),
    count() {
      return this.achievements.reduce((s, v) => (v.active ? s + 1 : s), 0)
    },
    color() {
      return this.loggedIn ? 'orange' : '#FF980077'
    },
  },
}
</script>
