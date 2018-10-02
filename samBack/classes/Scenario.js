var {DB} = require('./db')
var {Treatment} = require('./Treatment')
var {SubWatershed} = require('./SubWatershed')
var {Parcel} = require('./Parcel')

class Scenario {

  // Initialize scenario properties
  constructor(id, createdBy, treatments, nReducFert, nReducSW, nReducSeptic, nReducGW, nReducAtt,  nReducInEmbay, typeIDArray, techMatrixArray, areaID, treatmentIDCustomArray, subWatershedArray, subWaterIDArray, tblWinArray, ftCoeffArray) {

    this.id = id;
    this.createdBy = createdBy;
    this.treatments = treatments;
    this.nReducFert = nReducFert
    this.nReducSW = nReducSW
    this.nReducSeptic = nReducSeptic
    this.nReducGW = nReducGW
    this.nReducAtt = nReducAtt
    this.nReducInEmbay = nReducInEmbay
    this.typeIDArray = typeIDArray
    this.techMatrixArray = techMatrixArray
    this.areaID = areaID
    this.treatmentIDCustomArray = treatmentIDCustomArray
    this.subWatershedArray = subWatershedArray
    this.subWaterIDArray = subWaterIDArray
    this.tblWinArray = tblWinArray
    this.ftCoeffArray = ftCoeffArray
  }
  
  // Retrieve data from Scenario Wiz
  getScenarioData() {

    return DB.executeQuery('select top 1 * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + this.id, DB.wmvp3Connect)
  }

  // Retrieve data from Treatment Wiz
  getTreatmentsData() {

    return DB.executeQuery('select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + this.id, DB.wmvp3Connect)
  }

  // Retrieve data from Treatment Wiz
  getFTCoeffData() {

    return DB.executeQuery('select * from CapeCodMA.FTCoeff where EMBAY_ID = ' + this.areaID, DB.wmvp3Connect)
  }

  // Retrieve data from Tech Matrix
  getTechMatrixData() {

    var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('select * from Technology_Matrix where Technology_ID in (' + queryTypeString + ') and Show_In_wMVP != 0', DB.tmConnect)
  }

  getSubwatershedsData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN CapeCodMA.Subwatersheds sw ON geometry::STGeomFromText(tw.POLY_STRING, 3857).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ')', DB.wmvp3Connect)
  }

  getWINData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN TBL_Dev.dbo.WIN sw ON geometry::STGeomFromText(tw.POLY_STRING, 0).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ')', DB.wmvp3Connect)
  }

  // Return new Treatments, fill in projcostKG for each Treatment
  scenarioTreatments() {

    var techMatrixArray = this.techMatrixArray
    var subWaterArray = this.subWatershedArray
    var winArray = this.tblWinArray
    var ftCoeffArray = this.ftCoeffArray

    // Loop through Treatments
    return this.treatments.map((i) => {

      // Build new Treatment object using array from scenario.treatments
      var newTreatment = new Treatment(i.TreatmentType_ID, i.Nload_Reduction, i.Treatment_Class, i.POLY_STRING, i.Custom_POLY)

      // Find matching Tech Matrix row using Treatment ID/Technology ID
      var techRow = techMatrixArray
        .find((j) => {
          return j.Technology_ID === i.TreatmentType_ID
        })

      var subWaterRows = subWaterArray
        .filter((j) => {
          return j.TreatmentID === i.TreatmentID
        })
        .map((k) => {

          var ftCoeffRows = ftCoeffArray.find((l) => {return l.SUBWATER_ID === k.SUBWATER_ID})

          k.ftCoeff = ftCoeffRows.FLOWTHRUCOEF

          return new SubWatershed(k.SUBWATER_ID, k.ftCoeff)
        })

      // var subWaterIDArray = subWaterRows.map((j) => {return j.SUBWATER_ID})

      

      var winRows = winArray
        .filter((j) => {
          return j.TreatmentID === i.TreatmentID
        })
        .map((k) => {
          return new Parcel(k.EconDevType, k.DensityCat, k.BioMap2, k.CWMP, k.NaturalAttenuation, k.NewSLIRM)
        })

      // Fill projcostKG from Tech Matrix
      newTreatment.treatmentParcels = i.Treatment_Parcels
      newTreatment.projCostKG = techRow.ProjectCost_kg
      newTreatment.omCostKG = techRow.OMCost_kg
      newTreatment.lcCostKG = techRow.Avg_Life_Cycle_Cost
      newTreatment.treatmentCompat = techRow.NewCompat
      newTreatment.subWatershedArray = subWaterRows
      newTreatment.tblWinArray = winRows
      
      return newTreatment
    })
  }

  getID() {
    return this.id
  }

  getCreatedBy() {
    return this.createdBy
  }

  // Sum all nitrogen loads 
  getNloadSums() {
    return this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
  }

  // Obtain capital cost
  capitalCost() {

    // Initialize project cost running total
    var projKGReduc = 0

    var treatArray = this.treatments
    
    // Loop through Tech Matrix array
    this.techMatrixArray.map((i) => {

      var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

      // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
      projKGReduc += i.ProjectCost_kg * treatmentNLoadReduc
    })

    // Sum nload reductions from Treatment Wiz
    var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

    // Math to return the Capital Cost
    return (projKGReduc)/totalNloadSums
  }

  // Obtain OM cost
  omCost() {

    // Initialize project cost running total
    var omKGReduc = 0

    var treatArray = this.treatments
    
    // Loop through Tech Matrix array
    this.techMatrixArray.map((i) => {

      var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

      // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
      omKGReduc += i.OMCost_kg * treatmentNLoadReduc
    })

    // Sum nload reductions from Treatment Wiz
    var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

    // Math to return the Capital Cost
    return (omKGReduc)/totalNloadSums
  }

  // Obtain Life Cycle cost
  lcCost() {

    // Initialize project cost running total
    var lcKGReduc = 0

    var treatArray = this.treatments
    
    // Loop through Tech Matrix array
    this.techMatrixArray.map((i) => {

      var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

      // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
      lcKGReduc += i.Avg_Life_Cycle_Cost * treatmentNLoadReduc
    })

    // Sum nload reductions from Treatment Wiz
    var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

    // Math to return the Capital Cost
    return (lcKGReduc)/totalNloadSums
  }

  subWaterIDArray() {

    return this.subWaterIDArray
  }

  // Obtain Growth Compatability
  // growthComp() {

  //   // Initialize project cost running total
  //   var lcKGReduc = 0

  //   var treatArray = this.treatments
    
  //   // Loop through Tech Matrix array
  //   this.techMatrixArray.map((i) => {

  //     var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

  //     // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
  //     lcKGReduc += i.Avg_Life_Cycle_Cost * treatmentNLoadReduc
  //   })

  //   // Sum nload reductions from Treatment Wiz
  //   var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

  //   // Math to return the Capital Cost
  //   return (lcKGReduc)/totalNloadSums
  // }
}

module.exports = {
  Scenario: Scenario
}