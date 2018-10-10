class Parcel {
  constructor(econDevType, densityCat, bioMap2, cwmp, natAtten, newSlirm) {
    this.econDevType = econDevType
    this.densityCat = densityCat
    this.bioMap2 = bioMap2
    this.cwmp = cwmp
    this.natAtten = natAtten
    this.newSlirm = newSlirm
  }

  econDevType() {
    return this.econDevType
  }
  
  densityCat() {
    return this.densityCat
  }

  bioMap2() {
    return this.bioMap2
  }

  cwmp() {
    return this.cwmp
  }

  natAtten() {
    return this.natAtten
  }

  newSlirm() {
    return this.newSlirm
  }
}

module.exports = {
  Parcel: Parcel
}