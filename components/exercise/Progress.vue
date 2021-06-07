<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <Progress :color="color" :value="(count / 7) * 100" icon="mdi-run">
        <v-icon v-if="!valid" :color="color">mdi-sync-alert</v-icon>
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
    ...mapState('exercise', ['achievements', 'achievementsCache', 'valid']),
    count() {
      const a = this.valid ? this.achievements : this.achievementsCache
      return a.reduce((s, v) => (v.active ? s + 1 : s), 0)
    },
    color() {
      return this.valid ? 'orange' : '#FF980077'
    },
  },
}
</script>
