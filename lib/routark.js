export class Routark {
  /** @param {Window} globalObject */
  constructor(globalObject, root = '/') {
    this.root = root
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

  addRoutes(basePath, routes) {
    for (const route of routes.reverse()) {
      route.path = this._cleanPath(this.root + basePath + route.path)
      this._routes.unshift(route)
    }
  }

  async move() {
    const path = this._global.location.pathname
    if (this.current === path) {
      return
    }
    await this._match(this.current, path)
  }

  /** @param {string} path **/
  async navigate(path) {
    const pushPath = this._cleanPath(this.root + path)
    this._global.history.pushState(null, null, pushPath)
    await this.move()
  }

  /** @param {CustomEvent} event */
  async _onnavigate(event) {
    await this.navigate(event.detail.path)
  }

  /** @param {Event} event */
  async _onpopstate(event) {
    await this.move()
  }

  async _onload(event) {
    await this.move()
  }

  async _match(source, target) {
    const sourceList = this._cleanPath(source).split('/')
    const targetList = this._cleanPath(target).split('/')

    const splitIndex = this._getSplitIndex(sourceList, targetList)

    const baseList = targetList.slice(0, splitIndex)
    const pathList = targetList.slice(splitIndex)

    for (let i = 0; i < pathList.length; i++) {
      const section = pathList.slice(0, i + 1)
      const subPath = baseList.concat(section).join('/')

      await this._executePath(subPath)
    }
  }

  /** @param {string} path */
  async _executePath(path) {
    for (const route of this._routes) {
      let regex = /:\w+.*?/gm

      const parameters = this._extractParameters(regex, route.path)
      const dynamicValues = this._getDynamicValues(parameters, path)
      const builtPath = this._rebuildPath(dynamicValues, route.path)

      if (builtPath === path) {
        const values = Object.values(dynamicValues)
        this.current = path
        await route.action(...values)
        break
      }
    }
  }

  /** @param {string} path */
  _cleanPath(path) {
    const pathLength = path.length
    const lastCharacter = path[pathLength - 1]
    if (pathLength > 1 && lastCharacter === '/') {
      path = path.slice(0, pathLength - 1)
    }

    return path.replace(/\/\//g, '/');
  }

  _extractParameters(regex, path) {
    const parameters = []
    let result = []

    while ((result = regex.exec(path)) !== null) {
      parameters.push({
        name: result[0],
        index: result.index,
        lastIndex: regex.lastIndex
      })
    }

    return parameters
  }

  _getDynamicValues(parameters, target) {
    const values = {}

    for (const parameter of parameters) {
      values[parameter['name']] = target.slice(
        parameter['index']).split('/')[0]
    }

    return values
  }

  /** @param {Object} values @param {string} source @return {string} */
  _rebuildPath(values, source) {
    let path = source
    for (const [key, value] of Object.entries(values)) {
      path = path.replace(key, value)
    }
    return path
  }

  _getSplitIndex(sourceList, targetList) {
    const maxNum = Math.max(sourceList.length, targetList.length)
    let splitIndex = 0
    for (let i = 0; i < maxNum; i++) {
      splitIndex = i
      if (sourceList[i] !== targetList[i]) break
    }
    return splitIndex
  }
}
