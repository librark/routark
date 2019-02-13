export class Routark {
  /** @param {Window} globalObject */
  constructor (globalObject) {
    this.root = '/'
    this.current = null
    this._global = globalObject
    this._routes = []
    this._global.addEventListener(
      'popstate', this._onpopstate.bind(this))
    this._global.addEventListener(
      'navigate', this._onnavigate.bind(this))
    this._global.addEventListener(
      'load', this._onload.bind(this))
  }

  addRoutes (parentPath, routes) {
    for (const route of routes.reverse()) {
      route.path = parentPath + route.path
      this._routes.unshift(route)
    }
  }

  move () {
    const path = this._global.location.pathname
    if (this.current === path) {
      return
    }
    this._match(path)
  }

  /** @param {CustomEvent} event */
  _onnavigate (event) {
    this._global.history.pushState(null, null, event.detail.path)
    this.move()
  }

  /** @param {Event} event */
  _onpopstate (event) {
    this.move()
  }

  _onload (event) {
    this.move()
  }

  async _match (path) {
    for (const route of this._routes) {
      const pathList = path.split('/')
      while (pathList.length > 0) {
        const subPath = pathList.join('/')
        if (route.path === subPath) {
          this.current = subPath
          await route.action()
          return
        }
        pathList.pop()
      }
    }
  }
}
