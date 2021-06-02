import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'

export const actions = {
  initialize({ commit, dispatch }) {
    API.graphql({ query: gqlQueries.emission }).then((result) => {
      commit('vitality/addEmissions', result.data.emission.history)
      commit('vitality/initialized')
    })
    API.graphql({ query: gqlQueries.settings }).then(async (result) => {
      commit('meditation/loadSettings', result.data.settings.toggl)
      await dispatch('meditation/fetchWeeklyReport')
      commit('meditation/initialized')
    })
  },
}
