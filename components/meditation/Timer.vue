<template>
  <v-container>
    <v-alert
      v-if="!meditationSettingExists"
      type="warning"
      colored-border
      border="left"
    >
      Account settings are required
    </v-alert>
    <v-container class="align-self-center">
      <v-row align="center">
        <v-col cols="6" class="d-flex align-self-center justify-end">
          <fullscreen
            :fullscreen.sync="fullscreen"
            class="d-flex align-center justify-center"
            :exit-on-click-wrapper="false"
          >
            <v-progress-circular
              :rotate="-90"
              :size="
                fullscreen && $vuetify.breakpoint.name === 'xs'
                  ? 300
                  : !fullscreen && $vuetify.breakpoint.name === 'xs'
                  ? 150
                  : fullscreen && $vuetify.breakpoint.name !== 'xs'
                  ? 600
                  : !fullscreen && $vuetify.breakpoint.name !== 'xs'
                  ? 300
                  : 300
              "
              :width="10"
              :value="(duration / (20 * 60 * 1000)) * 100"
              color="deep-orange"
            >
              <v-btn
                v-if="running"
                fab
                :disabled="!meditationSettingExists"
                @click="stop"
              >
                <v-icon>mdi-stop</v-icon>
              </v-btn>
              <v-btn
                v-if="!running"
                fab
                :disabled="!meditationSettingExists"
                @click="start"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </v-progress-circular>
          </fullscreen>
        </v-col>
        <v-col cols="6">
          <v-card flat color="transparent">
            <v-card-text>
              <p
                class="font-weight-bold"
                :class="[
                  $vuetify.breakpoint.name === 'xs' ? 'text-h5' : 'text-h2',
                ]"
              >
                {{ durationMMSS }}
              </p>
            </v-card-text>
            <v-btn absolute small right @click="fullscreen = !fullscreen">
              <v-icon>mdi-fullscreen</v-icon>fullscreen
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      intervalId: null,
      duration: 0,
      fullscreen: false,
    }
  },
  computed: {
    ...mapState('meditation/timer', ['startTime', 'running']),
    ...mapGetters('userdata', ['meditationSettingExists']),
    durationMMSS() {
      const m = Math.floor(this.duration / 1000 / 60)
      const paddingM = m > 99 ? m : `0${m}`.slice(-2)
      // eslint-disable-next-line prettier/prettier
      const paddingS = `0${Math.floor(this.duration / 1000) % 60}`.slice(-2)
      return `${paddingM}:${paddingS}`
    },
  },
  watch: {
    running(val, old) {
      if (!old && val) {
        this.intervalId = setInterval(() => {
          this.duration = Date.now() - this.startTime
        }, 1000)
      } else if (!val) {
        this.duration = 0
      }
    },
  },
  methods: {
    async start() {
      await this.$store.dispatch('meditation/timer/startTimer')
    },
    async stop() {
      clearInterval(this.intervalId)
      await this.$store.dispatch('meditation/timer/stopTimer')
      await this.$store.dispatch('meditation/fetchWeekTotal')
    },
  },
}
</script>
