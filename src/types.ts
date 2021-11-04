type Arch = "x86_64" | "arm64"

class MissingConfigParameterError implements Error {
  name = "MissingConfigParameter"
  message: string
  public constructor(parameterName: string) {
    this.message = `Config Parameter '${parameterName}' must be declared`
  }
}

class UnrecognisedTargetTypeError implements Error {
  name = "UnrecognisedTargetType"
  message: string
  public constructor(target: string) {
    this.message = `${this.name}'${target}'`;
  }
}

class UnknownVersionError implements Error {
  name = "UnrecognisedDestination"
  message: string
  public constructor(version: number) {
    this.message = `Unknown version '${version}'`;
  }
}

class NoLayerFound implements Error {
  name = "NoLayerFound"
  message: string
  public constructor(region: string, arch: string) {
    this.message = `No Layer found for'${region}|${arch}'`;
  }
}

export { Arch, MissingConfigParameterError, UnrecognisedTargetTypeError, UnknownVersionError, NoLayerFound };
