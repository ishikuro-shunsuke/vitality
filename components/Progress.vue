<template>
  <v-container class="text-center">
    <v-progress-circular
      :rotate="-90"
      :size="350"
      :width="80"
      :value="value"
      :color="elapsed <= 7 ? 'primary' : 'red'"
    >
      <v-dialog v-model="dialog" class="mx-auto" max-width="200">
        <template #activator="{ on, attrs }">
          <v-btn x-large block v-bind="attrs" v-on="on">emit</v-btn>
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
    </v-progress-circular>
    <p class="d-flex justify-end">{{ elapsed }}/7</p>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    value() {
      return (this.elapsed / 7.0) * 100
    },
    ...mapState(['initialized']),
    ...mapGetters(['elapsed']),
  },
  methods: {
    emit() {
      this.$store.dispatch('emit')
    },
  },
}
</script>
