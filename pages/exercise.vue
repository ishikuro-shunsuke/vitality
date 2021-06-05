<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Past 7 days</h2>
        <Achivement></Achivement>
      </v-col>
      <v-col cols="12">
        <h2>Fitbit</h2>
        <v-btn v-if="!$nuxt.$auth.loggedIn" x-large @click="login">
          Login
        </v-btn>
        <v-btn v-else x-large @click="logout">Logout</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Achivement from '../components/exercise/Achivement'

export default {
  components: {
    Achivement,
  },
  methods: {
    async login() {
      await this.$auth.loginWith('fitbit')
    },
    async logout() {
      await this.$auth.logout()
    },
  },
}
</script>
