var {DB} = require('../db/db')
var {Treatment} = require('./Treatment')
var {SubWatershed} = require('./SubWatershed')
var {Parcel} = require('./Parcel')

class Scenario {

  // Initialize scenario properties
  constructor(id, createdBy, treatments, nReducFert, nReducSW, nReducSeptic, nReducGW, nReducAtt,  nReducInEmbay, typeIDArray, techMatrixArray, areaID, treatmentIDCustomArray, subWatershedArray, tblWinArray, ftCoeffArray, areaName, technologiesArray, nConversion, embayNCalc, fullTechMatrix, fullTechnologies) {

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
    this.tblWinArray = tblWinArray
    this.ftCoeffArray = ftCoeffArray
    this.areaName = areaName
    this.technologiesArray = technologiesArray
    this.nConversion = nConversion
    this.embayNCalc = embayNCalc
    this.fullTechMatrix = fullTechMatrix
    this.fullTechnologies = fullTechnologies
  }
  
  // Retrieve town names from Scenario_Towns
  getScenarioTownNames() {

    return DB.executeQuery('SELECT "TOWN" FROM "Scenario_Towns" where "scenario_id" = ' + this.id)
  }

  // Retrieve subembayment names intersecting with treatment polygons
  getScenarioSubembaymentNames() {

    return DB.executeQuery('SELECT * from get_subembaymentnames(' + this.id + ',' + this.areaID + ')')
  }

  // Retrieve data from Scenario Wiz
  getScenarioData() {

    return DB.executeQuery('select * from "Scenario_Wiz" where "ScenarioID" = ' + this.id + ' limit 1')
  }

  // Retrieve data from Treatment Wiz
  getTreatmentsData() {

    return DB.executeQuery('select * from "Treatment_Wiz" where "ScenarioID" = ' + this.id)
  }

  // Retrieve data from Treatment Wiz
  getFTCoeffData() {

    return DB.executeQuery('select * from "FTCoeff" where "EMBAY_ID" = ' + this.areaID)
  }

  // Retrieve data from Tech Matrix by treatment ids
  getTechMatrixData() {

    var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('select * from Technology_Matrix where Technology_ID in (' + queryTypeString + ') and Show_In_wMVP != 0', DB.tmConnect)
  }

  // Retrieve all data from Tech Matrix
  getAllTechMatrixData() {
    
    return DB.executeQuery('select * from "Tech_Matrix"')
  }

  // Retrieve data from subwatersheds by treatment ids and embayment id
  getSubwatershedsData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN CapeCodMA.Subwatersheds sw ON geometry::STGeomFromText(tw.POLY_STRING, 3857).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ') and EMBAY_ID = ' + this.areaID, DB.wmvp3Connect)
  }

  // Retrieve data from tblWin by scenario id and embayment name
  getWINData() {
    return DB.executeQuery('select * from get_winparcels(' + this.id + ',' + "'" + this.areaName + "'" + ')')
  }

  getTechnologiesData() {

    var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('select * from technologies where technology_id in (' + queryTypeString + ')', DB.tmConnect)
  }

  getAllTechnologiesData() {

    return DB.executeQuery('select * from technologies', DB.tmConnect)
  }

  // Retrieve data from TBL_NConversion_SQL
  getNConversionData() {
    const numFormat = .999999999
    return DB.executeQuery('select TO_NUMBER("Slope",' + "'" + numFormat + "'" + ') as "Slope", TO_NUMBER("Intercept",' + "'" + numFormat + "'" + ') as "Intercept"  from "TBL_NConversion_SQL" where "EMBAY_ID" = ' + "'" + this.areaID + "'")
  }

  // Execute PostgreSQL function to calculate embayment TMDL by scenario
  getTMDL() {
    return DB.executeQuery('select * from get_tmdl(' + this.id + ',' + this.areaID + ')')
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

      // Find matching rows from subwatershed array by treatmentid, attach flow through coefficient by subwater id
      var subWaterRows = subWaterArray
        .filter((j) => {
          return j.TreatmentID === i.TreatmentID
        })
        .map((k) => {

          var ftCoeffRows = ftCoeffArray.find((l) => {return l.SUBWATER_ID === k.SUBWATER_ID})

          if (ftCoeffRows) {k.ftCoeff = ftCoeffRows.FLOWTHRUCOEF} else {k.ftCoeff = 0}

          return new SubWatershed(k.SUBWATER_ID, k.ftCoeff)
        })

      // Find matching rows from tblWIN table by treatment id
      var winRows = winArray
        .filter((j) => {
          return j.TreatmentID === i.TreatmentID
        })
        .map((k) => {
          return new Parcel(k.EconDevType, k.DensityCat, k.BioMap2, k.CWMP, k.NaturalAttenuation, k.NewSLIRM)
        })

      // Fill treatment properties from various tables
      newTreatment.treatmentParcels = i.Treatment_Parcels
      newTreatment.projCostKG = techRow.ProjectCost_kg
      newTreatment.omCostKG = techRow.OMCost_kg
      newTreatment.lcCostKG = techRow.Avg_Life_Cycle_Cost
      newTreatment.treatmentCompat = techRow.NewCompat
      newTreatment.capitalFTE = techRow.capFTE
      newTreatment.omFTE = techRow.omFTE
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
}

module.exports = {

  Scenario: Scenario
}