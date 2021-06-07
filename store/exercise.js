import API from '@aws-amplify/api'
import * as gqlMutations from '../graphql/mutations'

const toyyyymmdd = (d) => {
  const yyyy = `${d.getFullYear()}`
  const mm = `0${d.getMonth() + 1}`.slice(-2)
  const dd = `0${d.getDate()}`.slice(-2)
  return `${yyyy}-${mm}-${dd}`
}

export const state = () => ({
  achievements: new Array(7).fill([
    { date: null, active: false, acvitivies: [] },
  ]),
  achievementsCache: new Array(7).fill([
    { date: null, active: false, acvitivies: [] },
  ]),
  valid: false,
})

export const mutations = {
  setAchievements(state, entries) {
    state.achievements = entries
  },
  invalidateToken(state) {
    state.valid = false
  },
  confirmedToken(state) {
    state.valid = true
  },
  loadCache(state, cache) {
    const now = new Date()
    const diff =
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
        (new Date(cache[0].date).getTime() +
          new Date().getTimezoneOffset() * 60 * 1000)) /
      (1000 * 60 * 60 * 24)
    const fill = Array(diff)
      .fill(0)
      .map((_, i) => {
        return {
          date: toyyyymmdd(new Date(now.getTime() - i * (1000 * 60 * 60 * 24))),
          active: false,
          activities: [],
        }
      })
    state.achievementsCache = [...fill, ...cache].slice(0, 7)
  },
}

export const actions = {
  async saveCacheToRemote({ state, commit }) {
    try {
      await API.graphql({
        query: gqlMutations.saveCache,
        variables: { input: { exercise: state.achievements } },
      })
    } catch (error) {
      commit('print', error, { root: true })
    }
  },
  async fetchWeeklyReport({ commit, dispatch, state }) {
    if (!this.$auth.strategy.token.status().valid()) {
      return
    }

    const now = new Date()
    const dates = new Array(7).fill().map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      return toyyyymmdd(d)
    })
    const promises = dates.map((date) =>
      this.$axios.$get(
        `https://api.fitbit.com/1/user/-/activities/date/${date}.json`,
        { headers: { Authorization: this.$auth.strategy.token.get() } }
      )
    )

    const results = await Promise.all(promises)
    const achievements = results.map((d, i) => {
      return {
        date: dates[i],
        active:
          d.summary.veryActiveMinutes + d.summary.fairlyActiveMinutes > 20,
        activities: d.activities.map((activity) => activity.name),
      }
    })
    commit('setAchievements', achievements)
    commit('loadCache', achievements)
    dispatch('saveCacheToRemote')
  },
}
