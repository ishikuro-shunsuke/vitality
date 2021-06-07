import { API } from 'aws-amplify'
import * as gqlMutations from '../graphql/mutations'
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
  timer: {
    startTime: null,
    running: false,
    duration: 0,
    intervalId: null,
  },
})

export const getters = {
  weekTotal(state) {
    return state.weekEntries.reduce((acc, val) => acc + val, 0)
  },
  settingsExist(state) {
    return (
      state.settings.apiKey.length > 0 &&
      state.settings.workspaceId !== null &&
      state.settings.projectId !== null
    )
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
  initTimerWith(state, startTime) {
    state.timer.startTime = startTime
    state.timer.running = true
  },
  resetTimer(state) {
    clearInterval(state.timer.intervalId)
    state.timer.duration = 0
    state.timer.startTime = null
    state.timer.running = false
  },
  setIntervalId(state, intervalId) {
    state.timer.intervalId = intervalId
  },
  setDuration(state, duration) {
    state.timer.duration = duration
  },
}

export const actions = {
  async getRunningEntry({ state, getters }) {
    if (!getters.settingsExist) {
      return null
    }

    const result = await this.$axios.$get(
      'https://api.track.toggl.com/api/v8/time_entries/current',
      {
        auth: {
          username: state.settings.apiKey,
          password: 'api_token',
        },
      }
    )

    // no running entry
    if (!result.data) {
      return null
    }

    // found running meditation
    if (
      result.data.wid === state.settings.workspaceId &&
      result.data.pid === state.settings.projectId
    ) {
      return result.data
    }

    // found other running project
    return null
  },
  async checkCurrentEntry({ commit, dispatch }) {
    commit('pending')
    try {
      const data = await dispatch('getRunningEntry')
      if (data) {
        commit('initTimerWith', new Date(data.start))
      }
    } catch (error) {
      commit('print', error, { root: true })
    }
    commit('done')
  },
  async startTimer({ commit, state, dispatch, getters }) {
    commit('pending')
    if (!getters.settingsExist) {
      return
    }
    const data = await dispatch('getRunningEntry')
    if (data) {
      return
    }
    const result = await this.$axios.$post(
      'https://api.track.toggl.com/api/v8/time_entries/start',
      {
        time_entry: {
          description: 'Meditaion(vitality app)',
          start: new Date().toISOString(),
          pid: state.settings.projectId,
          wid: state.settings.workspaceId,
          created_with: 'Vitality',
        },
      },
      {
        auth: {
          username: state.settings.apiKey,
          password: 'api_token',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    )
    commit('initTimerWith', new Date(result.data.start))
    commit('done')
  },
  async stopTimer({ commit, state, dispatch, getters }) {
    commit('pending')
    if (!getters.settingsExist) {
      return
    }
    const data = await dispatch('getRunningEntry')
    if (!data) {
      return
    }
    await this.$axios.$put(
      `https://api.track.toggl.com/api/v8/time_entries/${data.id}/stop`,
      {},
      {
        auth: {
          username: state.settings.apiKey,
          password: 'api_token',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    )
    commit('resetTimer')
    commit('done')
  },
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
      commit('print', error, { root: true })
    } finally {
      commit('saved')
    }
  },
  async removeSettings({ commit }) {
    commit('saving')
    try {
      await API.graphql({ query: gqlMutations.removeTogglSettings })
      commit('loadSettings', { apiKey: '', workspaceId: null, projectId: null })
    } catch (error) {
      commit('print', error, { root: true })
    }
    commit('saved')
  },
  async fetchWeeklyReport({ commit, state, getters }) {
    if (!getters.settingsExist) {
      return
    }
    commit('pending')
    const result = await this.$axios.$get(
      'https://api.track.toggl.com/reports/api/v2/weekly',
      {
        auth: {
          username: state.settings.apiKey,
          password: 'api_token',
        },
        params: {
          workspace_id: state.settings.workspaceId,
          project_ids: state.settings.projectId,
          user_agent: UA,
        },
      }
    )
    commit(
      'setWeekEntries',
      result.week_totals.map((v) => Math.floor(v / 1000 / 60))
    )
    commit('done')
  },
}
