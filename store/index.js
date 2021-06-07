import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'

export const state = () => ({
  snackbar: {
    display: false,
    text: '',
  },
})

export const mutations = {
  print(state, message) {
    state.snackbar.display = true
    state.snackbar.text = message
    console.log('[Vitality]', message)
  },
  clearAlert(state) {
    state.snackbar.display = false
  },
}

export const actions = {
  async fetchUserData({ commit }) {
    try {
      const user = (await API.graphql({ query: gqlQueries.user })).data.user
      if (user.toggl) {
        commit('meditation/loadSettings', user.toggl)
      }

      if (user.cache && user.cache.exercise) {
        commit('exercise/loadCache', user.cache.exercise)
      }
    } catch (error) {
      commit('print', error)
    }
  },
}
