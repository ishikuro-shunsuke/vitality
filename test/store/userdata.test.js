import { API } from 'aws-amplify'
import * as gqlQueries from '@/graphql/queries'
import * as gqlMutations from '@/graphql/mutations'
import * as userdata from '@/store/userdata'
import { toyyyymmdd } from '@/plugins/helper'

let state = {}
describe('initial data', () => {
  beforeEach(() => {
    state = {
      settings: {
        toggl: {
          apiKey: '',
          meditation: {
            wid: '',
            pid: '',
          },
          focus: {
            wid: '',
            pid: '',
          },
        },
      },
      cache: {
        exercise: {},
      },
    }
  })

  test('*SettingExists return false', () => {
    expect(userdata.getters.meditationSettingExists(state)).toBeFalsy()
    expect(userdata.getters.focusSettingExists(state)).toBeFalsy()
  })

  test('set toggl settigs', () => {
    const meditationOnly = {
      apiKey: 'abc123',
      meditation: {
        wid: 'qwerty123',
        pid: 'uiop456',
      },
      focus: {
        wid: '',
        pid: '',
      },
    }
    userdata.mutations.setSettings(state, 'toggl', meditationOnly)
    expect(state.settings.toggl).toEqual(meditationOnly)
    expect(userdata.getters.meditationSettingExists(state)).toBeTruthy()
    expect(userdata.getters.focusSettingExists(state)).toBeFalsy()

    const focusOnly = {
      apiKey: 'abc123',
      meditation: {
        wid: '',
        pid: '',
      },
      focus: {
        wid: 'qwerty123',
        pid: 'uiop456',
      },
    }
    userdata.mutations.setSettings(state, 'toggl', focusOnly)
    expect(state.settings.toggl).toEqual(focusOnly)
    expect(userdata.getters.meditationSettingExists(state)).toBeFalsy()
    expect(userdata.getters.focusSettingExists(state)).toBeTruthy()

    const full = {
      apiKey: 'abc123',
      meditation: {
        wid: 'qwerty123',
        pid: 'uiop456',
      },
      focus: {
        wid: 'asdf123',
        pid: 'hjkl456',
      },
    }
    userdata.mutations.setSettings(state, 'toggl', full)
    expect(state.settings.toggl).toEqual(full)
    expect(userdata.getters.meditationSettingExists(state)).toBeTruthy()
    expect(userdata.getters.focusSettingExists(state)).toBeTruthy()

    expect(userdata.getters.meditationSetting(state)).toEqual({
      apiKey: 'abc123',
      wid: 'qwerty123',
      pid: 'uiop456',
    })
    expect(userdata.getters.focusSetting(state)).toEqual({
      apiKey: 'abc123',
      wid: 'asdf123',
      pid: 'hjkl456',
    })
  })

  test('set exercise cache', () => {
    const exerciseCache = {
      achievements: [],
    }
    userdata.mutations.setCache(state, 'exercise', exerciseCache)
    expect(state.cache.exercise).toEqual(exerciseCache)
  })
})

describe('actions', () => {
  const now = new Date(1625324429764) // 2021-07-03T15:00:29.764Z

  const commit = jest.fn()
  const mockAPI = jest.spyOn(API, 'graphql')

  userdata.actions.$toyyyymmdd = toyyyymmdd

  beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('save local state to remote', async () => {
    state = {
      settings: {
        toggl: {
          apiKey: 'abc123',
          meditation: {
            wid: 456,
            pid: 789,
          },
          focus: {
            wid: 12,
            pid: 345,
          },
        },
      },
      cache: {
        exercise: {
          achievements: [
            { date: '2021-07-04', active: false, activities: [] },
            { date: '2021-07-03', active: false, activities: [] },
            { date: '2021-07-02', active: false, activities: [] },
            { date: '2021-07-01', active: false, activities: [] },
            { date: '2021-06-30', active: false, activities: [] },
            { date: '2021-06-29', active: false, activities: [] },
            { date: '2021-06-28', active: false, activities: [] },
          ],
        },
      },
    }
    mockAPI.mockResolvedValue()
    await userdata.actions.saveTogglSettings({ state })
    expect(mockAPI).toHaveBeenCalledWith({
      query: gqlMutations.saveTogglSettings,
      variables: { input: { toggl: state.settings.toggl } },
    })
    await userdata.actions.saveExerciseCache({ state })
    expect(mockAPI).toHaveBeenCalledWith({
      query: gqlMutations.saveExerciseCache,
      variables: { input: { exercise: state.cache.exercise } },
    })
  })

  test('remote returns toggl settings', async () => {
    mockAPI.mockResolvedValue({
      data: { user: { settings: { toggl: 'TEST' } } },
    })
    await userdata.actions.fetchUserData({ commit })
    expect(mockAPI).toHaveBeenCalledWith({ query: gqlQueries.user })
    expect(commit).toHaveBeenCalledWith('setSettings', 'toggl', 'TEST')
  })

  test('remote returns exercise cache', async () => {
    mockAPI.mockResolvedValue({
      data: {
        user: {
          cache: {
            exercise: {
              achievements: [
                { date: '2021-07-01', active: false, activities: [] },
              ],
            },
          },
        },
      },
    })
    await userdata.actions.fetchUserData({ commit })
    expect(mockAPI).toHaveBeenCalledWith({ query: gqlQueries.user })
    expect(commit.mock.calls[0][0]).toMatch('setCache')
    expect(commit.mock.calls[0][1]).toMatch('exercise')
    expect(commit.mock.calls[0][2].achievements[0]).toEqual({
      date: '2021-07-04',
      active: false,
      activities: [],
    })
  })

  describe('networking error', () => {
    beforeAll(() => {
      mockAPI.mockRejectedValue({ message: 'error' })
    })

    test('fetchUserdata throws error', async () => {
      await expect(
        userdata.actions.fetchUserData({ commit })
      ).rejects.toThrowError()
      expect(commit).not.toHaveBeenCalled()
      await expect(userdata.actions.saveTogglSettings({ state })).rejects.toThrowError()
      await expect(userdata.actions.saveExerciseCache({ state })).rejects.toThrowError()
    })
  })
})
