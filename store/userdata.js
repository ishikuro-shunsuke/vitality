import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  settings: {
    toggl: {
      apiKey: '',
      projects: [
        {
          name: 'meditation',
          wid: '',
          pid: '',
        },
        {
          name: 'focus',
          wid: '',
          pid: '',
        },
      ],
    },
    focusEstimated: 2000,
  },
  cache: {
    exercise: {
      achievements: [],
    },
  },
})

export const getters = {
  projectConfig(state) {
    return (key) => {
      const project = state.settings.toggl.projects.find((p) => p.name === key)
      if (state.settings.toggl.apiKey && project?.wid && project?.pid) {
        return {
          apiKey: state.settings.toggl.apiKey,
          wid: project.wid,
          pid: project.pid,
        }
      } else {
        return null
      }
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
  async saveTogglSettings({ state, commit }, { apiKey, projects }) {
    commit('setSettings', {
      key: 'toggl',
      value: { apiKey, projects },
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

  async removeTogglSettings({ commit }) {
    commit('setSettings', {
      key: 'toggl',
      value: {
        apiKey: '',
        projects: [
          {
            name: 'meditation',
            wid: '',
            pid: '',
          },
          {
            name: 'focus',
            wid: '',
            pid: '',
          },
        ],
      },
    })
    try {
      await API.graphql({
        query: gqlMutations.removeTogglSettings,
      })
    } catch (error) {
      throw new Error(error.errors[0].message)
    }
  },

  async saveFocusEstimated({ state, commit }, { hours }) {
    commit('setSettings', { key: 'focusEstimated', value: hours })
    try {
      await API.graphql({
        query: gqlMutations.saveFocusEstimated,
        variables: { hours: state.settings.focusEstimated },
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
      if (user.settings?.focusEstimated) {
        commit('setSettings', {
          key: 'focusEstimated',
          value: user.settings.focusEstimated,
        })
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
