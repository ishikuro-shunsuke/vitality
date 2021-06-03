<template>
  <v-container>
    <v-progress-circular
      v-if="pending"
      :size="200"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <v-row v-else>
      <v-col
        v-for="month in calendar"
        :key="month.label"
        cols="4"
        md="2"
        xl="1"
        class="pr-0 pl-0"
      >
        <v-card color="transparent" flat max-width="120">
          <v-card-subtitle class="text-center pb-1">
            {{ month.label }}
          </v-card-subtitle>
          <v-card-text>
            <v-progress-circular
              :rotate="-90"
              :size="88"
              :width="20"
              :value="(month.count / 5.0) * 100"
              :color="
                month.count > 5
                  ? 'error'
                  : month.count === 4
                  ? 'warning'
                  : 'primary'
              "
            >
              {{ month.count }}
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('vitality', ['pending', 'calendar']),
  },
}
</script>
