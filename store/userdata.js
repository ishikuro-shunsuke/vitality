import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  settings: {
    toggl: {
      apiKey: '',
      meditation: {
        wid: '',
        pid: '',
      },
      focus: {
        wid: '',
        pid: '',
      },
    },
  },
  cache: {
    exercise: {
      achievements: [],
    },
  },
})

export const getters = {
  meditationSettingExists(state) {
    return !!(
      state.settings.toggl.apiKey &&
      state.settings.toggl.meditation.wid &&
      state.settings.toggl.meditation.pid
    )
  },
  focusSettingExists(state) {
    return !!(
      state.settings.toggl.apiKey &&
      state.settings.toggl.focus.wid &&
      state.settings.toggl.focus.pid
    )
  },
  meditationSetting(state) {
    return {
      apiKey: state.settings.toggl.apiKey,
      wid: state.settings.toggl.meditation.wid,
      pid: state.settings.toggl.meditation.pid,
    }
  },
  focusSetting(state) {
    return {
      apiKey: state.settings.toggl.apiKey,
      wid: state.settings.toggl.focus.wid,
      pid: state.settings.toggl.focus.pid,
    }
  },
}

export const mutations = {
  setSettings(state, { key, value }) {
    state.settings = { ...state.settings, [key]: value }
  },
  setCache(state, { key, value }) {
    state.cache = { ...state.cache, [key]: value }
  },
}

export const actions = {
  async saveTogglSettings({ state, commit }, { apiKey, meditation, focus }) {
    commit('setSettings', {
      key: 'toggl',
      value: { apiKey, meditation, focus },
    })
    try {
      await API.graphql({
        query: gqlMutations.saveTogglSettings,
        variables: { input: state.settings.toggl },
      })
    } catch (error) {
      throw new Error(error.errors[0].message)
    }
  },

  async saveExerciseCache({ state, commit }, { achievements }) {
    commit('setCache', { key: 'exercise', value: { achievements } })
    try {
      await API.graphql({
        query: gqlMutations.saveExerciseCache,
        variables: { input: state.cache.exercise },
      })
    } catch (error) {
      throw new Error(error.errors[0].message)
    }
  },

  async fetchUserData({ commit }) {
    try {
      const user = (await API.graphql({ query: gqlQueries.user })).data.user
      if (user.settings?.toggl) {
        commit('setSettings', { key: 'toggl', value: user.settings.toggl })
      }

      // TODO: test this condition
      if (user.cache?.exercise?.achievements?.length > 0) {
        const now = new Date()
        // Prepare blank data
        const diff =
          (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
            (new Date(user.cache.exercise.achievements[0].date).getTime() +
              new Date().getTimezoneOffset() * 60 * 1000)) /
          (1000 * 60 * 60 * 24)
        const fill = Array(diff)
          .fill(0)
          .map((_, i) => {
            return {
              date: this.$toyyyymmdd(
                new Date(now.getTime() - i * (1000 * 60 * 60 * 24))
              ),
              active: false,
              activities: [],
            }
          })
        // Shift old cache and fill by new blank data
        const achievements = [
          ...fill,
          ...user.cache.exercise.achievements,
        ].slice(0, 7)

        commit('setCache', { key: 'exercise', value: { achievements } })
      }
    } catch (error) {
      throw new Error(error.errors[0].message)
    }
  },
}
