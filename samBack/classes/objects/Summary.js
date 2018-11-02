class Summary {

  constructor(id, towns, subEmbayments, treatments, embaymentName, progress) {

    this.id = id
    this.towns = towns
    this.subEmbayments = subEmbayments
    this.treatments = treatments
    this.embaymentName = embaymentName
    this.progress = progress
  }

  getID() {

    return this.id
  }

  towns() {

    return this.towns
  }

  subEmbayments() {

    return this.subEmbayments
  }

  treatments() {

    return this.treatments
  }

  embaymentName() {

    return this.embaymentName
  }

  progressTMDL() {
    
    return this.progress
  }
}

module.exports = {

  Summary: Summary
}