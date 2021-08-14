import * as timer from '@/store/meditation/timer'

let state = {}
let rootGetters = {}
const now = new Date(1625324429764) // 2021-07-03T15:00:29.764Z

beforeAll(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(now)
})

afterAll(() => {
  jest.useRealTimers()
})

describe('mutations', () => {
  test('initStartWith starts a timer and resetTimer clears it', () => {
    state = {
      startTime: null,
      running: false,
    }
    timer.mutations.initTimerWith(state, now)
    expect(state.startTime).toBe(now)
    expect(state.running).toBeTruthy()

    timer.mutations.resetTimer(state)
    expect(state.startTime).toBeNull()
    expect(state.running).toBeFalsy()
  })

  test('initStartWith allows only a Date instance as an argument', () => {
    state = {
      startTime: null,
      running: false,
    }
    expect(() => timer.mutations.initTimerWith(state, 0)).toThrowError()
  })
})

describe('actions', () => {
  const commit = jest.fn()
  const dispatch = jest.fn()
  const axios = {
    $get: jest.fn(),
    $post: jest.fn(),
    $put: jest.fn(),
  }
  timer.actions.$axios = axios

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('no settings', () => {
    beforeAll(() => {
      rootGetters = {
        userdata: {
          meditationSettingExists: false,
        },
      }
    })

    test('getRunningEntry returns null', async () => {
      expect(
        await timer.actions.getRunningEntry({ rootGetters, commit })
      ).toBeNull()
      expect(axios.$get).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })

    test('startTimer does nothing', async () => {
      await timer.actions.startTimer({ commit, dispatch, rootGetters })
      expect(axios.$post).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()
    })

    test('stopTimer does nothing', async () => {
      await timer.actions.stopTimer({ commit, dispatch, rootGetters })
      expect(axios.$put).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalled()
    })
  })

  describe('not valid settings', () => {
    beforeAll(() => {
      rootGetters = {
        userdata: {
          meditationSettingExists: true,
          meditationSetting: {
            apiKey: 'abc123',
            wid: 'qwerty123',
            pid: 'uiop456',
          },
        },
      }
      const error = {
        response: {
          status: 403,
        },
      }
      axios.$get.mockRejectedValue(error)
      axios.$post.mockRejectedValue(error)
      axios.$put.mockRejectedValue(error)
    })

    test('getRunningEntry throw an error', async () => {
      expect(
        timer.actions.getRunningEntry({ rootGetters, commit })
      ).rejects.toThrowError()
      expect(axios.$get).toHaveBeenCalledWith(
        'https://api.track.toggl.com/api/v8/time_entries/current',
        {
          auth: {
            username: 'abc123',
            password: 'api_token',
          },
        }
      )
      expect(commit).not.toHaveBeenCalled()
    })

    test('startTimer throw an error nothing', async () => {
      dispatch.mockRejectedValue('error')
      expect(
        timer.actions.startTimer({ commit, dispatch, rootGetters })
      ).rejects.toThrowError()
      expect(dispatch).toHaveBeenCalledWith('getRunningEntry')
      expect(axios.$post).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })

    test('stopTimer does nothing', async () => {
      dispatch.mockRejectedValue('error')
      expect(
        timer.actions.stopTimer({ commit, dispatch, rootGetters })
      ).rejects.toThrowError()
      expect(dispatch).toHaveBeenCalledWith('getRunningEntry')
      expect(axios.$put).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })
  })

  describe('init with valid settings', () => {
    beforeAll(() => {
      axios.$get.mockResolvedValue({ data: null })
      rootGetters = {
        userdata: {
          meditationSettingExists: true,
          meditationSetting: {
            apiKey: 'abc123',
            wid: 'qwerty123',
            pid: 'uiop456',
          },
        },
      }
    })

    test('getRunningEntry fetches no data', () => {
      expect(
        timer.actions.getRunningEntry({ rootGetters, commit })
      ).resolves.toBeNull()
      expect(commit).not.toBeCalled()
    })

    test('startTimer posts to API and commit initTimerWith', async () => {
      dispatch.mockResolvedValue(null)
      axios.$post.mockResolvedValue({
        data: {
          id: 436694100,
          pid: 'qwerty123',
          wid: 'uiop456',
          billable: false,
          start: '2013-03-05T07:58:58.000Z',
          duration: -1362470338,
          description: 'Meeting with possible clients',
          tags: ['billed'],
        },
      })
      await timer.actions.startTimer({ commit, dispatch, rootGetters })
      expect(dispatch).toHaveBeenCalledWith('getRunningEntry')
      expect(axios.$post).toHaveBeenCalledWith(
        'https://api.track.toggl.com/api/v8/time_entries/start',
        {
          time_entry: {
            description: 'Meditaion(vitality app)',
            start: '2021-07-03T15:00:29.764Z',
            wid: 'qwerty123',
            pid: 'uiop456',
            created_with: 'Vitality',
          },
        },
        {
          auth: {
            username: 'abc123',
            password: 'api_token',
          },
          headers: { 'Content-Type': 'application/json' },
        }
      )
      expect(commit).toHaveBeenLastCalledWith(
        'initTimerWith',
        new Date('2013-03-05T07:58:58.000Z')
      )
    })

    test('stopTimer do nothing', async () => {
      dispatch.mockResolvedValue(null)
      await timer.actions.stopTimer({ commit, dispatch, rootGetters })
      expect(dispatch).toHaveBeenLastCalledWith('getRunningEntry')
      expect(axios.$put).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })
  })

  describe('another project already running', () => {
    beforeAll(() => {
      axios.$get.mockResolvedValue({
        data: {
          id: 436694100,
          wid: 777,
          pid: 193791,
          billable: false,
          start: '2014-01-30T09:08:04+00:00',
          duration: -1391072884,
          description: 'Running time entry',
          at: '2014-01-30T09:08:12+00:00',
        },
      })
      rootGetters = {
        userdata: {
          meditationSettingExists: true,
          meditationSetting: {
            apiKey: 'abc123',
            wid: 'qwerty123',
            pid: 'uiop456',
          },
        },
      }
    })

    test('getRunningEntry returns null', () => {
      expect(
        timer.actions.getRunningEntry({ commit, rootGetters })
      ).resolves.toBeNull()
      expect(commit).not.toHaveBeenCalled()
    })

    test('startTimer allows starting meditaion even though another project has began', async () => {
      dispatch.mockResolvedValue(null)
      axios.$post.mockResolvedValue({
        data: {
          id: 436694100,
          pid: 'qwerty123',
          wid: 'uiop456',
          billable: false,
          start: '2013-03-05T07:58:58.000Z',
          duration: -1362470338,
          description: 'Meeting with possible clients',
          tags: ['billed'],
        },
      })
      await timer.actions.startTimer({ commit, dispatch, rootGetters })
      expect(axios.$post).toHaveBeenCalledWith(
        'https://api.track.toggl.com/api/v8/time_entries/start',
        {
          time_entry: {
            description: 'Meditaion(vitality app)',
            start: '2021-07-03T15:00:29.764Z',
            wid: 'qwerty123',
            pid: 'uiop456',
            created_with: 'Vitality',
          },
        },
        {
          auth: {
            username: 'abc123',
            password: 'api_token',
          },
          headers: { 'Content-Type': 'application/json' },
        }
      )
      expect(commit).toHaveBeenCalledWith(
        'initTimerWith',
        new Date('2013-03-05T07:58:58.000Z')
      )
    })

    test('stopTimer do nothing', async () => {
      dispatch.mockResolvedValue(null)
      await timer.actions.stopTimer({ commit, dispatch, rootGetters })
      expect(dispatch).toHaveBeenLastCalledWith('getRunningEntry')
      expect(axios.$put).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })
  })

  describe('meditation already running', () => {
    const current = {
      data: {
        id: 436694100,
        wid: 'qwerty123',
        pid: 'uiop456',
        billable: false,
        start: '2014-01-30T09:08:04+00:00',
        duration: -1391072884,
        description: 'Running time entry',
        at: '2014-01-30T09:08:12+00:00',
      },
    }

    beforeAll(() => {
      rootGetters = {
        userdata: {
          meditationSettingExists: true,
          meditationSetting: {
            apiKey: 'abc123',
            wid: 'qwerty123',
            pid: 'uiop456',
          },
        },
      }
    })

    test('getRunningEntry returns current entry data and commit initTimerWith', async () => {
      axios.$get.mockResolvedValue(current)
      await expect(
        timer.actions.getRunningEntry({ commit, rootGetters })
      ).resolves.toEqual(current)
      expect(axios.$get).toHaveBeenCalledWith(
        'https://api.track.toggl.com/api/v8/time_entries/current',
        {
          auth: {
            username: 'abc123',
            password: 'api_token',
          },
        }
      )
      expect(commit).toHaveBeenCalledWith(
        'initTimerWith',
        new Date('2014-01-30T09:08:04+00:00')
      )
    })

    test('startTimer throws exception', async () => {
      dispatch.mockResolvedValue(current)
      await expect(
        timer.actions.startTimer({ commit, dispatch, rootGetters })
      ).rejects.toThrowError()
      expect(dispatch).toHaveBeenCalledWith('getRunningEntry')
      expect(axios.$post).not.toHaveBeenCalled()
      expect(commit).not.toHaveBeenCalled()
    })

    test('stopTimer puts to API and commit resetTimer', async () => {
      dispatch.mockReturnValue(current)
      await timer.actions.stopTimer({ commit, dispatch, rootGetters })
      expect(dispatch).toHaveBeenCalledWith('getRunningEntry')

      expect(axios.$put).toHaveBeenCalledWith(
        `https://api.track.toggl.com/api/v8/time_entries/436694100/stop`,
        {},
        {
          auth: {
            username: 'abc123',
            password: 'api_token',
          },
          headers: { 'Content-Type': 'application/json' },
        }
      )
      expect(commit).toHaveBeenCalledWith('resetTimer')
    })
  })
})
