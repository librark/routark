import { Routark } from '../lib/routark.js'

describe('Routark', () => {
  /** @type {Routark} */
  let router = null
  beforeEach(() => {
    router = new Routark(window)
  })

  it('can be instantiated', () => {
    expect(router).toBeTruthy()
  })

  it('can add multiple routes to itself', () => {
    const basePath = '/base/'
    router.addRoutes(basePath, [
      {
        'path': '',
        'action': async () => null
      },
      {
        'path': 'main',
        'action': async () => null
      }
    ])
    expect(router._routes[0].path).toEqual('/base/')
    expect(router._routes[1].path).toEqual('/base/main')
  })

  it('gets the split index of two paths', () => {
    let splitIndex = router._getSplitIndex([], [])
    expect(splitIndex).toEqual(0)

    splitIndex = router._getSplitIndex(
      ['', 'base', 'reports'], ['', 'base', 'settings'])
    expect(splitIndex).toEqual(2)

    splitIndex = router._getSplitIndex(
      ['', 'base', 'history', 'detail', '1'],
      ['', 'base', 'history', 'detail', '3'])
    expect(splitIndex).toEqual(4)
  })
})
