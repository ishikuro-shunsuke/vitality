import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  pending: true,
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
  pending(state) {
    state.pending = true
  },
  done(state) {
    state.pending = false
  },
  addEmissions(state, emissions) {
    state.emissions = [...state.emissions, ...emissions]
  },
}

export const actions = {
  async emit({ commit }) {
    const result = await API.graphql({ query: gqlMutations.emit })
    commit('addEmissions', [result.data.emit])
  },
  async fetchEmissions({ commit }) {
    commit('pending')
    const result = await API.graphql({ query: gqlQueries.emission })
    commit('addEmissions', result.data.emission.history)
    commit('done')
  },
}
