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

  calcScore(rawScore, type, parFZCount = null) {

    //generate scoring scales
    var capArray = [];
    var omArray = [];
    var lcArray = [];
    var perfArray = [];
    var yearsArray = [];
    var jobsArray = [];
    var arrays = []

    var allTechnologies = this.fullTechnologies
    var tPerfHigh = 0
    var tPerfLow = 0
    var delta = 0
    var job = 0
    var totalNloadReduc = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
    var kd = []
    var percentiles = []
    var capPercentile = []
    var omPercentile = []
    var lcPercentile = []
    var perfPercentile = []
    var yearsPercentile = []
    var jobsPercentile = []

    this.fullTechMatrix.map((i) => {

      var techRow = allTechnologies.find((j) => {return j.technology_id === i.Technology_ID})

      // Get percent reduction properties from technologies table
      tPerfHigh = techRow.n_percent_reduction_high
      tPerfLow = techRow.n_percent_reduction_low
      delta = tPerfHigh - tPerfLow

      job = ((i.ProjectCost_kg * totalNloadReduc * i.capFTE) + (i.OMCost_kg * totalNloadReduc * i.omFTE)) / 1000000

      capArray.push(i.ProjectCost_kg)
      omArray.push(i.OMCost_kg)
      lcArray.push(i.Avg_Life_Cycle_Cost)
      perfArray.push(delta)
      yearsArray.push(i.Useful_Life_Yrs)
      jobsArray.push(job)
    })

    arrays = [capArray, omArray, lcArray, perfArray, yearsArray, jobsArray]

    for (var i = 10; i <= 100; i+=10) { 
      
      var n = ((i/100) * capArray.length).toFixed(1)
      var nString = n.toString()
      var nExplode = nString.split('.')
      var k = parseFloat(nExplode[0])
      var d = parseFloat(nExplode[1])

      kd.push([i,k,d])
    } 

    arrays.map((i) => {

      i.sort((a,b) => {return a - b})
      
      var thesePcts = []

      kd.map((j) => {

        var k = j[1]
        var d = j[2]
        var vp = i[k - 1] + d * i[k - 1]

        thesePcts.push(vp)
      })

      percentiles.push(thesePcts)
    })

    capPercentile = percentiles[0]
    omPercentile = percentiles[1]
    lcPercentile = percentiles[2]
    perfPercentile = percentiles[3]
    yearsPercentile = percentiles[4]
    jobsPercentile = percentiles[5]

    switch(type) {

      case 'cap':
        if (rawScore <= capPercentile[0]) {return 10}
        if (capPercentile[0] < rawScore && rawScore <= capPercentile[1]) {return 9}
        if (capPercentile[1] < rawScore && rawScore <= capPercentile[2]) {return 8}
        if (capPercentile[2] < rawScore && rawScore <= capPercentile[3]) {return 7}
        if (capPercentile[3] < rawScore && rawScore <= capPercentile[4]) {return 6}
        if (capPercentile[4] < rawScore && rawScore <= capPercentile[5]) {return 5}
        if (capPercentile[5] < rawScore && rawScore <= capPercentile[6]) {return 4}
        if (capPercentile[6] < rawScore && rawScore <= capPercentile[7]) {return 3}
        if (capPercentile[7] < rawScore && rawScore <= capPercentile[8]) {return 2}
        if (rawScore > capPercentile[8]) {return 1}

      case 'om':
        if (rawScore <= omPercentile[0]) {return 10}
        if (omPercentile[0] < rawScore && rawScore <= omPercentile[1]) {return 9}
        if (omPercentile[1] < rawScore && rawScore <= omPercentile[2]) {return 8}
        if (omPercentile[2] < rawScore && rawScore <= omPercentile[3]) {return 7}
        if (omPercentile[3] < rawScore && rawScore <= omPercentile[4]) {return 6}
        if (omPercentile[4] < rawScore && rawScore <= omPercentile[5]) {return 5}
        if (omPercentile[5] < rawScore && rawScore <= omPercentile[6]) {return 4}
        if (omPercentile[6] < rawScore && rawScore <= omPercentile[7]) {return 3}
        if (omPercentile[7] < rawScore && rawScore <= omPercentile[8]) {return 2}
        if (rawScore > omPercentile[8]) {return 1}

      case 'lc':
        if (rawScore <= lcPercentile[0]) {return 10}
        if (lcPercentile[0] < rawScore && rawScore <= lcPercentile[1]) {return 9}
        if (lcPercentile[1] < rawScore && rawScore <= lcPercentile[2]) {return 8}
        if (lcPercentile[2] < rawScore && rawScore <= lcPercentile[3]) {return 7}
        if (lcPercentile[3] < rawScore && rawScore <= lcPercentile[4]) {return 6}
        if (lcPercentile[4] < rawScore && rawScore <= lcPercentile[5]) {return 5}
        if (lcPercentile[5] < rawScore && rawScore <= lcPercentile[6]) {return 4}
        if (lcPercentile[6] < rawScore && rawScore <= lcPercentile[7]) {return 3}
        if (lcPercentile[7] < rawScore && rawScore <= lcPercentile[8]) {return 2}
        if (rawScore > lcPercentile[8]) {return 1}

      case 'varp':
        if (rawScore <= perfPercentile[0]) {return 10}
        if (perfPercentile[0] < rawScore && rawScore <= perfPercentile[1]) {return 9}
        if (perfPercentile[1] < rawScore && rawScore <= perfPercentile[2]) {return 8}
        if (perfPercentile[2] < rawScore && rawScore <= perfPercentile[3]) {return 7}
        if (perfPercentile[3] < rawScore && rawScore <= perfPercentile[4]) {return 6}
        if (perfPercentile[4] < rawScore && rawScore <= perfPercentile[5]) {return 5}
        if (perfPercentile[5] < rawScore && rawScore <= perfPercentile[6]) {return 4}
        if (perfPercentile[6] < rawScore && rawScore <= perfPercentile[7]) {return 3}
        if (perfPercentile[7] < rawScore && rawScore <= perfPercentile[8]) {return 2}
        if (rawScore > perfPercentile[8]) {return 1}

      case 'years':
        if (rawScore <= yearsPercentile[0]) {return 1}
        if (yearsPercentile[0] < rawScore && rawScore <= yearsPercentile[1]) {return 2}
        if (yearsPercentile[1] < rawScore && rawScore <= yearsPercentile[2]) {return 3}
        if (yearsPercentile[2] < rawScore && rawScore <= yearsPercentile[3]) {return 4}
        if (yearsPercentile[3] < rawScore && rawScore <= yearsPercentile[4]) {return 5}
        if (yearsPercentile[4] < rawScore && rawScore <= yearsPercentile[5]) {return 6}
        if (yearsPercentile[5] < rawScore && rawScore <= yearsPercentile[6]) {return 7}
        if (yearsPercentile[6] < rawScore && rawScore <= yearsPercentile[7]) {return 8}
        if (yearsPercentile[7] < rawScore && rawScore <= yearsPercentile[8]) {return 9}
        if (rawScore > yearsPercentile[8]) {return 10}

      case 'jobs':
        if (rawScore <= jobsPercentile[0]) {return 1}
        if (jobsPercentile[0] < rawScore && rawScore <= jobsPercentile[1]) {return 2}
        if (jobsPercentile[1] < rawScore && rawScore <= jobsPercentile[2]) {return 3}
        if (jobsPercentile[2] < rawScore && rawScore <= jobsPercentile[3]) {return 4}
        if (jobsPercentile[3] < rawScore && rawScore <= jobsPercentile[4]) {return 5}
        if (jobsPercentile[4] < rawScore && rawScore <= jobsPercentile[5]) {return 6}
        if (jobsPercentile[5] < rawScore && rawScore <= jobsPercentile[6]) {return 7}
        if (jobsPercentile[6] < rawScore && rawScore <= jobsPercentile[7]) {return 8}
        if (jobsPercentile[7] < rawScore && rawScore <= jobsPercentile[8]) {return 9}
        if (rawScore > jobsPercentile[8]) {return 10}

      case 'gc':
        if (rawScore / 14 <= .1) {return 1}
        if (.1 < rawScore / 14 && rawScore / 14 <= .2) {return 2}
        if (.2 < rawScore / 14 && rawScore / 14 <= .3) {return 3}
        if (.3 < rawScore / 14 && rawScore / 14 <= .4) {return 4}
        if (.4 < rawScore / 14 && rawScore / 14 <= .5) {return 5}
        if (.5 < rawScore / 14 && rawScore / 14 <= .6) {return 6}
        if (.6 < rawScore / 14 && rawScore / 14 <= .7) {return 7}
        if (.7 < rawScore / 14 && rawScore / 14 <= .8) {return 8}
        if (.8 < rawScore / 14 && rawScore / 14 <= .9) {return 9}
        if (.9 < rawScore / 14) {return 10}

      case 'pvla':
        if (rawScore <= 1.061) {return 1}
        if (1.061 < rawScore && rawScore <= 1.122) {return 2}
        if (1.122 < rawScore && rawScore <= 1.183) {return 3}
        if (1.183 < rawScore && rawScore <= 1.244) {return 4}
        if (1.244 < rawScore && rawScore <= 1.305) {return 5}
        if (1.305 < rawScore && rawScore <= 1.366) {return 6}
        if (1.366 < rawScore && rawScore <= 1.427) {return 7}
        if (1.427 < rawScore && rawScore <= 1.498) {return 8}
        if (1.498 < rawScore && rawScore <= 1.549) {return 9}
        if (1.549 < rawScore) {return 10}

      case 'flood':
        if (rawScore <= .1 && parFZCount > 0) {return 1}
        if (.1 < rawScore && rawScore <= .2) {return 2}
        if (.2 < rawScore && rawScore <= .3) {return 3}
        if (.3 < rawScore && rawScore <= .4) {return 4}
        if (.4 < rawScore && rawScore <= .5) {return 5}
        if (.5 < rawScore && rawScore <= .6) {return 6}
        if (.6 < rawScore && rawScore <= .7) {return 7}
        if (.7 < rawScore && rawScore <= .8) {return 8}
        if (.8 < rawScore && rawScore <= .9) {return 9}
        if (.9 < rawScore) {return 10}
        if (parFZCount == 0) {return 0}
    } 
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

  // Retrieve data from Tech Matrix by treatment ids
  getTechMatrixData() {

    var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('select * from Technology_Matrix where Technology_ID in (' + queryTypeString + ') and Show_In_wMVP != 0', DB.tmConnect)
  }

  // Retrieve all data from Tech Matrix
  getAllTechMatrixData() {
    
    return DB.executeQuery('select * from Technology_Matrix where Show_In_wMVP != 0', DB.tmConnect)
  }

  // Retrieve data from subwatersheds by treatment ids and embayment id
  getSubwatershedsData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN CapeCodMA.Subwatersheds sw ON geometry::STGeomFromText(tw.POLY_STRING, 3857).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ') and EMBAY_ID = ' + this.areaID, DB.wmvp3Connect)
  }

  // Retrieve data from tblWin by treatment ids and embayment name
  getWINData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.EconDevType, sw.DensityCat, sw.BioMap2, sw.CWMP, sw.NaturalAttenuation, sw.NewSLIRM FROM CapeCodMA.Treatment_Wiz tw INNER JOIN TBL_Dev.dbo.WIN sw ON geometry::STGeomFromText(tw.POLY_STRING, 0).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ') and Embayment = ' + "'" + this.areaName + "'", DB.wmvp3Connect)
  }

  getTechnologiesData() {

    var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('select * from technologies where technology_id in (' + queryTypeString + ')', DB.tmConnect)
  }

  getAllTechnologiesData() {

    return DB.executeQuery('select * from technologies', DB.tmConnect)
  }

  getNConversionData() {
    return DB.executeQuery('select * from TBL_Dev.dbo.TBL_NConversion_SQL where EMBAY_ID = ' + this.areaID, DB.wmvp3Connect)
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

  // Obtain growth compatability
  growthComp() {

    // Init running totals, nload reduction totals, and table hooks to use inside treatment map
    var treatGC = 0
    var newGC = 0
    var totalNloadReduc = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
    var tblWin = this.tblWinArray
    var techArray =  this.techMatrixArray
    var ftCoeffArray = this.ftCoeffArray

    this.treatments.map((i) => {

      // Find two properties from tech matrix array by treatment type id
      var newCompat = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).NewCompat

      if (i.Custom_POLY == 1) {

        tblWin.map((j) => {

          // Find flow through coefficient for each parcel using subwatershed id, set natural attenuation property using flow through coefficient if available
          var ftCoeff = ftCoeffArray.find((l) => {return l.SUBWATER_ID === j.SUBWATER_ID})
          if (ftCoeff) {j.NaturalAttenuation = ftCoeff.FLOWTHRUCOEF}

          if (j.EconDevType !== "Limited Development Area" && j.EconDevType !== "Priority Protection Area") {treatGC += newCompat}
          if (j.DensityCat == 5) {treatGC += 0}
          if (j.DensityCat == 4) {treatGC += 1}
          if (j.DensityCat == 3) {treatGC += 2}
          if (j.DensityCat == 2) {treatGC += 3}
          if (j.DensityCat == 1) {treatGC += 4}
          if (j.BioMap2 == 2) {treatGC += newCompat}
          if (j.CWMP == 2) {treatGC += newCompat}
          if (j.NaturalAttenuation > .5) {treatGC += newCompat}
          if (j.NewSLIRM !== 1) {treatGC += newCompat}
        })
  
        if (i.Treatment_Class == "In-Embayment") {
  
          newGC += 14 * (i.Nload_Reduction/totalNloadReduc)
        } else {
  
          newGC += (treatGC/i.Treatment_Parcels) * (i.Nload_Reduction/totalNloadReduc)
        }
      } else {

        treatGC = 0
        tblWin.map((j) => {

          // Find flow through coefficient for each parcel using subwatershed id, set natural attenuation property using flow through coefficient if available
          var ftCoeff = ftCoeffArray.find((l) => {return l.SUBWATER_ID === j.SUBWATER_ID})
          if (ftCoeff) {j.NaturalAttenuation = ftCoeff.FLOWTHRUCOEF}

          if (j.EconDevType !== "Limited Development Area" && j.EconDevType !== "Priority Protection Area") {treatGC += newCompat}
          if (j.DensityCat == 5) {treatGC += 0}
          if (j.DensityCat == 4) {treatGC += 1}
          if (j.DensityCat == 3) {treatGC += 2}
          if (j.DensityCat == 2) {treatGC += 3}
          if (j.DensityCat == 1) {treatGC += 4}
          if (j.BioMap2 == 2) {treatGC += newCompat}
          if (j.CWMP == 2) {treatGC += newCompat}
          if (j.NaturalAttenuation > .5) {treatGC += newCompat}
          if (j.NewSLIRM !== 1) {treatGC += newCompat}
        })
  
        if (i.Treatment_Class == "In-Embayment") {
  
          newGC += 14 * (i.Nload_Reduction/totalNloadReduc)
        } else {
  
          newGC += (treatGC/i.Treatment_Parcels) * (i.Nload_Reduction/totalNloadReduc)
        }
      }
    })  
    
    return this.calcScore(newGC,'gc')
  }

  // Obtain flood ratio
  floodRatio() {

    // Init running totals and table hooks
    var treatFZ = 0
    var floodSum = 0
    var floodRatio = 0
    var treatCount = 0
    var parFZCount = 0
    var techArray = this.techMatrixArray
    var tblWin = this.tblWinArray

    // Get flood zone parcel count for embayment
    tblWin.map((i) => {

      if (i.NewSLIRM === 1) {

        parFZCount++
      }
    })

    this.treatments.map((i) => {

      // Keep running total of treatments, obtain resilience from tech matrix
      treatCount++
      var resil = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).Resilience

      // If treatment is custom polygon, obtain flood zone sum using parcels within treatment
      if (i.Custom_POLY == 1) {

        tblWin.map((j) => {
          
          treatFZ += j.NewSLIRM
        })
  
        floodSum += treatFZ + resil
      } else {
  
        /// Otherwise, obtain flood zone sum using embayment
        floodSum += parFZCount * resil
      }
    })  

    // Math to obtain raw flood ratio score
    if (parFZCount > 0) {

      floodRatio = (floodSum / treatCount) / parFZCount
    } else {

      floodRatio = 0
    }

    return this.calcScore(floodRatio,'flood',parFZCount)
  }

  // Obtain property value loss avoided raw score
  pvla() {

    // Init running totals and property hooks
    var pvla = 0
    var embayNReduc = this.nReducInEmbay
    var slope = parseFloat(this.nConversion.Slope)
    var intercept = parseFloat(this.nConversion.Intercept)
    var embayNCalc = this.embayNCalc
    var waterfrontPropVal = 0
    var totalPropVal = 0

    // Total property values
    this.tblWinArray.map((i) => {

      totalPropVal += i.TotalAssessedValue

      if (i.Waterfront === 1) {
        
        waterfrontPropVal += i.TotalAssessedValue
      }
    })

    if (embayNReduc != null) {

      // Math to obtain property value loss avoided
      pvla = (((embayNReduc * slope + intercept) / (embayNCalc * slope + intercept)) * .61 * waterfrontPropVal + totalPropVal) / totalPropVal
    } else {

      pvla = 1
    }

    return this.calcScore(pvla,'pvla')
  }
}

module.exports = {

  Scenario: Scenario
}