// Import the dependencies for testing
const {serverClose} = require('../server')
const expect = require('chai').expect
const {Scenario} = require('../classes/objects/Scenario')
const {summarySubTest} = require('./summarySubTest')
const {scoreSubTest} = require('./scoreSubTest')

// Main test
// Retrieves all data necessary, then passes to relevant endpoint tests
describe("GraphQL Endpoints", () => {
  it("should asychronously check PostgreSQL data used for GrahpQL endpoints", async () => {

    // On completion of all tests, disconnect 
    after(serverClose)

    // Initialize classes using either script argument or default scenario id
    const scenID = process.argv[3] || 2965
    const testScen = new Scenario(scenID)
    
    // Save responses to be passed into endpoint tests below
    const scenResponse = await testScen.getScenarioData()
    const scenRow = scenResponse[0]

    // Fill appropriate properties for additional queries below
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
    
    // Feed responses into relevant endpoint tests
    summarySubTest(scenRow, townArray, treatArray, subArray, tmdlRow, expect)
    scoreSubTest(techArray, winArray, nConversionRow, expect)
  })
});