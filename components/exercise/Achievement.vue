<template>
  <v-timeline dense>
    <v-timeline-item
      v-for="achievement in weekReport"
      :key="achievement.date"
      :color="achievement.active ? 'orange' : 'grey'"
      :icon="achievement.active ? 'mdi-run-fast' : 'mdi-bed'"
      large
      :fill-dot="false"
    >
      <v-card shaped>
        <v-card-text>
          <v-row align="center" no-gutters>
            <v-col>
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
            <v-col v-if="!valid || !achievement.date" class="text-right">
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
import colors from 'vuetify/lib/util/colors'

export default {
  data() {
    return {
      colors,
      lightActivities: ['Walk', 'Outdoor Bike'],
    }
  },
  computed: {
    ...mapState('exercise', ['achievements', 'achievementsCache', 'valid']),
    weekReport() {
      return this.valid ? this.achievements : this.achievementsCache
    },
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
