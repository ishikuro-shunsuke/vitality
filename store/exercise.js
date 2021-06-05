export const state = () => ({
  achivements: new Array(7).fill([
    { date: null, active: false, acvitivies: [] },
  ]),
})

export const mutations = {
  setAchivements(state, entries) {
    state.achivements = entries
  },
}

export const actions = {
  async fetchWeeklyReport({ commit }) {
    if (!this.$auth.strategy.token.status().valid()) {
      return
    }

    const now = new Date()
    const dates = new Array(7).fill().map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const yyyy = `${d.getFullYear()}`
      const mm = `0${d.getMonth() + 1}`.slice(-2)
      const dd = `0${d.getDate()}`.slice(-2)
      return `${yyyy}-${mm}-${dd}`
    })
    const promises = dates.map((date) =>
      this.$axios.$get(
        `https://api.fitbit.com/1/user/-/activities/date/${date}.json`,
        { headers: { Authorization: this.$auth.strategy.token.get() } }
      )
    )
    try {
      const results = await Promise.all(promises)
      const achivements = results.map((d, i) => {
        return {
          date: dates[i],
          active:
            d.summary.veryActiveMinutes + d.summary.fairlyActiveMinutes > 20,
          activities: d.activities.map((activity) => activity.name),
        }
      })
      commit('setAchivements', achivements)
    } catch (error) {
      console.error(error)
    }
  },
}
