<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>Toggl Track</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form ref="form" v-model="valid">
          <p>
            <a href="https://track.toggl.com/profile">
              https://track.toggl.com/profile
            </a>
          </p>
          <v-text-field
            v-model="input.apiKey"
            :rules="apiKeyRules"
            label="API Key"
          ></v-text-field>
          <v-text-field
            v-model="input.workspaceId"
            :rules="numberRules"
            label="Workspace ID"
          ></v-text-field>
          <v-text-field
            v-model="input.projectId"
            :rules="numberRules"
            label="Project ID"
          ></v-text-field>
          <v-btn :disabled="!valid" @click="save">Save</v-btn>
          <v-btn :disabled="!valid" @click="reset">Reset</v-btn>
          <v-progress-circular
            v-if="saving"
            indeterminate
            color="green"
          ></v-progress-circular>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      valid: true,
      input: {
        apiKey: '',
        workspaceId: null,
        projectId: null,
      },
      apiKeyRules: [(v) => !!v || 'API Key is required'],
      numberRules: [
        (v) => !!v || 'ID is required',
        (v) => /^\d+$/.test(v) || 'ID must be number',
      ],
    }
  },
  computed: {
    value() {
      return (this.elapsed / 7.0) * 100
    },
    ...mapState('meditation', ['settings', 'saving']),
  },
  watch: {
    settings(val, _) {
      this.input = { ...val }
    },
  },
  mounted() {
    this.input = { ...this.settings }
  },
  methods: {
    ...mapActions('meditation', ['saveSettings', 'removeSettings']),
    async save() {
      await this.saveSettings(this.input)
    },
    async reset() {
      await this.removeSettings()
    },
  },
}
</script>
