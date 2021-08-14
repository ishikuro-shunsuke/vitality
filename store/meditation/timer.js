export const state = () => ({
  startTime: null,
  running: false,
})

export const mutations = {
  initTimerWith(state, startTime) {
    if (!(startTime instanceof Date)) {
      throw new TypeError(
        `Given startTime is an instance of ${Object.getPrototypeOf(
          startTime
        )} should be a Date instace`
      )
    }
    state.startTime = startTime
    state.running = true
  },
  resetTimer(state) {
    state.startTime = null
    state.running = false
  },
}

export const actions = {
  async getRunningEntry({ commit, rootGetters }) {
    if (!rootGetters['userdata/meditationSettingExists']) {
      return null
    }
    try {
      const result = await this.$axios.$get(
        'https://api.track.toggl.com/api/v8/time_entries/current',
        {
          auth: {
            username: rootGetters['userdata/meditationSetting'].apiKey,
            password: 'api_token',
          },
        }
      )

      // no running entry
      if (!result.data) {
        return null
      }

      // found running meditation
      if (
        result.data.wid === rootGetters['userdata/meditationSetting'].wid &&
        result.data.pid === rootGetters['userdata/meditationSetting'].pid
      ) {
        commit('initTimerWith', new Date(result.data.start))
        return result
      }

      // found other running project
      return null
    } catch (error) {
      throw new Error(`toggl API results error ${error.response.status}`)
    }
  },
  async startTimer({ commit, dispatch, rootGetters }) {
    if (!rootGetters['userdata/meditationSettingExists']) {
      return null
    }
    try {
      const result = await dispatch('getRunningEntry')

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
          description: 'Meditaion(vitality app)',
          start: new Date().toISOString(),
          pid: rootGetters['userdata/meditationSetting'].pid,
          wid: rootGetters['userdata/meditationSetting'].wid,
          created_with: 'Vitality',
        },
      },
      {
        auth: {
          username: rootGetters['userdata/meditationSetting'].apiKey,
          password: 'api_token',
        },
        headers: { 'Content-Type': 'application/json' },
      }
    )
    commit('initTimerWith', new Date(result.data.start))
  },
  async stopTimer({ commit, dispatch, rootGetters }) {
    if (!rootGetters['userdata/meditationSettingExists']) {
      return null
    }
    try {
      const result = await dispatch('getRunningEntry')
      if (!result) {
        return
      }
      await this.$axios.$put(
        `https://api.track.toggl.com/api/v8/time_entries/${result.data.id}/stop`,
        {},
        {
          auth: {
            username: rootGetters['userdata/meditationSetting'].apiKey,
            password: 'api_token',
          },
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      throw new Error(error.message)
    }

    commit('resetTimer')
  },
}
