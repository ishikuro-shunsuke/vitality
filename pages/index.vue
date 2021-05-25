<template>
  <v-container>
    <v-row>
      <h1>Vitality</h1>
    </v-row>
    <v-row class="d-fflex justify-center">
      <Progress></Progress>
    </v-row>
    <v-row class="mt-10">
      <h3>Past week</h3>
      <Graph></Graph>
    </v-row>
    <v-row class="mt-10">
      <h3>Past emissions</h3>
      <History></History>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  components: true,
  computed: {
    ...mapState(['initialized', 'emissions']),
    ...mapGetters(['elapsed']),
  },
  created() {
    this.$store.dispatch('initialize')
  },
  methods: {
    fetchNextPage() {
      this.$store.dispatch('fetchNextPage')
    },
  },
}
</script>
