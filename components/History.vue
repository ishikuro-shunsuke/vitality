<template>
  <v-container class="text-center">
    <v-progress-circular
      v-if="!initialized"
      :size="200"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <v-row v-else justify="center">
      <v-col v-for="month in calendar" :key="month.label" cols="auto">
        <v-card color="transparent" width="100">
          <v-progress-circular
            :rotate="-90"
            :size="100"
            :width="20"
            :value="(month.count / 5.0) * 100"
            :color="month.count > 5 ? 'red' : 'primary'"
          >
            {{ month.count }}
          </v-progress-circular>
          <p>{{ month.label }}</p>
        </v-card>
      </v-col>
    </v-row>
    <p>{{ debug }}</p>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      calendar: [],
      debug: null,
    }
  },
  computed: {
    ...mapState(['initialized', 'emissions']),
  },
  watch: {
    initialized(newValue, oldValue) {
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
      // eslint-disable-next-line no-console
      console.log(target)
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
