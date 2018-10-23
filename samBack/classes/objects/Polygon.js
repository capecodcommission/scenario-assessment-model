class Polygon {

  constructor(type, rings) {

    this.type = type
    this.rings = rings
  }

  type() {
    return this.type
  }

  rings(item) {
    return [item[0], item[1]]
  }
}

module.exports = {
  Polygon: Polygon
}