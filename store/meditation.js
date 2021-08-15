const UA = 'Vitality'

export const state = () => ({
  weekEntries: Array(7).fill(0),
})

export const getters = {
  weekTotal(state) {
    return state.weekEntries.reduce((acc, val) => acc + val, 0)
  },
}

export const mutations = {
  setWeekEntries(state, weekEntries) {
    state.weekEntries = weekEntries.slice(0, 7)
  },
}

export const actions = {
  async fetchWeekTotal({ commit, rootGetters }) {
    const config = rootGetters['userdata/projectConfig']('meditation')
    if (!config) {
      return
    }

    try {
      const result = await this.$axios.$get(
        'https://api.track.toggl.com/reports/api/v2/weekly',
        {
          auth: {
            username: config.apiKey,
            password: 'api_token',
          },
          params: {
            workspace_id: config.wid,
            project_ids: config.pid,
            user_agent: UA,
          },
        }
      )
      commit(
        'setWeekEntries',
        result.week_totals.map((v) => Math.floor(v / 1000 / 60))
      )
    } catch (error) {
      throw new Error(error.response.data)
    }
  },
}
