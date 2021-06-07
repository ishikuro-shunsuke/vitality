<template>
  <v-container>
    <v-alert v-if="!settingsExist" type="warning" colored-border border="left">
      Account settings are required
    </v-alert>
    <fullscreen :fullscreen.sync="fullscreen" class="d-flex align-strech">
      <v-container class="align-self-center">
        <v-row>
          <v-col
            :cols="fullscreen ? 12 : 6"
            class="d-flex align-self-center"
            :class="[!fullscreen ? 'justify-end' : 'justify-center']"
          >
            <v-progress-circular
              :rotate="-90"
              :size="
                fullscreen && $vuetify.breakpoint.name !== 'xs' ? 600 : 200
              "
              :width="10"
              :value="(timer.duration / (20 * 60 * 1000)) * 100"
              color="deep-orange"
            >
              <v-btn
                v-if="timer.running"
                fab
                :disabled="!settingsExist || pending"
                @click="stop"
              >
                <v-icon>mdi-stop</v-icon>
              </v-btn>
              <v-btn
                v-if="!timer.running"
                fab
                :disabled="!settingsExist || pending"
                @click="start"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </v-progress-circular>
            <v-btn
              v-if="fullscreen"
              absolute
              bottom
              right
              @click="toggleFullscreen"
            >
              <v-icon>mdi-fullscreen-exit</v-icon> exit fullscreen
            </v-btn>
          </v-col>
          <v-col v-if="!fullscreen" cols="6">
            <v-card flat color="transparent">
              <v-card-text v-if="!fullscreen">
                <p
                  class="font-weight-bold"
                  :class="[
                    $vuetify.breakpoint.name === 'xs' ? 'text-h5' : 'text-h2',
                  ]"
                >
                  {{ durationMMSS }}
                </p>
              </v-card-text>
              <v-card-text>
                <v-btn @click="toggleFullscreen">
                  <v-icon>mdi-fullscreen</v-icon> fullscreen
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </fullscreen>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      fullscreen: false,
    }
  },
  computed: {
    ...mapState('meditation', ['timer', 'pending']),
    ...mapGetters('meditation', ['settingsExist']),
    durationMMSS() {
      const m = Math.floor(this.timer.duration / 1000 / 60)
      const paddingM = m > 99 ? m : `0${m}`.slice(-2)
      // eslint-disable-next-line prettier/prettier
      const paddingS = `0${Math.floor(this.timer.duration / 1000) % 60}`.slice(-2)
      return `${paddingM}:${paddingS}`
    },
  },
  watch: {
    'timer.running'(val, old) {
      if (!old && val) {
        const intervalId = setInterval(() => {
          this.setDuration(Date.now() - this.timer.startTime)
        }, 1000)
        this.setIntervalId(intervalId)
      }
    },
  },
  methods: {
    ...mapActions('meditation', [
      'fetchWeeklyReport',
      'startTimer',
      'stopTimer',
    ]),
    ...mapMutations('meditation', ['setIntervalId', 'setDuration']),
    async start() {
      await this.startTimer()
    },
    async stop() {
      await this.stopTimer()
      await this.fetchWeeklyReport()
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    },
  },
}
</script>
