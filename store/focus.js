const UA = 'Vitality'

export const state = () => ({
  yearlyTotal: 7200000000,
  projectName: 'Focus on one thing.',
  recentTaskName: '',
})

export const mutations = {
  setYearlyTotal(state, yearlyTotal) {
    state.yearlyTotal = yearlyTotal
  },
  setProjectName(state, name) {
    state.projectName = name
  },
  setRecentTaskName(state, name) {
    state.recentTaskName = name === 'focus(vitality app)' ? '' : name
  },
}

export const actions = {
  async fetchSummary({ commit, rootGetters }) {
    const config = rootGetters['userdata/projectConfig']('focus')
    if (!config) {
      return
    }

    const now = new Date()
    const until = `${now.getUTCFullYear()}-${
      now.getUTCMonth() + 1
    }-${now.getUTCDate()}`
    const oneYearAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 365
    )
    const since = `${oneYearAgo.getUTCFullYear()}-${
      oneYearAgo.getUTCMonth() + 1
    }-${oneYearAgo.getUTCDate()}`
    try {
      const result = await this.$axios.$get(
        'https://api.track.toggl.com/reports/api/v2/summary',
        {
          auth: {
            username: config.apiKey,
            password: 'api_token',
          },
          params: {
            workspace_id: config.wid,
            project_ids: config.pid,
            user_agent: UA,
            since,
            until,
          },
        }
      )
      commit('setYearlyTotal', result.total_grand)
      commit('setProjectName', result.data[0]?.title?.project)
    } catch (error) {
      throw new Error(error.response.data)
    }
  },
}
