class Treatment {

  // Initialize treatment properties
  constructor(treatmentTypeID, nLoadReduction, treatmentClass, treatmentPolyString, treatmentCustomPoly, treatmentParcels, projCostKG, omCostKG, lcCostKG, treatmentCompat, subWaterIDArray, tblWinArray, capitalFTE, omFTE, treatmentName) {

    this.treatmentTypeID = treatmentTypeID
    this.nLoadReduction = nLoadReduction
    this.projCostKG = projCostKG
    this.omCostKG = omCostKG
    this.lcCostKG = lcCostKG
    this.treatmentClass = treatmentClass
    this.treatmentCompat = treatmentCompat
    this.treatmentPolyString = treatmentPolyString
    this.treatmentCustomPoly = treatmentCustomPoly
    this.subWaterIDArray = subWaterIDArray
    this.tblWinArray = tblWinArray
    this.treatmenParcels = treatmentParcels
    this.capitalFTE = capitalFTE
    this.omFTE = omFTE
    this.treatmentName = treatmentName
  }

  treatmentName() {
    return this.treatmentName
  }
    
  // Getters for each property
  nLoadReduction() {
    return this.nLoadReduction
  }

  treatmentTypeID() {
    return this.treatmentTypeID
  }

  projCostKG() {
    return this.projCostKG
  }

  omCostKG() {
    return this.omCostKG
  }

  lcCostKG() {
    return this.lcCostKG
  }

  treatmentClass() {
    return this.treatmentClass
  }
  
  treatmentCompat() {
    return this.treatmentCompat
  }

  treatmentPolyString() {
    return this.treatmentPolyString
  }

  treatmentCustomPoly() {
    return this.treatmentCustomPoly
  }

  subWaterIDArray() {
    return this.subWaterIDArray
  }

  tblWinArray() {
    return this.tblWinArray
  }
  
  treatmentParcels() {
    return this.treatmentParcels
  }

  capitalFTE() {
    return this.capitalFTE
  }
  
  omFTE() {
    return this.omFTE
  }
}

module.exports = {
  Treatment: Treatment
}