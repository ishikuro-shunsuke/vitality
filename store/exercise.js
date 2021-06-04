export const state = () => ({
  achivements: new Array(7).fill(false),
})

export const mutations = {
  setAchivements(state, entries) {
    state.achivements = entries
  },
}

export const actions = {
  async fetchWeeklyReport({ commit }) {
    if (!this.$auth.loggedIn) {
      return
    }
    const now = new Date()
    try {
      const result = await Promise.all(
        new Array(7).fill().map((_, i) => {
          const d = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - i
          )
          const yyyy = `0${d.getFullYear()}`
          const mm = `0${d.getMonth() + 1}`.slice(-2)
          const dd = `0${d.getDate()}`.slice(-2)
          const date = `${yyyy}-${mm}-${dd}`
          return this.$axios.$get(
            `https://api.fitbit.com/1/user/-/activities/date/${date}.json`,
            { headers: { Authorization: this.$auth.strategy.token.get() } }
          )
        })
      )
      const achivements = result.map(
        (d) => d.summary.veryActiveMinutes + d.summary.fairlyActiveMinutes > 20
      )
      commit('setAchivements', achivements)
    } catch (error) {
      console.error(error)
    }
  },
}
