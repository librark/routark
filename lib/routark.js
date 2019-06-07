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

  async move () {
    const path = this._global.location.pathname
    if (this.current === path) {
      return
    }
    await this._match(this.current, path)
  }

  /** @param {string} path **/
  async navigate (path) {
    this._global.history.pushState(null, null, path)
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
    const sourceList = source.split('/')
    const targetList = target.split('/')

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
  async _executePath (path) {
    for (const route of this._routes) {
      // const parameters = route.path.match(/\/:.*(\/|$)/g)
      // const parameters = route.path.match(/:\w+.*?/gm)
      // let parametersIndexes = (/:\w+.*?/gm).exec(route.path)
      // const parametersIndexes =

      // console.log('parameters>>>>', route.path, '====', parameters)
      // console.log('indexes>>>>', parametersIndexes)

      // parametersIndexes = (/:\w+.*?/gm).exec(route.path)

      let regex = /:\w+.*?/gm

      console.log('||||||||||||||||', route.path)
      // while ((array1 = regex1.exec(str1)) !== null) {
      //   console.log(`Found ${array1[0]} at ${regex1}.
      //   Next starts at ${regex1.lastIndex}.`)
      //   console.log(array1.index)
      //   // expected output: "Found foo. Next starts at 9."
      //   // expected output: "Found foo. Next starts at 19."
      // }
      const parameters = this._extractParameters(regex, route.path)

      // const parametersIndexes =

      if (route.path === path) {
        this.current = path
        await route.action()
        break
      }
    }
  }

  _extractParameters (regex, path) {
    const parameters = []
    let result = []

    console.log('||||||||||||||||', path)
    while ((result = regex.exec(path)) !== null) {
      console.log(`Found ${result[0]} at ${result}.
        Next starts at ${regex.lastIndex}.`)
      console.log(result.index)

      parameters.push({
        name: result[0],
        index: result.index,
        lastIndex: regex.lastIndex
      })
    }

    return parameters
  }

  _getDynamicValues (parameters, target) {
    const values = {}
    let result = []

    const slashIndexes = []
    let slashPosition = target.indexOf('/')
    while (slashPosition !== -1) {
      slashIndexes.push(slashPosition)
      slashPosition = target.indexOf('/', slashPosition + 1)
    }

    let startIndex = 0
    let endIndex = 0
    let slashIndex = 0
    for (const parameter of parameters) {
      startIndex = parameter.index
      endIndex = target.length
      for (slashIndex of slashIndexes) {
        if (slashIndex >= startIndex) {
          endIndex = slashIndex
          break
        }
      }
    }

    console.log('slashIndexes>>>', slashIndexes, target)

    return values
  }

  _getSplitIndex (sourceList, targetList) {
    const maxNum = Math.max(sourceList.length, targetList.length)
    let splitIndex = 0
    for (let i = 0; i < maxNum; i++) {
      splitIndex = i
      if (sourceList[i] !== targetList[i]) break
    }
    return splitIndex
  }
}
