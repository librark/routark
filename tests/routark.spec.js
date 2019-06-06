import { Routark } from '../lib/routark.js'

describe('Routark', function () {
  let router = null
  beforeEach(function () {
    router = new Routark(window)
  })

  it('can be instantiated', function () {
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
})
