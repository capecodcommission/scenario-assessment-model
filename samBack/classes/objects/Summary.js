class Summary {

  constructor(id, towns, subEmbayments, treatments) {

    this.id = id
    this.towns = towns
    this.subEmbayments = subEmbayments
    this.treatments = treatments
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
}

module.exports = {
  Summary: Summary
}