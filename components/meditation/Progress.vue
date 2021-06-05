<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <Progress
        color="green"
        :value="(weekTotal / 280) * 100"
        icon="mdi-meditation"
      >
        {{ pending ? 0 : Math.floor(weekTotal) }}/280
      </Progress>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Progress from '@/components/Progress'

export default {
  components: { Progress },
  computed: {
    ...mapState('meditation', ['pending']),
    ...mapGetters('meditation', ['weekTotal']),
  },
}
</script>
