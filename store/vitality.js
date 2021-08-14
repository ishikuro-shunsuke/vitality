import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
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
  calendar(state) {
    const c = []
    const oldestDate =
      state.emissions.length === 0
        ? new Date()
        : new Date(Math.min(...state.emissions) * 1000)

    // generate month container
    const today = new Date()
    let iter = new Date(oldestDate.getFullYear(), oldestDate.getMonth())
    while (iter < today) {
      const nextMonth = new Date(iter.getFullYear(), iter.getMonth() + 1)
      c.unshift({
        label: `${iter.getFullYear()}/${iter.getMonth() + 1}`,
        start: iter,
        end: nextMonth,
        count: 0,
      })
      iter = nextMonth
    }

    // count monthly emissions
    state.emissions.forEach((e) => {
      const i = c.findIndex(
        (m) => e >= m.start.getTime() / 1000 && e < m.end.getTime() / 1000
      )
      c[i].count++
    })

    return c
  },
}

export const mutations = {
  addEmissions(state, emissions) {
    const newEmissions = Array.isArray(emissions) ? emissions : [emissions]
    const epochEmissions = newEmissions.map((e) =>
      e instanceof Date ? Math.floor(e.getTime() / 1000) : e
    )
    state.emissions = [...state.emissions, ...epochEmissions]
  },
}

export const actions = {
  async emit({ commit }) {
    try {
      const result = await API.graphql({ query: gqlMutations.emit })
      commit('addEmissions', [result.data.emit])
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async fetchEmissions({ commit }) {
    try {
      const result = await API.graphql({ query: gqlQueries.emission })
      commit('addEmissions', result.data.emission.history)
    } catch (error) {
      throw new Error(error.message)
    }
  },
}
