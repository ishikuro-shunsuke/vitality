<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <Progress color="orange" :value="(count / 7) * 100" icon="mdi-run">
        {{ count }}/7
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
