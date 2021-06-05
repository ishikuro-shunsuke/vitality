import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'

export const actions = {
  async fetchSettings({ commit }) {
    const settings = (await API.graphql({ query: gqlQueries.settings })).data
      .settings

    if (settings.toggl) {
      commit('meditation/loadSettings', settings.toggl)
    }
  },
}
