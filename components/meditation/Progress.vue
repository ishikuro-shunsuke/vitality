<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <Progress
        color="green"
        :value="(weekTotal / 280) * 100"
        icon="mdi-meditation"
      >
        {{ Math.floor(weekTotal) }}/280
      </Progress>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Progress from '@/components/Progress'

export default {
  components: { Progress },
  computed: {
    ...mapGetters('meditation', ['weekTotal']),
  },
}
</script>
