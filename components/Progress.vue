<template>
  <div>
    <v-progress-circular
      :rotate="-90"
      :size="100"
      :width="20"
      :value="value"
      :color="color"
    >
      {{ elapsed }}
    </v-progress-circular>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    value() {
      return isNaN(this.elapsed) ? 0 : (this.elapsed / 7.0) * 100
    },
    color() {
      return this.elapsed <= 7 ? 'primary' : 'red'
    },
    ...mapState(['initialized', 'elapsed']),
  },
}
</script>
