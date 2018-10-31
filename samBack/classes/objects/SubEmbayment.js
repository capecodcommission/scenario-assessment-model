class SubEmbayment {

  constructor(subem_disp) {

    this.subem_disp = subem_disp
  }

  name() {
    return this.subem_disp
  }
}

module.exports = {
  SubEmbayment: SubEmbayment
}