<template>
  <v-dialog v-model="hiding" max-width="600px">
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
            v-model="input.toggl.apiKey"
            label="API Key"
            :rules="apiKeyRules"
          ></v-text-field>
        </v-card-text>
        <v-card-subtitle>Meditaiton</v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="input.toggl.meditation.wid"
            label="Workspace ID"
            :rules="numberRules"
          ></v-text-field>
          <v-text-field
            v-model="input.toggl.meditation.pid"
            label="Project ID"
            :rules="numberRules"
          ></v-text-field>
        </v-card-text>
        <v-card-subtitle>Focus</v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="input.toggl.focus.wid"
            label="Workspace ID"
            :rules="numberRules"
          ></v-text-field>
          <v-text-field
            v-model="input.toggl.focus.pid"
            label="Project ID"
            :rules="numberRules"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid" text @click="reset">Reset</v-btn>
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
      hiding: false,
      valid: true,
      input: {
        toggl: {
          apiKey: null,
          meditation: {
            wid: null,
            pid: null,
          },
          focus: {
            wid: null,
            pid: null,
          },
        },
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
    hiding(_, newVal) {
      if (!newVal) {
        this.input = { ...this.settings }
      }
    },
  },
  methods: {
    async save() {
      this.saving = true
      await this.$store.dispatch('userdata/saveTogglSettings', {
        apiKey: this.input.toggl.apiKey,
        focus: this.input.toggl.focus,
        meditation: this.input.toggl.meditation,
      })
      this.saving = false
    },
    async reset() {
      this.saving = true
      await this.$store.dispatch('userdata/saveTogglSettings', {
        apiKey: null,
        meditation: {
          wid: null,
          pid: null,
        },
        focus: {
          wid: null,
          pid: null,
        },
      })
      this.saving = false
    },
  },
}
</script>
