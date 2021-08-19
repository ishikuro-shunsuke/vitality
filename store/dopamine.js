import { API, graphqlOperation } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'
import * as gqlSubscriptions from '../graphql/subscriptions'

export const state = () => ({
  stimulation: [],
  today: 0,
})

export const mutations = {
  setStimulations(state, stimulations) {
    state.stimulation = stimulations
  },

  setTodaysCount(state, count) {
    state.today = count

    const today = this.$toyyyymmdd(new Date())
    const i = state.stimulation.findIndex((i) => i.date === today)
    const e = { date: today, count }
    if (i >= 0) {
      this._vm.$set(state.stimulation, i, e)
    } else {
      state.stimulation.push(e)
    }
  },
}

export const actions = {
  async stimulate() {
    try {
      await API.graphql({
        query: gqlMutations.stimulate,
        variables: { timezone: 'Asia/Tokyo' },
      })
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async fetchStimulations({ commit }) {
    try {
      const result = await API.graphql({ query: gqlQueries.stimulation })
      commit('setStimulations', result.data.stimulation)
      const today = this.$toyyyymmdd(new Date())
      const todaysCount =
        result.data.stimulation.find((i) => i.date === today)?.count || 0
      commit('setTodaysCount', todaysCount)
    } catch (error) {
      throw new Error(error.message)
    }
  },
  subscribeStimulations({ commit, dispatch }) {
    API.graphql(graphqlOperation(gqlSubscriptions.stimulated)).subscribe({
      next: ({ value }) => {
        commit('setTodaysCount', value.data.stimulated)
      },
      error: (_) => {
        dispatch('fetchStimulations')
      },
    })
  },
}
