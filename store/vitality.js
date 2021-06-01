import { API } from 'aws-amplify'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  initialized: false,
  emissions: [],
})

export const getters = {
  recent(state) {
    return state.emissions.length > 0 ? Math.max(...state.emissions) : null
  },
  elapsed(_, getters) {
    return getters.recent
      ? Math.floor((Date.now() / 1000 - getters.recent) / (60 * 60 * 24))
      : null
  },
}

export const mutations = {
  initialized(state) {
    state.initialized = true
  },
  addEmissions(state, emissions) {
    state.emissions = [...state.emissions, ...emissions]
  },
}

export const actions = {
  async emit() {
    const result = await API.graphql({ query: gqlMutations.emit })
    this.commit('vitality/addEmissions', [result.data.emit])
  },
}
