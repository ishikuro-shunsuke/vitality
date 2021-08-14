<template>
  <v-timeline dense>
    <v-timeline-item
      v-for="achievement in achievements"
      :key="achievement.date"
      :color="achievement.active ? 'orange' : 'grey'"
      :icon="achievement.active ? 'mdi-run-fast' : 'mdi-bed'"
      large
      :fill-dot="false"
    >
      <v-card shaped>
        <v-card-text>
          <v-row align="center" no-gutters>
            <v-col md="1">
              {{ getDay(achievement.date) }}
            </v-col>
            <v-col cols="8">
              <v-chip-group column>
                <v-chip
                  v-for="activity in Array.from(
                    new Set(achievement.activities)
                  )"
                  :key="activity"
                  :color="
                    lightActivities.includes(activity) ? 'grey' : 'deep-orange'
                  "
                >
                  {{ activity }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col v-if="!loggedIn || !achievement.date" class="text-right">
              <v-icon color="error">mdi-sync-alert</v-icon>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      lightActivities: ['Walk', 'Outdoor Bike'],
    }
  },
  computed: {
    ...mapState('exercise', ['achievements', 'loggedIn']),
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
