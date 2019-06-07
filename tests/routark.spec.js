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

  it('executes a given path by calling its registered action', async () => {
    let called = ''
    router.addRoutes('/base/', [
      {
        'path': '',
        'action': async () => { called = 'base' }
      },
      {
        'path': 'main',
        'action': async () => { called = 'main' }
      }
    ])

    await router._executePath('/base/')
    expect(called).toEqual('base')
    expect(router.current).toEqual('/base/')

    await router._executePath('/base/main')
    expect(called).toEqual('main')
    expect(router.current).toEqual('/base/main')
  })

  it('has an onnavigate event handler', async () => {
    let path = null
    const customEvent = new CustomEvent('Navigate', {
      detail: {
        path: '/base/media'
      }
    })
    router.navigate = (_path) => { path = _path }

    await router._onnavigate(customEvent)

    expect(path).toEqual('/base/media')
  })

  it('has an onpopstate event handler', async () => {
    let called = false
    router.move = () => { called = true }

    await router._onpopstate(null)

    expect(called).toBeTruthy()
  })

  it('has an onload event handler', async () => {
    let called = false
    router.move = () => { called = true }

    await router._onload(null)

    expect(called).toBeTruthy()
  })

  it('matches a source and a target path to get a split index', async () => {
    let sourceList = null
    let targetList = null

    router._getSplitIndex = (_sourceList, _targetList) => {
      sourceList = _sourceList
      targetList = _targetList
    }

    await router._match('/base', '/base/media')
    expect(sourceList).toEqual(['', 'base'])
    expect(targetList).toEqual(['', 'base', 'media'])

    await router._match('/base/report', '/base/report/detail/1')
    expect(sourceList).toEqual(['', 'base', 'report'])
    expect(targetList).toEqual(['', 'base', 'report', 'detail', '1'])
  })

  it('matches a source and a target path to execute a path', async () => {
    let paths = []
    router._executePath = async (_path) => {
      paths.push(_path)
    }

    await router._match('/base', '/base/media')
    expect(paths).toEqual(['/base/media'])

    paths = []
    await router._match('/base/report', '/base/report/detail/1')
    expect(paths).toEqual(['/base/report/detail', '/base/report/detail/1'])
  })

  it('moves to its current internally set path from the global set path',
    async () => {
      let source = null
      let target = null

      router.current = '/base'
      router._global = {
        location: {
          pathname: '/base'
        }
      }
      router._match = async (_source, _target) => {
        source = _source
        target = _target
      }

      await router.move()
      expect(source).toBeNull()
      expect(target).toBeNull()

      router.current = '/base/media'
      await router.move()

      expect(source).toEqual('/base/media')
      expect(target).toEqual('/base')
    })

  it('navigates to the given path', async () => {
    let url = null
    let called = false
    router._global = {
      history: {
        pushState: (data, title, _url) => { url = _url }
      }
    }
    router.move = async () => { called = true }

    const path = '/base/reports'
    await router.navigate(path)

    expect(url).toEqual(path)
    expect(called).toBeTruthy()
  })

  it('returns a source path parameters', async () => {
    const regex = /:\w+.*?/gm
    const path = 'users/:id/items/:reference'
    const parameters = router._extractParameters(regex, path)

    expect(parameters).toEqual([
      { name: ':id', index: 6, lastIndex: 9 },
      { name: ':reference', index: 16, lastIndex: 26 }
    ])

    console.log('parameters>>>>', parameters)
  })

  it('gets a target path dynamic values', async () => {
    const parameters = [
      { name: ':id', index: 6, lastIndex: 9 },
      { name: ':reference', index: 16, lastIndex: 26 }
    ]
    const target = 'users/245/items/fkh3456'

    const values = router._getDynamicValues(parameters, target)

    expect(values[':id']).toEqual('245')
    expect(values[':reference']).toEqual('fkh3456')

    console.log('values>>>>', values)
  })

  // it('extracts the target url components', async () => {
  //   let userId = null
  //   router.addRoutes('/base/', [
  //     {
  //       'path': '',
  //       'action': async () => null
  //     },
  //     {
  //       'path': 'users/:id',
  //       'action': async (id) => { userId = id }
  //     },
  //     {
  //       'path': 'users/:id/items/:reference',
  //       'action': async (id) => { userId = id }
  //     }
  //   ])

  //   const _path = '/base/users/abcd1234'
  //   await router._executePath(_path)

  //   expect(userId).toEqual('abcd1234')
  // })

  // it('accepts parameters in the route path', async () => {
  //   let userId = null
  //   router.addRoutes('/base/', [
  //     {
  //       'path': '',
  //       'action': async () => null
  //     },
  //     {
  //       'path': 'users/:id',
  //       'action': async (id) => { userId = id }
  //     },
  //     {
  //       'path': 'users/:id/items/:reference',
  //       'action': async (id) => { userId = id }
  //     }
  //   ])

  //   const _path = '/base/users/abcd1234'
  //   await router._executePath(_path)

  //   expect(userId).toEqual('abcd1234')
  // })
})
