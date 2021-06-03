import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'

export const actions = {
  async fetchSettings({ commit, dispatch }) {
    const result = await API.graphql({ query: gqlQueries.settings })
    commit('meditation/loadSettings', result.data.settings.toggl)
    await dispatch('meditation/fetchWeeklyReport')
  },
}
