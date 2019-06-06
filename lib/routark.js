export class Routark {
  /** @param {Window} globalObject */
  constructor (globalObject) {
    this.root = '/'
    this.current = ''
    this._global = globalObject
    this._routes = []
    this._global.addEventListener(
      'popstate', this._onpopstate.bind(this))
    this._global.addEventListener(
      'navigate', this._onnavigate.bind(this))
    this._global.addEventListener(
      'load', this._onload.bind(this))
  }

  addRoutes (basePath, routes) {
    for (const route of routes.reverse()) {
      route.path = basePath + route.path
      this._routes.unshift(route)
    }
  }

  move () {
    const path = this._global.location.pathname
    if (this.current === path) {
      return
    }
    this._match(this.current, path)
  }

  /** @param {string} path **/
  navigate (path) {
    this._global.history.pushState(null, null, path)
    this.move()
  }

  /** @param {CustomEvent} event */
  _onnavigate (event) {
    this.navigate(event.detail.path)
  }

  /** @param {Event} event */
  _onpopstate (event) {
    this.move()
  }

  _onload (event) {
    this.move()
  }

  async _match (source, target) {
    const sourceList = source.split('/')
    const targetList = target.split('/')

    const maxNum = Math.max(sourceList.length, targetList.length)
    let splitIndex = 0
    for (let i = 0; i < maxNum; i++) {
      splitIndex = i
      if (sourceList[i] !== targetList[i]) break
    }

    const baseList = targetList.slice(0, splitIndex)
    const pathList = targetList.slice(splitIndex)

    for (let i = 0; i < pathList.length; i++) {
      const section = pathList.slice(0, i + 1)
      const subPath = baseList.concat(section).join('/')

      for (const route of this._routes) {
        if (route.path === subPath) {
          this.current = subPath
          await route.action()
          break
        }
      }
    }
  }
}
