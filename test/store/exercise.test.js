import * as exercise from '@/store/exercise'
import { toyyyymmdd } from '@/plugins/helper'

let state = {
  achivements: [],
}

describe('initial state', () => {
  beforeEach(() => {
    state = {
      achivements: [],
    }
  })

  test('setAchivements injects an array of entries to the achievements state', () => {
    exercise.mutations.setAchievements(state, [0, 1, 2, 3, 4, 5])
    expect(state.achievements).toEqual([0, 1, 2, 3, 4, 5])
  })
})

describe('actions', () => {
  const commit = jest.fn()

  const valid = jest.fn()
  const auth = {
    loginWith: jest.fn().mockResolvedValue(),
    logout: jest.fn().mockResolvedValue(),
    strategy: {
      token: {
        status: jest.fn(() => ({ valid })),
        get: jest.fn(),
      },
    },
  }
  exercise.actions.$auth = auth

  const axios = {
    $get: jest.fn(),
  }
  exercise.actions.$axios = axios

  exercise.actions.$toyyyymmdd = toyyyymmdd

  const now = new Date(1625324429764) // 2021-07-03T15:00:29.764Z

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('stateless', () => {
    test('login exec $auth.LoginWith()', async () => {
      await exercise.actions.loginTrackerService({ commit })
      expect(auth.loginWith).toHaveBeenCalled()
    })

    test('logout exec $auth.logout()', async () => {
      await exercise.actions.logoutTrackerService({ commit })
      expect(auth.logout).toHaveBeenCalled()
    })
  })

  describe('not loggedin', () => {
    beforeAll(() => {
      valid.mockReturnValue(false)
    })

    test('loggedin returns false', () => {
      expect(exercise.actions.checkAuthStatus()).toBeFalsy()
      expect(valid).toHaveBeenCalled()
    })
    test('fetchWeeklyReport throws exception', async () => {
      await expect(exercise.actions.fetchWeeklyReport({ commit })).rejects.toThrowError()
      expect(axios.$get).not.toHaveBeenCalled()
    })
  })

  describe('loggedin', () => {
    beforeAll(() => {
      valid.mockReturnValue(true)
      auth.strategy.token.get.mockReturnValue('Bearer: abcde')
    })
    test('loggedin returns true', () => {
      expect(exercise.actions.checkAuthStatus()).toBeTruthy()
    })
    test('fetchWeeklyReport pulls activities and set to state and userdata module', async () => {
      axios.$get.mockResolvedValue({
        activities: [ {name: 'Run' } ],
        summary: { veryActiveMinutes: 10, fairlyActiveMinutes: 11 },
      })
      await exercise.actions.fetchWeeklyReport({ commit })
      expect(axios.$get).toHaveBeenCalledTimes(7)
      expect(axios.$get).toHaveBeenLastCalledWith(
        `https://api.fitbit.com/1/user/-/activities/date/2021-06-28.json`,
        { headers: { Authorization: 'Bearer: abcde' } }
      )
      expect(commit.mock.calls[0][0]).toBe('setAchievements')
      expect(commit.mock.calls[0][1][6]).toEqual({
        date: '2021-06-28',
        active: true,
        activities: ['Run'],
      })
    })
  })

  describe('networking error', () => {
    test('auth and fetch services throw exception', () => {
      
    })
  })
})
