import { API } from 'aws-amplify'
import axios from 'axios'
import * as gqlMutations from '../graphql/mutations'
const WEEKLY_API = 'https://api.track.toggl.com/reports/api/v2/weekly'
const UA = 'Vitality'

export const state = () => ({
  initialized: false,
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
  initialized(state) {
    state.initialized = true
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
  async fetchWeeklyReport({ commit, state }) {
    try {
      const result = await axios.get(WEEKLY_API, {
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
        result.data.week_totals.map((v) => Math.floor(v / 1000 / 60))
      )
    } catch (error) {
      console.log(error)
    }
  },
}
