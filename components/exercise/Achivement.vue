<template>
  <v-timeline dense>
    <v-timeline-item
      v-for="achivement in achivements"
      :key="achivement.date"
      :color="achivement.active ? 'orange' : 'grey'"
      :icon="achivement.active ? 'mdi-run-fast' : 'mdi-bed'"
      large
      :fill-dot="false"
    >
      <v-card shaped>
        <v-card-text>
          <v-row>
            <v-col
              v-if="!$auth.loggedIn || !achivement.date"
              cols="1"
              class="d-flex align-center"
            >
              <v-icon color="grey darken-2">mdi-progress-alert</v-icon>
            </v-col>
            <v-col cols="2" md="1" class="d-flex align-center">
              {{ getDay(achivement.date) }}
            </v-col>
            <v-col>
              <v-chip
                v-for="activity in Array.from(new Set(achivement.activities))"
                :key="activity"
                class="mr-2"
                :color="activity === 'Walk' ? 'primary' : 'deep-orange'"
              >
                {{ activity }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { mapState } from 'vuex'
import colors from 'vuetify/lib/util/colors'

export default {
  data() {
    return {
      colors,
    }
  },
  computed: {
    ...mapState('exercise', ['achivements']),
  },
  methods: {
    getDay(date) {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        new Date(date).getDay()
      ]
    },
  },
}
</script>
