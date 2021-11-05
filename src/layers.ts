import { UnknownVersionError, Arch, NoLayerFound } from "./types"

const accountId = "144205449733";

const buildArn = (accountId: string, region: string, arch: string, version: number) => {
  return `arn:aws:lambda:${region}:${accountId}:layer:cachette_${arch}:${version}`
}

class LayerVersion {
  constructor(public supportedRegions: string[], public supportedArchitectures: string[], public version: number) { }
  toString = () => JSON.stringify(this);
}


class Layer {
  constructor(public region: string, public arch: Arch, public version: number) { }
  public getArn() {
    return buildArn(accountId, this.region, this.arch, this.version)
  }
}

const layerVersions = [
  new LayerVersion(["eu-west-1", "eu-west-2", "eu-central-1", "us-east-1", "us-west-2", "us-east-2"], ["x86_64", "arm64"], 5),
  new LayerVersion(["eu-west-1", "eu-west-2", "eu-central-1", "us-east-1", "us-west-2", "us-east-2"], ["x86_64", "arm64"], 5),
]

const getCompatibleLayerVersions = (region: string, arch: Arch) =>
  layerVersions
    .filter(layer => (layer.supportedRegions.includes(region) && layer.supportedArchitectures.includes(arch)))

const getLatestLayer = (region: string, arch: Arch) => {
  const compatibleLayers =
    getCompatibleLayerVersions(region, arch)
      .sort(layer => layer.version)
      .map(layer => new Layer(region, arch, layer.version))

  if (compatibleLayers.length == 0)
    throw new NoLayerFound(region, arch);

  return compatibleLayers[0]
}

const getLayerArn = (region: string, arch: Arch) => {
  return getLatestLayer(region, arch).getArn();
}

const printLayerVersions = () => {
  layerVersions
    .map(version => version.toString())
    .forEach(version => console.log(version))
}

export { getLayerArn, getCompatibleLayerVersions, getLatestLayer, layerVersions, printLayerVersions, buildArn }
