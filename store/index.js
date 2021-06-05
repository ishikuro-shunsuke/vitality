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
  async fetchSettings({ commit }) {
    try {
      const settings = (await API.graphql({ query: gqlQueries.settings })).data
        .settings

      if (settings.toggl) {
        commit('meditation/loadSettings', settings.toggl)
      }
    } catch (error) {
      commit('print', error)
    }
  },
}
