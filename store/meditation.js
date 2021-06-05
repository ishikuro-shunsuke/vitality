import { API } from 'aws-amplify'
import * as gqlMutations from '../graphql/mutations'
const WEEKLY_API = 'https://api.track.toggl.com/reports/api/v2/weekly'
const UA = 'Vitality'

export const state = () => ({
  pending: false,
  settings: {
    apiKey: '',
    workspaceId: null,
    projectId: null,
  },
  saving: false,
  weekEntries: Array(7).fill(0),
})

export const getters = {
  weekTotal(state) {
    return state.weekEntries.reduce((acc, val) => acc + val, 0)
  },
}

export const mutations = {
  pending(state) {
    state.pending = true
  },
  done(state) {
    state.pending = false
  },
  loadSettings(state, settings) {
    state.settings = settings
  },
  saved(state) {
    state.saving = false
  },
  saving(state) {
    state.saving = true
  },
  setWeekEntries(state, weekEntries) {
    state.weekEntries = weekEntries.slice(0, 7)
  },
}

export const actions = {
  async saveSettings({ commit, dispatch }, settings) {
    try {
      commit('saving')
      await API.graphql({
        query: gqlMutations.saveTogglSettings,
        variables: { input: { ...settings } },
      })
      commit('loadSettings', settings)
      await dispatch('fetchWeeklyReport')
    } catch (error) {
      console.log(error)
    } finally {
      commit('saved')
    }
  },
  async removeSettings({ commit }) {
    commit('saving')
    await API.graphql({ query: gqlMutations.removeTogglSettings })
    commit('loadSettings', { apiKey: '', workspaceId: null, projectId: null })
    commit('saved')
  },
  async fetchWeeklyReport({ commit, state }) {
    if (
      state.settings.apiKey.length === 0 ||
      !state.settings.workspaceId ||
      !state.settings.projectId
    ) {
      return
    }

    try {
      commit('pending')
      const result = await this.$axios.$get(WEEKLY_API, {
        auth: {
          username: state.settings.apiKey,
          password: 'api_token',
        },
        params: {
          workspace_id: state.settings.workspaceId,
          project_ids: state.settings.projectId,
          user_agent: UA,
        },
      })
      commit(
        'setWeekEntries',
        result.week_totals.map((v) => Math.floor(v / 1000 / 60))
      )
      commit('done')
    } catch (error) {
      console.log(error)
    }
  },
}
