// Class to hold all data and calculations related SAM scoring metrics
class Scores {

  constructor(id, techMatrix, technologies, nReducTotal, treatments, capPercentile, omPercentile, lcPercentile, perfPercentile, yearsPercentile, jobsPercentile, tblWinArray, ftCoeffArray, nReducInEmbay, nConversion, embayNCalc) {
    this.id = id
    this.techMatrix = techMatrix
    this.technologies = technologies
    this.nReducTotal = nReducTotal
    this.treatments = treatments
    this.capPercentile = capPercentile
    this.omPercentile = omPercentile
    this.lcPercentile = lcPercentile
    this.perfPercentile = perfPercentile
    this.yearsPercentile = yearsPercentile
    this.jobsPercentile = jobsPercentile
    this.tblWinArray = tblWinArray
    this.ftCoeffArray = ftCoeffArray
    this.nReducInEmbay = nReducInEmbay
    this.nConversion = nConversion
    this.embayNCalc = embayNCalc
  }

  getID() {
    return this.id
  }

  // Returns normalized score for any metric type
  calcScore(rawScore, type, parFZCount = null) {

    // Obtain filled percentiles 
    const capPercentile = this.capPercentile
    const omPercentile = this.omPercentile
    const lcPercentile = this.lcPercentile
    const perfPercentile = this.perfPercentile
    const yearsPercentile = this.yearsPercentile
    const jobsPercentile = this.jobsPercentile

    // Check metric type, use relevant percentile and raw score to calculate nomalized score
    switch(type) {

      // Capital Cost
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

      // OM Cost
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

      // LC Cost
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

      // Variable Performance
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

      // Years
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

      // Jobs
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

      // Growth Compatibility
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

      // Property Value Loss Avoided
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

      // Flood
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

  // Obtain capital cost
  capitalCost() {

    // Initialize project cost running total
    var newCap = 0
    var totalNReduc = this.nReducTotal
    var techArray = this.techMatrix
    
    // Loop through Treatments array
    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // Get ProjectCost_kg from Tech Matrix
        var projCostKG = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).ProjectCost_kg

        // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz / totalNReduc
        // $newCap += ($tProj_kg*$tNReduction)/$totalNreduc;
        newCap += (projCostKG * i.Nload_Reduction) / totalNReduc
      }
    })

    return this.calcScore(newCap, 'cap')
  }

  // Obtain Life Cycle cost
  lcCost() {

    // Initialize project cost running total
    var newVarC = 0
    var totalNReduc = this.nReducTotal
    var techArray = this.techMatrix
    
    // Loop through Tech Matrix array
    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction
        var avgLCCost = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).Avg_Life_Cycle_Cost

        // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz / totalNReduc
        // $newVarC += ($tLC_kg*$tNReduction)/$totalNreduc;
        newVarC += (avgLCCost * i.Nload_Reduction) / totalNReduc
      }
    })

    return this.calcScore(newVarC,'lc')
  }
  // Obtain useful life in years
  years() {

    // Init table hooks, sums, and running totals
    var techArray = this.techMatrix
    var totalNReduc = this.nReducTotal
    var newYears = 0

    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // Get useful life in years from tech matrix
        var usefulYrs = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).Useful_Life_Yrs

        // Math to obtain raw score
        // $newYears += ($years)*($tNReduction/$totalNreduc);
        newYears += usefulYrs * (i.Nload_Reduction / totalNReduc)
      }
    })

    return this.calcScore(newYears,'years')
  }
  // Obtain variable performance
  varPerf() {

    // Init table hooks, sums, and running totals
    var techArray = this.techMatrix
    var totalNloadReduc = this.nReducTotal
    var newVarP = 0

    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // Get percent reduction properties from technologies table
        var tPerfHigh = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).n_percent_reduction_high
        var tPerfLow = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).n_percent_reduction_low

        // Math to obtain raw variable performance score
        // $newVarP += ($tPerfHigh - $tPerfLow)*($tNReduction/$totalNreduc);
        newVarP += (tPerfHigh - tPerfLow) * (i.Nload_Reduction / totalNloadReduc)
      }
    })
    

    return this.calcScore(newVarP,'varp')
  }
  
  // Obtain OM cost
  omCost() {

    // Initialize project cost running total
    var newOM = 0
    var totalNReduc = this.nReducTotal
    let techArray = this.techMatrix
    
    // Loop through Tech Matrix array
    // this.techMatrixArray.map((i) => {
    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction
        let omCostKG = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).OMCost_kg

        // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
        // $newOM += ($tOM_kg*$tNReduction)/$totalNreduc;
        newOM += (omCostKG * i.Nload_Reduction) / totalNReduc
      }
    })

    return this.calcScore(newOM, 'om')
  }
  // Obtain Jobs
  jobs() {
    
    // Initialize jobs running total
    var newJobs = 0

    // Refer to treatments array to use below in techMatrix
    var techArray = this.techMatrix
    
    // Loop through Tech Matrix array
    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // Get Nload_reduction from Treatment_Wiz in treatArray
        // var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction
        var projCostKG = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).ProjectCost_kg
        projCostKG = projCostKG || 0
        var capFTE = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).capFTE
        capFTE = capFTE || 0
        var omCostKG = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).OMCost_kg
        omCostKG = omCostKG || 0
        var omFTE = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).omFTE
        omFTE = omFTE || 0

        // Sum up 'jobs' as a running total as below
        // $newJobs += (($tProj_kg*$tNReduction*$capFTE) + ($tOM_kg*$tNReduction*$omFTE))/1000000;
        newJobs += ((parseFloat(projCostKG) * i.Nload_Reduction * parseFloat(capFTE)) + (parseFloat(omCostKG) * i.Nload_Reduction * parseFloat(omFTE))) / 1000000
      }
    })
    // Return the running 'jobs' total
    return this.calcScore(newJobs,'jobs')
  }

  // Obtain growth compatability
  growthComp() {

    // Init running totals, nload reduction totals, and table hooks to use inside treatment map
    var treatGC = 0
    var newGC = 0
    var totalNReduc = this.nReducTotal
    var tblWin = this.tblWinArray
    var techArray =  this.techMatrix

    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // Find two properties from tech matrix array by treatment type id
        var newCompat = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).NewCompat

        newCompat = newCompat || 0

        var tblFiltered = tblWin.filter((j) => {return j.treatmentid === i.TreatmentID})

        tblFiltered.map((j) => {

          if (j.econdevtype !== "Limited Development Area" && j.econdevtype !== "Priority Protection Area") {treatGC += newCompat}
          if (j.densitycat == 5) {treatGC += 0}
          if (j.densitycat == 4) {treatGC += 1}
          if (j.densitycat == 3) {treatGC += 2}
          if (j.densitycat == 2) {treatGC += 3}
          if (j.densitycat == 1) {treatGC += 4}
          if (j.biomap2 == 2) {treatGC += newCompat}
          if (j.cwmp == 2) {treatGC += newCompat}
          if (j.flowthrucoef > .5) {treatGC += newCompat}
          if (j.newslirm !== 1) {treatGC += newCompat}
        })

        if (i.Treatment_Class == "In-Embayment") {

          // $newGC += (14)*($tNReduction/$totalNreduc);
          newGC += 14 * (i.Nload_Reduction/totalNReduc)
        } else {

          // $newGC += ($treatGC/$tParcels)*($tNReduction/$totalNreduc);
          newGC += (treatGC/i.Treatment_Parcels) * (i.Nload_Reduction/totalNReduc)
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
    var techArray = this.techMatrix
    var tblWin = this.tblWinArray

    // Get flood zone parcel count for embayment
    tblWin.map((i) => {

      if (i.newslirm === 1) {

        parFZCount++
      }
    })

    this.treatments.map((i) => {

      if (i.TreatmentType_ID) {

        // Keep running total of treatments, obtain resilience from tech matrix
        treatCount++
        var resil = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).Resilience
        resil = resil || 0

        // If treatment is custom polygon, obtain flood zone sum using parcels within treatment
        if (i.Custom_POLY == 1) {

          tblWin.map((j) => {
            
            treatFZ += j.newslirm
          })
    
          floodSum += treatFZ + resil
        } else {
    
          /// Otherwise, obtain flood zone sum using embayment
          floodSum += parFZCount * resil
        }
      }
    })  

    // Math to obtain raw flood ratio score
    if (parFZCount > 0) {

      // $flood_ratio = ($floodSum/$tCount)/$parFZcount;
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
    var slope = parseFloat(this.nConversion[0].Slope)
    var intercept = parseFloat(this.nConversion[0].Intercept)
    var embayNCalc = this.embayNCalc
    var waterfrontPropVal = 0
    var totalPropVal = 0

    console.log(embayNReduc)
    console.log(slope)
    console.log(intercept)
    console.log(embayNCalc)

    // Total property values
    this.tblWinArray.map((i) => {

      totalPropVal += parseFloat(i.totalassessedvalue)

      if (i.waterfront === 1) {
        
        waterfrontPropVal += parseFloat(i.totalassessedvalue)
      }
    })

    if (embayNReduc != null || embayNReduc != 0) {

      // Math to obtain property value loss avoided
      // $pvla = ((($embayNreduc*$slope+$intercept)/($embayNcalc*$slope+$intercept))*0.61*$waterfront_prop_value + $total_prop_value)/$total_prop_value;
      pvla = (((embayNReduc * slope + intercept) / (embayNCalc * slope + intercept)) * .61 * waterfrontPropVal + totalPropVal) / totalPropVal
    } else {

      pvla = 1
    }

    return this.calcScore(pvla,'pvla')
  }
}

module.exports = {
  
  Scores: Scores
}