export class Routark {
  /** @param {Window} globalObject */
  constructor (globalObject = globalThis, root = '/') {
    this.root = root
    this.current = ''
    this._global = globalObject
    this._routes = []
    this._paths = new Set()
    this._global.addEventListener?.(
      'popstate', this._onpopstate.bind(this))
    this._global.addEventListener?.(
      'navigate', this._onnavigate.bind(this))
    this._global.addEventListener?.(
      'load', this._onload.bind(this))
  }

  addRoutes (basePath, routes) {
    for (const route of routes.reverse()) {
      route.path = this._cleanPath(this.root + basePath + route.path)
      if (this._paths.has(route.path)) continue
      this._paths.add(route.path)
      this._routes.unshift(route)
    }
  }

  async move () {
    const path = this._global.location.pathname
    if (this.current === path) {
      return
    }
    await this._match(this.current, path)
  }

  /** @param {string} path **/
  async navigate (path) {
    const pushPath = this._cleanPath(this.root + path)
    this._global.history.pushState(null, null, pushPath)
    await this.move()
  }

  /** @param {CustomEvent} event */
  async _onnavigate (event) {
    await this.navigate(event.detail.path)
  }

  /** @param {Event} event */
  async _onpopstate (event) {
    await this.move()
  }

  async _onload (event) {
    await this.move()
  }

  async _match (source, target) {
    const sourceList = this._cleanPath(source).split('/')
    const targetList = this._cleanPath(target).split('/')

    const splitIndex = source ? this._getSplitIndex(sourceList, targetList) : 0

    const baseList = targetList.slice(0, splitIndex)
    const pathList = targetList.slice(splitIndex)

    for (let i = 0; i < pathList.length; i++) {
      const section = pathList.slice(0, i + 1)
      const subPath = baseList.concat(section).join('/') || this.root

      await this._executePath(subPath)
    }
  }

  /** @param {string} path */
  async _executePath (path) {
    const pathname = this._global?.location?.pathname
    const search = this._global?.location?.search
    const hash = this._global?.location?.hash
    const origin = this._global?.location?.origin

    for (const route of this._routes) {
      const regex = /:\w+.*?/gm
      const parameters = this._extractParameters(regex, route.path)
      const dynamicValues = this._getDynamicValues(parameters, path)
      const builtPath = this._rebuildPath(dynamicValues, route.path)

      if (builtPath === path) {
        this.current = path
        const location = { pathname, search, hash, origin }
        const context = { location, params: dynamicValues }
        await route.action(context)
        break
      }
    }
  }

  /** @param {string} path */
  _cleanPath (path) {
    const pathLength = path.length
    const lastCharacter = path[pathLength - 1]
    if (pathLength > 1 && lastCharacter === '/') {
      path = path.slice(0, pathLength - 1)
    }

    return path.replace(/\/\//g, '/')
  }

  _extractParameters (regex, path) {
    const parameters = []
    let result = []

    while ((result = regex.exec(path)) !== null) {
      parameters.push({
        name: result[0].slice(1),
        index: result.index,
        lastIndex: regex.lastIndex
      })
    }

    return parameters
  }

  _getDynamicValues (parameters, target) {
    const values = {}

    for (const parameter of parameters) {
      values[parameter.name] = target.slice(
        parameter.index).split('/')[0]
    }

    return values
  }

  /** @param {Object} values @param {string} source @return {string} */
  _rebuildPath (values, source) {
    let path = source
    for (const [key, value] of Object.entries(values)) {
      path = path.replace(`:${key}`, value)
    }
    return path
  }

  _getSplitIndex (sourceList, targetList) {
    let splitIndex = 0
    if (targetList.length < sourceList.length) return splitIndex
    const maxNum = Math.max(sourceList.length, targetList.length)
    for (let i = 0; i < maxNum; i++) {
      splitIndex = i
      if (sourceList[i] !== targetList[i]) break
    }
    return splitIndex
  }
}
