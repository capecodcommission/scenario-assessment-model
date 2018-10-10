class Scores {

  constructor(techMatrix, technologies, nReducTotal, treatments, capPercentile, omPercentile, lcPercentile, perfPercentile, yearsPercentile, jobsPercentile) {
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
  }

  calcScore(rawScore, type, parFZCount = null) {

    var capPercentile = this.capPercentile
    var omPercentile = this.omPercentile
    var lcPercentile = this.lcPercentile
    var perfPercentile = this.perfPercentile
    var yearsPercentile = this.yearsPercentile
    var jobsPercentile = this.jobsPercentile

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

  // Obtain capital cost
  capitalCost() {

    // Initialize project cost running total
    var projKGReduc = 0

    var techArray = this.techMatrix
    
    // Loop through Treatments array
    this.treatments.map((i) => {

      // Get ProjectCost_kg from Tech Matrix
      var projCostKG = techArray.find((j) => j.Technology_ID === i.TreatmentType_ID).ProjectCost_kg

      // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
      projKGReduc += projCostKG * i.Nload_Reduction
    })

    // Math to return the Capital Cost
    var rawScore = projKGReduc / this.nReducTotal

    return this.calcScore(rawScore, 'cap')
  }

  // Obtain useful life in years
  years() {

    // Init table hooks, sums, and running totals
    var techArray = this.techMatrix
    var totalNloadReduc = this.nReducTotal
    var years = 0

    this.treatments.map((i) => {

      // Get useful life in years from tech matrix
      var usefulYrs = techArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID}).Useful_Life_Yrs

      // Math to obtain raw score
      years += usefulYrs * (i.Nload_Reduction / totalNloadReduc)
    })

    return this.calcScore(years,'years')
  }
}

module.exports = {
  
  Scores: Scores
}