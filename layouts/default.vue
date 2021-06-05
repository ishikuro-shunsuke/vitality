<template>
  <v-app dark>
    <v-main>
      <v-container>
        <v-row>
          <h1>Vitality</h1>
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
        <v-row class="mt-10">
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

export default {
  components: {
    VitalityProgress,
    MeditationProgress,
    ExerciseProgress,
  },
  data() {
    return {
      tab: null,
    }
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('vitality/fetchEmissions'),
      this.$store
        .dispatch('fetchSettings')
        .then(() => this.$store.dispatch('meditation/fetchWeeklyReport')),
      this.$store.dispatch('exercise/fetchWeeklyReport'),
    ])
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
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

h2
  color: #{map-get($grey, 'darken-1')}
</style>
