<template>
  <v-app dark>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <h1>Vitality</h1>
          </v-col>
          <v-col class="text-right" align-self="center">
            <v-icon
              large
              color="grey"
              @click="
                openExternalLink(
                  'https://github.com/ishikuro-shunsuke/vitality'
                )
              "
            >
              mdi-github
            </v-icon>
            <ConfigDialog></ConfigDialog>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <FocusProgress></FocusProgress>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="4" class="pl-0 pr-0">
            <VitalityProgress></VitalityProgress>
          </v-col>
          <v-col cols="12" sm="4" class="pl-0 pr-0">
            <MeditationProgress></MeditationProgress>
          </v-col>
          <v-col cols="12" sm="4" class="pl-0 pr-0">
            <ExerciseProgress></ExerciseProgress>
          </v-col>
        </v-row>

        <v-row>
          <v-tabs id="detail" v-model="tab" grow :color="color">
            <v-tab nuxt :to="{ path: '/', hash: 'detail' }">Vitality</v-tab>
            <v-tab nuxt :to="{ path: '/meditation', hash: 'detail' }">
              Meditation
            </v-tab>
            <v-tab nuxt :to="{ path: '/exercise', hash: 'detail' }">
              Exercise
            </v-tab>
          </v-tabs>
          <nuxt keep-alive />
        </v-row>
        <v-snackbar v-model="snackbarVisible" multi-line>
          {{ snackbar.text }}
          <template #action="{ attrs }">
            <v-btn text v-bind="attrs" @click="clearAlert">Close</v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import VitalityProgress from '../components/vitality/Progress'
import MeditationProgress from '../components/meditation/Progress'
import ExerciseProgress from '../components/exercise/Progress'
import FocusProgress from '../components/FocusProgress'
import ConfigDialog from '../components/ConfigDialog'

export default {
  components: {
    VitalityProgress,
    MeditationProgress,
    ExerciseProgress,
    FocusProgress,
    ConfigDialog,
  },
  data() {
    return {
      tab: null,
    }
  },
  async fetch() {
    this.$store.dispatch('vitality/fetchEmissions')
    await this.$store.dispatch('userdata/fetchUserData')
    await Promise.all([
      this.$store.dispatch('timer/getRunningEntry', { project: 'meditation' }),
      this.$store.dispatch('timer/getRunningEntry', { project: 'focus' }),
      this.$store.dispatch('meditation/fetchWeekTotal'),
      this.$store.dispatch('focus/fetchSummary'),
      this.$store.dispatch('exercise/fetchWeeklyReport'),
    ])
    const focus = await this.$store.dispatch('timer/getRunningEntry', {
      project: 'focus',
    })
    if (focus) {
      this.$store.commit('focus/setRecentTaskName', focus.description)
    }
    if (await this.$store.dispatch('exercise/checkAuthStatus')) {
      this.$store.commit('exercise/loggedIn')
    } else {
      this.$store.commit('exercise/loggedOut')
    }
  },
  computed: {
    color() {
      return {
        '/': 'primary',
        '/meditation': 'green',
        '/exercise': 'orange',
      }[this.$route.path]
    },
    ...mapState(['snackbar']),
    snackbarVisible: {
      get() {
        return this.snackbar.display
      },
      set(val) {
        if (val === false) {
          this.clearAlert()
        }
      },
    },
  },
  methods: {
    ...mapMutations(['print', 'clearAlert']),
    openExternalLink(url) {
      window.open(url, '_blank')
    },
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

h2
  color: #{map-get($grey, 'darken-1')}
</style>
