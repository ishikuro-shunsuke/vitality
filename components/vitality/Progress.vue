<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <Progress
        :color="elapsed <= 7 ? 'primary' : 'red'"
        :value="(elapsed / 7.0) * 100"
        icon="mdi-battery-plus"
      >
        {{ elapsed }}/7
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
    ...mapGetters('vitality', ['elapsed']),
  },
}
</script>
