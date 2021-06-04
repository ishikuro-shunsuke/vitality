<template>
  <v-app dark>
    <v-main>
      <v-container>
        <v-row>
          <h1>Vitality</h1>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" class="pl-0 pr-0">
            <VitalityProgress></VitalityProgress>
          </v-col>
          <v-col cols="12" md="4" class="pl-0 pr-0">
            <MeditationProgress></MeditationProgress>
          </v-col>
          <v-col cols="12" md="4" class="pl-0 pr-0">
            <ExerciseProgress></ExerciseProgress>
          </v-col>
        </v-row>
        <v-row>
          <v-tabs v-model="tab" grow :color="color">
            <v-tab nuxt to="/">Vitality</v-tab>
            <v-tab nuxt to="/meditation">Meditation</v-tab>
            <v-tab nuxt to="/exercise">Exercise</v-tab>
          </v-tabs>
          <nuxt keep-alive />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
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
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  async fetch() {
    await Promise.all([
      this.$store.dispatch('vitality/fetchEmissions'),
      this.$store.dispatch('fetchSettings'),
      this.$store.dispatch('exercise/fetchWeeklyReport'),
    ])
  },
  computed: {
    color() {
      return this.tab === '/'
        ? 'primary'
        : this.tab === '/meditation'
        ? 'green'
        : this.tab === '/exercise'
        ? 'orange'
        : ''
    },
  },
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

h2
  color: #{map-get($grey, 'darken-1')}
</style>
