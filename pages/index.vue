<template>
  <div>
    <v-progress-circular
      v-if="!initialized"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <span v-if="isNaN(elapsed)">No data</span>
    <span v-else>{{ elapsed }} days</span>

    <v-dialog v-model="dialog" class="mx-auto" max-width="200">
      <template #activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">emit</v-btn>
      </template>

      <v-card>
        <v-card-title>Emitted?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="
              dialog = false
              emit()
            "
          >
            yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Progress></Progress>

    <Graph></Graph>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: true,
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapState(['initialized', 'elapsed']),
  },
  created() {
    this.$store.dispatch('initialize')
  },
  methods: {
    emit() {
      this.$store.dispatch('emit')
    },
    fetchNextPage() {
      this.$store.dispatch('fetchNextPage')
    },
  },
}
</script>
