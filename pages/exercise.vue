<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Past 7 days</h2>
        <Achievement></Achievement>
      </v-col>
      <v-col cols="12">
        <h2>Fitbit</h2>
        <v-btn v-if="!loggedIn" x-large @click="login">Login</v-btn>
        <v-btn v-else x-large @click="logout">Logout</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Achievement from '../components/exercise/Achievement'

export default {
  components: {
    Achievement,
  },
  computed: {
    ...mapState('exercise', ['loggedIn']),
  },
  methods: {
    login() {
      this.$store.dispatch('exercise/loginTrackerService')
    },
    logout() {
      this.$store.dispatch('exercise/logoutTrackerService')
    },
  },
}
</script>
