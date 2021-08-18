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

      const yyyymmdd = this.$toyyyymmdd(new Date())
      const todaysCount =
        result.data.stimulation.find((s) => s.date === yyyymmdd)?.count || 0
      commit('setTodaysCount', todaysCount)
    } catch (error) {
      throw new Error(error.message)
    }
  },
  subscribeStimulations({ commit }) {
    API.graphql(graphqlOperation(gqlSubscriptions.stimulated)).subscribe({
      next: ({ value }) => {
        commit('setTodaysCount', value.data.stimulated)
      },
      error: (error) => commit('print', error, { root: true }),
    })
  },
}
