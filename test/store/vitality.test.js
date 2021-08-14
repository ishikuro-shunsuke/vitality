import * as vitality from '@/store/vitality'
import { API } from 'aws-amplify'
import * as gqlQueries from '@/graphql/queries'
import * as gqlMutations from '@/graphql/mutations'

const nowDate = new Date(1625324429764) // 2021-07-03T15:00:29.764Z
const nowEpochtime = 1625324429
const twoDaysBefore = Math.floor(nowEpochtime - 2 * (60 * 60 * 24))
const history = [
  1619823600, 1619910000, 1619910001, 1619996400, 1620082800, 1620169200,
  1620255600, 1620342000, 1620428400, 1620514800, 1620601200, 1620687600,
  1620774000, 1620860400, 1620946800, 1621033200, 1621119600, 1621206000,
  1621378800, 1621465200, 1621551600, 1621551601, 1621638000, 1621725604,
  1621732804, 1621732824, 1621819204, 1621819205, 1621898404, 1622013830,
  1622113916, 1622200741, 1622969190, 1623126320, 1623160161, 1623294112,
  1623611557, 1623843243, 1623947702, 1624111228, 1624234924, 1624285364,
  1624954790, 1624982329, 1625064240,
]
let state = {}

beforeAll(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(nowDate)
})

afterAll(() => {
  jest.useRealTimers()
})

describe('initial data', () => {
  beforeEach(() => {
    state.emissions = []
  })

  test('elapsed returns null if there are no emissions', () => {
    expect(
      vitality.getters.elapsed(state, {
        recent: vitality.getters.recent(state),
      })
    ).toBeNull()
  })

  test('recent returns null if there are no emissions', () => {
    expect(vitality.getters.recent(state)).toBeNull()
  })

  test('calendar returns an initial object in array', () => {
    expect(vitality.getters.calendar(state)).toEqual([
      {
        label: '2021/7',
        start: new Date(2021, 6),
        end: new Date(2021, 7),
        count: 0,
      },
    ])
  })

  test('addEmissions allows an array of epochtime(seconds)', () => {
    vitality.mutations.addEmissions(state, history)
    expect(state.emissions).toEqual(history)
    expect(vitality.getters.recent(state)).toEqual(1625064240)
  })

  test('addEmissions allows an array of Date object', () => {
    vitality.mutations.addEmissions(state, [nowDate])
    expect(vitality.getters.recent(state)).toEqual(nowEpochtime)
  })

  test('addEmisisons allows single scaler', () => {
    vitality.mutations.addEmissions(state, nowDate)
    expect(vitality.getters.recent(state)).toEqual(nowEpochtime)
    vitality.mutations.addEmissions(state, nowEpochtime)
    expect(vitality.getters.recent(state)).toEqual(nowEpochtime)
  })
})

describe('emissions existing', () => {
  beforeEach(() => {
    state.emissions = history
  })

  test('calendar returns formatted calendar object', () => {
    expect(vitality.getters.calendar(state)).toEqual([
      {
        label: '2021/7',
        start: new Date(2021, 6),
        end: new Date(2021, 7),
        count: 0,
      },
      {
        label: '2021/6',
        start: new Date(2021, 5),
        end: new Date(2021, 6),
        count: 13,
      },
      {
        label: '2021/5',
        start: new Date(2021, 4),
        end: new Date(2021, 5),
        count: 32,
      },
    ])
  })

  test('addEmissions can append an array', () => {
    const newEmissions = [nowEpochtime - 60 * 60 * 24, nowEpochtime]
    vitality.mutations.addEmissions(state, newEmissions)
    expect(state.emissions).toEqual(history.concat(newEmissions))
    expect(vitality.getters.recent(state)).toEqual(nowEpochtime)
    expect(
      vitality.getters.elapsed(state, {
        recent: vitality.getters.recent(state),
      })
    ).toEqual(0)
  })

  test('calendar being updated after addEmissions', () => {
    vitality.mutations.addEmissions(state, [nowEpochtime])
    expect(vitality.getters.calendar(state)).toEqual([
      {
        label: '2021/7',
        start: new Date(2021, 6),
        end: new Date(2021, 7),
        count: 1,
      },
      {
        label: '2021/6',
        start: new Date(2021, 5),
        end: new Date(2021, 6),
        count: 13,
      },
      {
        label: '2021/5',
        start: new Date(2021, 4),
        end: new Date(2021, 5),
        count: 32,
      },
    ])
  })

  test('elapsed returns number of days elapsed from the final emission', () => {
    vitality.mutations.addEmissions(state, [twoDaysBefore])
    expect(
      vitality.getters.elapsed(state, {
        recent: vitality.getters.recent(state),
      })
    ).toEqual(2)
  })
})

describe('actions', () => {
  const commit = jest.fn()
  const mockAPI = jest.spyOn(API, 'graphql')

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('fetchEmissions calls addEmissions', async () => {
    mockAPI.mockResolvedValue({
      data: {
        emission: { history },
      },
    })
    await vitality.actions.fetchEmissions({ commit })
    expect(mockAPI).toHaveBeenCalledWith({ query: gqlQueries.emission })
    expect(commit).toHaveBeenCalledWith('addEmissions', history)
  })

  test('emit calls addEmissions with 1 element', async () => {
    mockAPI.mockResolvedValue({
      data: {
        emit: nowEpochtime,
      },
    })
    await vitality.actions.emit({ commit })
    expect(mockAPI).toHaveBeenCalledWith({ query: gqlMutations.emit })
    expect(commit).toHaveBeenCalledWith('addEmissions', [nowEpochtime])
  })

  describe('networking error', () => {
    beforeAll(() => {
      mockAPI.mockRejectedValue({ message: 'error' })
    })

    test('actions using API raises exception', async () => {
      await expect(vitality.actions.emit({ commit })).rejects.toThrowError()
      await expect(
        vitality.actions.fetchEmissions({ commit })
      ).rejects.toThrowError()
      expect(commit).not.toHaveBeenCalled()
    })
  })
})
