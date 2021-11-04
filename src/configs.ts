export abstract class ItemConfig {
  constructor(
    public fileName: string,
    public include?: string[],
    public exclude?: string[]
  ) { }

  abstract toCachetteTarget: () => any
}

type Headers = { [key: string]: string }

const headersToKeyValArray = (headers: Headers) =>
  Object.keys(headers).map(key => ({ key, value: headers[key] }))

export class HttpConfig extends ItemConfig {
  constructor(
    fileName: string,
    include: string[],
    exclude: string[],
    public url: string,
    public method: string,
    public headers?: Headers) { super(fileName, include, exclude) }

  toCachetteTarget = () => ({
    fileName: this.fileName,
    target: {
      type: "http",
      url: this.url,
      method: this.method,
      headers: headersToKeyValArray(this.headers)
    }
  })

  static from = (config: any): HttpConfig => {
    return new HttpConfig(
      config.fileName,
      config.include,
      config.exclude,
      config.url,
      config.method,
      config.headers);
  }
}

const parseItemConfig = (config: any): ItemConfig => {
  switch (config.type) {
    case "http": return HttpConfig.from(config);
    default: throw new Error(`Unrecognised type ${config.type}`)
  }
}

export class CachetteConfig {
  constructor(public itemConfigs: ItemConfig[]) { }

  static parse = (config: any[]): CachetteConfig =>
    new CachetteConfig(config.map(item => parseItemConfig(item)))

  toCachetteConfigFor = (functionName: string) => {
    let configs =
      this.itemConfigs
        .filter(cfg => {
          if (!!cfg.include)
            return cfg.include.includes(functionName)
          if (!!cfg.exclude)
            return !cfg.exclude.includes(functionName)
          return true
        })
        .map(cfg => cfg.toCachetteTarget())
    if (configs.length == 0)
      return null
    return { itemConfigs: configs }
  }

}

