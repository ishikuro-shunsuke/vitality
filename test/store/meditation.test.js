import * as meditation from '@/store/meditation/index'

let state = {}

describe('initial state', () => {
  beforeEach(() => {
    state = {
      weekEntries: Array(7).fill(0),
    }
  })

  test('weekTotal returns 0', () => {
    expect(meditation.getters.weekTotal(state)).toBe(0)
  })

  test('setWeekEntries injects an array of 7 elements into weekEntries', () => {
    meditation.mutations.setWeekEntries(state, [0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(state.weekEntries).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})

describe('overwrite', () => {
  beforeEach(() => {
    state = {
      weekEntries: [20, 30, 40, 40, 12, 30, 0],
    }
  })

  test('weekTotal returns sum of weekEntries value', () => {
    expect(meditation.getters.weekTotal(state)).toBe(172)
  })

  test('setWeekEntries overwrites weekEntries', () => {
    meditation.mutations.setWeekEntries(state, [10, 23, 40, 11, 32, 0, 0])
    expect(state.weekEntries).toEqual([10, 23, 40, 11, 32, 0, 0])
    expect(meditation.getters.weekTotal(state)).toBe(116)
  })
})

describe('actions', () => {
  const commit = jest.fn()
  const axios = {
    $get: jest.fn(),
  }
  meditation.actions.$axios = axios

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('fetchWeekTotal', () => {
    test('fetchWeekTotal throws exception when the parameters are not valid', async () => {
      const rootGetters = {
        userdata: {
          meditationSettingExists: true,
          meditationSetting: {
            apiKey: 'abc123',
            wid: 'qwerty123',
            pid: 'uiop456',
          }
        },
      }
      axios.$get.mockRejectedValue({
        response: {
          status: 503
        }
      })
      await expect(meditation.actions.fetchWeekTotal({ commit, rootGetters })).rejects.toThrowError()
    })
    test('fetchWeekTotal fetch toggl API with settings params and commit setWeekEntries', async () => {
      let rootGetters = {
        userdata: {
          meditationSettingExists: false,
        },
      }
      await meditation.actions.fetchWeekTotal({ commit, rootGetters })
      expect(axios.$get).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()

      rootGetters.userdata.meditationSettingExists = true
      rootGetters.userdata.meditationSetting = {
        apiKey: 'abc123',
        wid: 'qwerty123',
        pid: 'uiop456',
      }
      axios.$get.mockResolvedValue({
        week_totals: [0, 60000, 120000, 180000, 240000, 300000, 360000],
      })

      await meditation.actions.fetchWeekTotal({ commit, rootGetters })
      expect(axios.$get).toHaveBeenCalledWith(
        'https://api.track.toggl.com/reports/api/v2/weekly',
        {
          auth: {
            username: 'abc123',
            password: 'api_token',
          },
          params: {
            workspace_id: 'qwerty123',
            project_ids: 'uiop456',
            user_agent: 'Vitality',
          },
        }
      )
      expect(commit).toHaveBeenCalledWith(
        'setWeekEntries',
        [0, 1, 2, 3, 4, 5, 6]
      )
    })
  })
})
