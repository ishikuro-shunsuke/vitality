<template>
  <v-card>
    <v-progress-linear :color="color" :value="percentile" height="25">
      {{ durationHMMSS }}
    </v-progress-linear>
    <v-card-actions>
      <v-btn icon @click="openTogglReport">
        <v-icon>mdi-chart-box</v-icon>
      </v-btn>
      <v-text-field
        v-model="taskName"
        :label="projectName"
        :disabled="focus.running"
        dark
      ></v-text-field>
      <v-btn icon @click="action">
        <v-icon>{{ focus.running ? 'mdi-stop' : 'mdi-play' }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskName: '',
      ongoingDuration: 0,
      intervalId: null,
    }
  },
  computed: {
    ...mapState('focus', ['yearlyTotal', 'projectName', 'recentTaskName']),
    ...mapState('timer', ['focus']),
    ...mapState('userdata', ['settings']),
    ...mapGetters('userdata', ['projectConfig']),
    color() {
      return this.percentile >= 100
        ? 'cyan'
        : [
            'indigo darken-1',
            'deep-purple darken-3',
            'purple darken-2',
            'pink',
          ][Math.floor(this.percentile / 25)]
    },
    percentile() {
      return (
        ((this.yearlyTotal + this.ongoingDuration) / (2000 * 60 * 60 * 1000)) *
        100
      )
    },
    durationHMMSS() {
      const duration = this.yearlyTotal + this.ongoingDuration
      const h = Math.floor(duration / 1000 / 60 / 60)
      const m = Math.floor(duration / 1000 / 60) % 60
      const paddingM = m > 99 ? m : `0${m}`.slice(-2)
      // eslint-disable-next-line prettier/prettier
      const paddingS = `0${Math.floor(duration / 1000) % 60}`.slice(-2)
      return `${h}:${paddingM}:${paddingS}`
    },
  },
  watch: {
    recentTaskName(newVal, _) {
      this.taskName = newVal
    },
    'focus.running'(val, old) {
      if (!old && val) {
        this.intervalId = setInterval(() => {
          this.ongoingDuration = Date.now() - this.focus.startTime
        }, 1000)
      } else if (!val) {
        this.ongoingDuration = 0
      }
    },
  },
  methods: {
    async action() {
      if (!this.focus.running) {
        await this.$store.dispatch('timer/startTimer', {
          project: 'focus',
          description: this.taskName,
        })
      } else {
        clearInterval(this.intervalId)
        await this.$store.dispatch('timer/stopTimer', { project: 'focus' })
        await this.$store.dispatch('focus/fetchSummary')
      }
    },
    openTogglReport() {
      const config = this.settings.toggl.projects.find(
        (p) => p.name === 'focus'
      )
      if (!config) {
        return
      }
      window.open(
        `https://track.toggl.com/reports/summary/${config.wid}/period/thisYear/projects/${config.pid}`,
        '_blank'
      )
    },
  },
}
</script>
