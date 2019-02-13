import { Routark } from '../lib/routark.js'

describe('Routark', function () {
  beforeEach(function () {
    this.router = new Routark()
  })

  it('can be instantiated', function () {
    expect(this.router).toBeTruthy()
  })
})
