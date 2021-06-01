import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'

export const actions = {
  async initialize() {
    const result = await API.graphql({ query: gqlQueries.emission })
    this.commit('vitality/addEmissions', result.data.emission.history)
    this.commit('vitality/initialized')
  },
}
