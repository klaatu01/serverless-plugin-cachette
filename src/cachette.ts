import Serverless from "serverless"
import { CachetteConfig } from "./configs"
import { getLayerArn, printLayerVersions } from "./layers"
import { getArch } from "./utils"

class CachettePlugin {
  serverless: Serverless;
  hooks: { [key: string]: Function }
  commands: any
  options: any

  constructor(serverless: Serverless, options: Serverless.Options) {
    this.serverless = serverless;
    this.options = options;
    this.commands = {
      cachette: {
        lifecycleEvents: [
          "list"
        ]
      }
    }
    this.hooks = {
      "after:package:initialize": this.addCachette.bind(this),
      "cachette:list": printLayerVersions.bind(this)
    };
  }

  addCachette = () => {
    const { service } = this.serverless;
    const { custom = {} } = service;
    const { cachette = {} } = custom;

    const functions = service.functions

    this.checkVersion();

    const cachetteConfig = CachetteConfig.parse(cachette);
    this.applyLayer(functions, service.provider, cachetteConfig);
  }

  checkVersion = () => {
    if (this.serverless.version < "2.61.0")
      throw new Error(`Incompatible Serverless Version.\nCurrent:  "${this.serverless.version}".\nRequires: "^2.61.0".`)
  }

  applyLayer = (functions: any, provider: any, cachetteConfig: CachetteConfig) => {
    Object.getOwnPropertyNames(functions)
      .map(name => ({ name, fn: functions[name] }))
      .forEach(({ name, fn }) => {
        const arch = getArch(provider.architecture, fn);
        const layerArn = getLayerArn(provider.region, arch);
        const cfg = cachetteConfig.toCachetteConfigFor(name);
        if (!!cfg) {
          fn.layers = [layerArn] || fn.layers;
          fn.environment = {
            CACHETTE_CONFIG: JSON.stringify(cfg),
            ...fn.environment
          };
        }
      });
  }

}

module.exports = CachettePlugin;
