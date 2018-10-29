// Import the dependencies for testing
const {server, serverClose} = require('../server')
const expect = require('chai').expect
const {Scenario} = require('../classes/objects/Scenario')

describe("Scenario", () => {

  let scenID = '2965'
  let testScen = new Scenario(scenID)

  after(serverClose)

  describe("Check properties", () => {
    it("should return non-null properties", () => {
      return testScen.getScenarioData()
      .then((res,err) => {
        let scenRow = res[0]
        expect(scenRow.ScenarioID).to.be.a('number')
        expect(scenRow.Nload_Reduction_Fert).to.be.a('number')
        expect(scenRow.Nload_Reduction_SW).to.be.a('number')
        expect(scenRow.Nload_Reduction_Septic).to.be.a('number')
        expect(scenRow.Nload_Reduction_GW).to.be.a('number')
        expect(scenRow.Nload_Reduction_Attenuation).to.be.a('number')
        expect(scenRow.Nload_Reduction_InEmbay).to.be.a('number')
        expect(scenRow.Nload_Calculated_InEmbay).to.be.a('number')
        expect(scenRow.AreaID).to.be.a('number')
        expect(scenRow.AreaName).to.be.a('string')
        done();
      })
    });
  });

  // describe("Check Town Names", () => {
  //   it("should return non-null Scenario Town Names", () => {
  //     return testScen.getScenarioTownNames()
  //     .then((res,err) => {
  //       let scenRow = res[0]
  //       expect(scenRow.ScenarioID).to.be.a('number')
  //       expect(scenRow.Nload_Reduction_Fert).to.be.a('number')
  //       expect(scenRow.Nload_Reduction_SW).to.be.a('number')
  //       expect(scenRow.Nload_Reduction_Septic).to.be.a('number')
  //       expect(scenRow.Nload_Reduction_GW).to.be.a('number')
  //       expect(scenRow.Nload_Reduction_Attenuation).to.be.a('number')
  //       expect(scenRow.Nload_Reduction_InEmbay).to.be.a('number')
  //       expect(scenRow.Nload_Calculated_InEmbay).to.be.a('number')
  //       expect(scenRow.AreaID).to.be.a('number')
  //       expect(scenRow.AreaName).to.be.a('string')
  //       done();
  //     })
  //   });
  // });
});