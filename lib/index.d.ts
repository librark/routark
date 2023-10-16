export declare class Routark {
  constructor(globalObject?: object, root?: string)

  addRoutes(basePath: string, routes: { path: string }): void

  move(): Promise<void>

  navigate(path: string): Promise<void>
}
