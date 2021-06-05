import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  pending: true,
  emissions: [],
  calendar: [],
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
  initCalendar(state) {
    const now = new Date()
    state.calendar.push({
      label: `${now.getFullYear()}/${now.getMonth() + 1}`,
      start: new Date(now.getFullYear(), now.getMonth()),
      end: new Date(now.getFullYear(), now.getMonth() + 1),
      count: 0,
    })
  },
  generateNewMonthRange(state, oldestDate) {
    const oldestMonth = new Date(
      Math.min(...state.calendar.map((m) => m.start))
    )
    if (oldestMonth < oldestDate) {
      return
    }
    let i = 1
    while (
      new Date(oldestMonth.getFullYear(), oldestMonth.getMonth() - i + 1) >
      oldestDate
    ) {
      const cur = new Date(
        oldestMonth.getFullYear(),
        oldestMonth.getMonth() - i
      )
      state.calendar.push({
        label: `${cur.getFullYear()}/${cur.getMonth() + 1}`,
        start: cur,
        end: new Date(cur.getFullYear(), cur.getMonth() + 1),
        count: 0,
      })
      i++
    }
  },
  insertDataToCalendar(state) {
    state.emissions.forEach((e) => {
      const i = state.calendar.findIndex(
        (m) => e >= m.start / 1000 && e < m.end / 1000
      )
      if (i !== -1) {
        state.calendar[i].count++
      }
    })
  },
  incrementCalendar(state) {
    state.calendar[0].count++
  },
}

export const actions = {
  async emit({ commit }) {
    const result = await API.graphql({ query: gqlMutations.emit })
    commit('addEmissions', [result.data.emit])
    commit('incrementCalendar')
  },
  async fetchEmissions({ state, commit }) {
    commit('pending')
    const result = await API.graphql({ query: gqlQueries.emission })
    commit('addEmissions', result.data.emission.history)
    commit('initCalendar')
    const oldest =
      state.emissions.length === 0
        ? new Date()
        : new Date(Math.min(...state.emissions) * 1000)
    commit('generateNewMonthRange', oldest)
    commit('insertDataToCalendar')
    commit('done')
  },
}
