export const state = () => ({
  achievements: new Array(7).fill([
    { date: null, active: false, acvitivies: [] },
  ]),
  loggedIn: false,
})

export const mutations = {
  setAchievements(state, entries) {
    state.achievements = entries
  },
  loggedIn(state) {
    state.loggedIn = true
  },
  loggedOut(state) {
    state.loggedIn = false
  },
}

export const actions = {
  async loginTrackerService({ commit }) {
    await this.$auth.loginWith('fitbit')
    commit('loggedIn')
  },
  async logoutTrackerService({ commit }) {
    await this.$auth.logout()
    commit('loggedOut')
  },
  checkAuthStatus() {
    return this.$auth.strategy.token.status().valid()
  },
  async fetchWeeklyReport({ commit, dispatch, rootState }) {
    if (!(await dispatch('checkAuthStatus'))) {
      if (rootState.userdata?.cache?.exercise?.achievements) {
        commit(
          'setAchievements',
          rootState.userdata.cache.exercise.achievements
        )
        return
      } else {
        throw new Error('This operation needs to login to fitbit service')
      }
    }

    const now = new Date()
    const dates = new Array(7).fill().map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      return this.$toyyyymmdd(d)
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
    dispatch('userdata/saveExerciseCache', { achievements }, { root: true })
  },
}
