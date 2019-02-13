import { Routark } from '../lib/routark.js'

describe('Routark', function () {
  let router = null
  beforeEach(function () {
    router = new Routark(window)
  })

  it('can be instantiated', function () {
    expect(router).toBeTruthy()
  })
})
