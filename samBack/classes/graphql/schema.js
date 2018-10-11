var { buildSchema } = require('graphql');

// GraphQL type definitions
const typeDefs = `

type Scenario {
  getID: ID!
  getCreatedBy: String
  getNloadSums: Float
  scenarioTreatments: [Treatment]
  subWaterIDArray: [String]
}

type Treatment {
  treatmentTypeID: String!
  nLoadReduction: Float
  projCostKG: Float
  omCostKG: Float
  lcCostKG: Float
  treatmentClass: String
  treatmentCompat: Int
  capitalFTE: Float
  omFTE: Float
  treatmentPolyString: String
  treatmentCustomPoly: Int
  subWaterIDArray: [String]
  tblWinArray: [Parcel]
  treatmentParcels: Int
  subWatershedArray: [SubWatershed]
  treatmentName: String
}

type SubWatershed {
  subWaterID: String
  ftCoeff: Float
}

type Parcel {
  econDevType: String
  densityCat: String
  bioMap2: String
  cwmp: String
  natAtten: Float
  newSlirm: String
}

type Scores {
  getID: String
  nReducTotal: Float
  capitalCost: Float
  lcCost: Float
  varPerf: Float
  years: Float
  omCost: Float
  jobs: Float
  growthComp: Float
  pvla: Float
  floodRatio: Float
}

type Summary {
  towns: [Town]
  subEmbayments: [SubEmbayment]
  treatments: [Treatment]
}

type SubEmbayment {
  name: String
}

type Town {
  name: String
}

type Query {
  getScenario(id: String): Scenario
  getScores(id: String): Scores
  getSummary(id: String): Summary
}

schema {
  query: Query
}
`

// Construct a schema, using GraphQL schema language
var schema = buildSchema(typeDefs);

module.exports = {
  schema: schema
}