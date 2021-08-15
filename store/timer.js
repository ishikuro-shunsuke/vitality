export const state = () => ({
  meditation: {
    startTime: null,
    running: false,
  },
  focus: {
    startTime: null,
    running: false,
  },
})

export const mutations = {
  setProjectState(state, { project, params }) {
    const n = { ...params, name: project }
    state.projects = [
      ...state.projects.map((p) => (p.name === project ? n : p)),
    ]
  },
  initTimer(state, { startTime, project }) {
    if (!(startTime instanceof Date)) {
      throw new TypeError(
        `Given startTime is an instance of ${Object.getPrototypeOf(
          startTime
        )} should be a Date instace`
      )
    }
    state[project] = {
      startTime,
      running: true,
    }
  },
  resetTimer(state, { project }) {
    state[project] = {
      startTime: null,
      running: false,
    }
  },
}

export const actions = {
  async getRunningEntry({ commit, rootGetters }, { project }) {
    const config = rootGetters['userdata/projectConfig'](project)
    if (!config) {
      return null
    }
    try {
      const result = await this.$axios.$get(
        'https://api.track.toggl.com/api/v8/time_entries/current',
        {
          auth: {
            username: config.apiKey,
            password: 'api_token',
          },
        }
      )

      // no running entry
      if (!result.data) {
        return null
      }

      // found running project
      if (result.data.wid === config.wid && result.data.pid === config.pid) {
        commit('initTimer', { project, startTime: new Date(result.data.start) })
        return result
      }

      // found other running project
      return null
    } catch (error) {
      throw new Error(`toggl API results error ${error.response.status}`)
    }
  },
  async startTimer({ commit, dispatch, rootGetters }, { project }) {
    const config = rootGetters['userdata/projectConfig'](project)
    if (!config) {
      return null
    }
    try {
      const result = await dispatch('getRunningEntry', { project })

      if (result) {
        throw new Error(
          'Another running entry already exists. Please check the toggl app.'
        )
      }
    } catch (error) {
      throw new Error(error.message)
    }

    const result = await this.$axios.$post(
      'https://api.track.toggl.com/api/v8/time_entries/start',
      {
        time_entry: {
          description: `${project}(vitality app)`,
          start: new Date().toISOString(),
          pid: config.pid,
          wid: config.wid,
          created_with: 'Vitality',
        },
      },
      {
        auth: {
          username: config.apiKey,
          password: 'api_token',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    )
    commit('initTimer', { project, startTime: new Date(result.data.start) })
  },
  async stopTimer({ commit, dispatch, rootGetters }, { project }) {
    const config = rootGetters['userdata/projectConfig'](project)
    if (!config) {
      return null
    }
    try {
      const result = await dispatch('getRunningEntry', { project })
      if (!result) {
        return
      }
      await this.$axios.$put(
        `https://api.track.toggl.com/api/v8/time_entries/${result.data.id}/stop`,
        {},
        {
          auth: {
            username: config.apiKey,
            password: 'api_token',
          },
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      throw new Error(error.message)
    }

    commit('resetTimer', { project })
  },
}
