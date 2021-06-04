<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Fitbit</h2>
        <v-btn v-if="!$nuxt.$auth.loggedIn" x-large @click="login">
          Login
        </v-btn>
        <v-btn v-else x-large @click="$nuxt.$auth.logout()">Logout</v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <h2>Past 7 days</h2>
        <Graph></Graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Graph from '../components/exercise/Graph'

export default {
  components: {
    Graph,
  },
  methods: {
    async login() {
      await this.$nuxt.$auth.loginWith('fitbit')
      this.$store.dispatch('exercise/fetchWeeklyReport')
    },
  },
}
</script>
