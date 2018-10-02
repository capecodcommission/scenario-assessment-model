class SubWatershed {

  constructor(subWaterID, ftCoeff) {

    this.subWaterID = subWaterID
    this.ftCoeff = ftCoeff
  }

  subWaterID() {
    return this.subWaterID
  }

  ftCoeff() {
    return this.ftCoeff
  }
}

module.exports = {
  SubWatershed: SubWatershed
}