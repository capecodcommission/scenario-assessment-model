// Import the dependencies for testing
const {serverClose} = require('../server')
const expect = require('chai').expect
const {Scenario} = require('../classes/objects/Scenario')
const {summarySubTest} = require('./summarySubTest')
const {scoreSubTest} = require('./scoreSubTest')

describe("GraphQL Endpoints", () => {
  it("should asychronously check all PostgreSQL data used for all endpoints", async () => {

    after(serverClose)

    const scenID = process.argv[3] || 2965
    const testScen = new Scenario(scenID)
    
    const scenResponse = await testScen.getScenarioData()
    const scenRow = scenResponse[0]

    testScen.areaID = scenRow.AreaID
    testScen.areaName = scenRow.AreaName

    const townArray = await testScen.getScenarioTownNames()
    const treatArray = await testScen.getTreatmentsData()
    const subArray = await testScen.getScenarioSubembaymentNames()
    const techArray = await testScen.getAllTechMatrixData()
    const winArray = await testScen.getWINData()

    const tmdlResponse = await testScen.getTMDL()
    const tmdlRow = tmdlResponse[0]

    const nCoversionResponse = await testScen.getNConversionData()
    const nConversionRow = nCoversionResponse[0]
    
    summarySubTest(scenRow, townArray, treatArray, subArray, tmdlRow, expect)
    scoreSubTest(techArray, winArray, nConversionRow, expect)
  })
});