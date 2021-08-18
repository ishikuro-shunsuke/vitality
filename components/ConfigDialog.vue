<template>
  <v-dialog v-model="show" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-icon large color="grey" v-bind="attrs" v-on="on"> mdi-cog </v-icon>
    </template>
    <v-form ref="form" v-model="valid">
      <v-card>
        <v-card-title>Toggl Settings</v-card-title>
        <v-card-text>
          <a href="https://track.toggl.com/profile">
            https://track.toggl.com/profile
          </a>
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="input.togglApiKey"
            label="API Key"
            :rules="apiKeyRules"
          ></v-text-field>
        </v-card-text>
        <v-card-text>
          <a href="https://track.toggl.com/projects"> Select projects </a>
        </v-card-text>
        <v-card-subtitle>Meditaiton</v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="input.meditationWid"
            label="Workspace ID"
            :rules="numberRules"
          ></v-text-field>
          <v-text-field
            v-model="input.meditationPid"
            label="Project ID"
            :rules="numberRules"
          ></v-text-field>
        </v-card-text>
        <v-card-subtitle>Focus</v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="input.focusWid"
            label="Workspace ID"
            :rules="numberRules"
          ></v-text-field>
          <v-text-field
            v-model="input.focusPid"
            label="Project ID"
            :rules="numberRules"
          ></v-text-field>
          <v-text-field
            v-model="input.focusEstimated"
            label="Estimated Hours"
            :rules="numberRules"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!valid" text color="red" @click="reset">
            Remove
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="show = false">Cancel</v-btn>
          <v-btn :disabled="!valid" text @click="save">Save</v-btn>
          <v-progress-circular
            v-if="saving"
            indeterminate
            color="green"
          ></v-progress-circular>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      show: false,
      valid: true,
      input: {
        togglApiKey: null,
        meditationWid: null,
        meditationPid: null,
        focusWid: null,
        focusPid: null,
        focusEstimated: 2000,
      },
      apiKeyRules: [(v) => !!v || 'API Key is required'],
      numberRules: [(v) => /^\d+$/.test(v) || 'ID must be number'],
      saving: false,
    }
  },
  computed: {
    ...mapState('userdata', ['settings']),
  },
  watch: {
    show(newVal, _) {
      if (newVal) {
        const meditation = {
          ...this.settings.toggl.projects.find((p) => p.name === 'meditation'),
        }
        const focus = {
          ...this.settings.toggl.projects.find((p) => p.name === 'focus'),
        }
        this.input = {
          togglApiKey: this.settings.toggl.apiKey,
          meditationWid: meditation.wid,
          meditationPid: meditation.pid,
          focusWid: focus.wid,
          focusPid: focus.pid,
          focusEstimated: this.settings.focusEstimated,
        }
      }
    },
  },
  methods: {
    async save() {
      this.saving = true
      await this.$store.dispatch('userdata/saveTogglSettings', {
        apiKey: this.input.togglApiKey,
        projects: [
          {
            name: 'meditation',
            wid: this.input.meditationWid,
            pid: this.input.meditationPid,
          },
          {
            name: 'focus',
            wid: this.input.focusWid,
            pid: this.input.focusPid,
          },
        ],
      })
      await this.$store.dispatch('userdata/saveFocusEstimated', {
        hours: this.input.focusEstimated,
      })
      this.saving = false
    },
    async reset() {
      this.saving = true
      await this.$store.dispatch('userdata/removeTogglSettings')
      this.saving = false
    },
  },
}
</script>
