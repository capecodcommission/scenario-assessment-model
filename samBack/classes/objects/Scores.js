class Scores {

  constructor(techMatrix, technologies, nReducTotal, treatments) {
    this.techMatrix = techMatrix
    this.technologies = technologies
    this.nReducTotal = nReducTotal
    this.treatments = treatments
  }

  nReducTotal() {
    return this.nReducTotal
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

    return rawScore

    // return this.calcScore(rawScore, 'cap')
  }
}

module.exports = {
  
  Scores: Scores
}