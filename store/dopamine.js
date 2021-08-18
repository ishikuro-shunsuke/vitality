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

      const now = new Date()
      const paddingMM = `0${now.getMonth() + 1}`.slice(-2)
      const paddingDD = `0${now.getDate()}`.slice(-2)
      const yyyyMMdd = `${now.getFullYear()}-${paddingMM}-${paddingDD}`
      const todaysCount =
        result.data.stimulation.find((s) => s.date === yyyyMMdd)?.count || 0
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
      error: (error) => console.warn(error),
    })
  },
}
