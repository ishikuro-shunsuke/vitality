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
  data() {
    return {
      calendar: [],
    }
  },
  computed: {
    ...mapState('vitality', ['pending', 'emissions']),
  },
  watch: {
    pending(newValue, oldValue) {
      if (newValue && !oldValue) {
        const oldest =
          this.emissions.length === 0
            ? new Date()
            : new Date(Math.min(...this.emissions) * 1000)
        this.generateNewMonthRange(oldest)
      }
    },
    emissions(newValue, oldValue) {
      const newEmissions = newValue.filter((e) => !oldValue.includes(e))
      this.insertDataToCalendar(newEmissions)
    },
  },
  created() {
    const now = new Date()
    this.calendar.push({
      label: `${now.getFullYear()}/${now.getMonth() + 1}`,
      start: new Date(now.getFullYear(), now.getMonth()),
      end: new Date(now.getFullYear(), now.getMonth() + 1),
      count: 0,
    })
  },
  methods: {
    generateNewMonthRange(target) {
      const oldestMonth = new Date(
        Math.min(...this.calendar.map((m) => m.start))
      )

      if (oldestMonth < target) {
        return
      }
      let i = 1
      while (
        new Date(oldestMonth.getFullYear(), oldestMonth.getMonth() - i + 1) >
        target
      ) {
        const cur = new Date(
          oldestMonth.getFullYear(),
          oldestMonth.getMonth() - i
        )
        this.calendar.push({
          label: `${cur.getFullYear()}/${cur.getMonth() + 1}`,
          start: cur,
          end: new Date(cur.getFullYear(), cur.getMonth() + 1),
          count: 0,
        })
        i++
      }
    },
    insertDataToCalendar(emissions) {
      emissions.forEach((e) => {
        const m = this.calendar.find(
          (m) => e >= m.start / 1000 && e < m.end / 1000
        )
        if (m) {
          m.count++
        }
      })
    },
  },
}
</script>
