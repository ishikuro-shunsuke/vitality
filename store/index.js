import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  initialized: false,
  emissions: [],
  nextToken: null,
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
  setNextToken(state, nextToken) {
    state.nextToken = nextToken
  },
}

export const actions = {
  async initialize() {
    const result = await API.graphql({ query: gqlQueries.emission })
    this.commit('addEmissions', result.data.emission.history)
    this.commit('setNextToken', result.data.emission.nextToken)
    this.commit('initialized')
  },
  async fetchNextPage() {
    const result = await API.graphql({
      query: gqlQueries.emission,
      variables: { nextToken: this.this.state.nextToken },
    })
    this.commit('addEmissions', result.data.emission.history)
    this.commit('setNextToken', result.data.emission.nextToken)
  },
  async emit() {
    const result = await API.graphql({ query: gqlMutations.emit })
    this.commit('addEmissions', [result.data.emit])
  },
}
