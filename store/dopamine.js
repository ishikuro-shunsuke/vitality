import { API } from 'aws-amplify'
import * as gqlQueries from '../graphql/queries'
import * as gqlMutations from '../graphql/mutations'

export const state = () => ({
  stimulation: [],
  today: 0,
})

export const mutations = {
  addStimulations(state, stimulations) {
    state.stimulation = stimulations
    console.log(state.stimulation)

    const now = new Date()
    const paddingMM = `0${now.getMonth() + 1}`.slice(-2)
    const paddingDD = `0${now.getDate()}`.slice(-2)
    const yyyyMMdd = `${now.getFullYear()}-${paddingMM}-${paddingDD}`
    state.today = state.stimulation.find((s) => s.date === yyyyMMdd)?.count || 0
  },
}

export const actions = {
  async stimulate({ dispatch }) {
    try {
      await API.graphql({
        query: gqlMutations.stimulate,
        variables: { timezone: 'Asia/Tokyo' },
      })
      await dispatch('fetchStimulations')
    } catch (error) {
      throw new Error(error.message)
    }
  },
  async fetchStimulations({ commit }) {
    try {
      const result = await API.graphql({ query: gqlQueries.stimulation })
      commit('addStimulations', result.data.stimulation)
    } catch (error) {
      throw new Error(error.message)
    }
  },
}
