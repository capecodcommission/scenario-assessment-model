var {DB} = require('./db')
var {Treatment} = require('./Treatment')
var {SubWatershed} = require('./SubWatershed')
var {Parcel} = require('./Parcel')

class Scenario {

  // Initialize scenario properties
  constructor(id, createdBy, treatments, nReducFert, nReducSW, nReducSeptic, nReducGW, nReducAtt,  nReducInEmbay, typeIDArray, techMatrixArray, areaID, treatmentIDCustomArray, subWatershedArray, tblWinArray, ftCoeffArray, areaName, technologiesArray, nConversion, embayNCalc) {

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

  // Retrieve data from subwatersheds by treatment ids and embayment id
  getSubwatershedsData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN CapeCodMA.Subwatersheds sw ON geometry::STGeomFromText(tw.POLY_STRING, 3857).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ') and EMBAY_ID = ' + this.areaID, DB.wmvp3Connect)
  }

  // Retrieve data from tblWin by treatment ids and embayment name
  getWINData() {
    var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN TBL_Dev.dbo.WIN sw ON geometry::STGeomFromText(tw.POLY_STRING, 0).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ') and Embayment = ' + "'" + this.areaName + "'", DB.wmvp3Connect)
  }

  getTechnologiesData() {

    var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
    return DB.executeQuery('select * from technologies where technology_id in (' + queryTypeString + ')', DB.tmConnect)
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
    
    return newGC
  }

  // Obtain Jobs
  jobs() {
    // $newJobs += (($tProj_kg*$tNReduction*$capFTE) + ($tOM_kg*$tNReduction*$omFTE))/1000000;
    
    // Initialize jobs running total
    var jobs = 0

    // Refer to treatments array to use below in techMatrix
    var treatArray = this.treatments
    
    // Loop through Tech Matrix array
    this.techMatrixArray.map((i) => {
      
      // Get Nload_reduction from Treatment_Wiz in treatArray
      var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

      // Sum up 'jobs' as a running total as below
      jobs += (((i.ProjectCost_kg * treatmentNLoadReduc * i.capFTE) + (i.OMCost_kg * treatmentNLoadReduc * i.omFTE)) / 1000000)
    })
    // Return the running 'jobs' total
    return jobs
  }

  // Obtain useful life in years
  years() {

    // Init table hooks, sums, and running totals
    var techArray = this.techMatrixArray
    var totalNloadReduc = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
    var years = 0

    this.treatments.map((i) => {

      // Get useful life in years from tech matrix
      var usefulYrs = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).Useful_Life_Yrs

      // Math to obtain raw score
      years += usefulYrs * (i.Nload_Reduction / totalNloadReduc)
    })

    return years
  }

  // Obtain variable performance
  varPerf() {

    // Init table hooks, sums, and running totals
    var techArray = this.technologiesArray
    var totalNloadReduc = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
    var varP = 0

    this.treatments.map((i) => {

      // Get percent reduction properties from technologies table
      var tPerfHigh = techArray.find((j) => {return j.technology_id === i.TreatmentType_ID}).n_percent_reduction_high
      var tPerfLow = techArray.find((j) => {return j.technology_id === i.TreatmentType_ID}).n_percent_reduction_low

      // Math to obtain raw variable performance score
      varP += (tPerfHigh - tPerfLow) * (i.Nload_Reduction / totalNloadReduc)
    })

    return varP
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

    return floodRatio
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

    return pvla
  }
}

module.exports = {

  Scenario: Scenario
}