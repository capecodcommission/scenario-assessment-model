var { buildSchema } = require('graphql');

// GraphQL type definitions
const typeDefs = `

type Scenario {
  getID: ID!
  getCreatedBy: String
  getNloadSums: Float
  capitalCost: Float
  omCost: Float
  lcCost: Float
  jobs: Float
  scenarioTreatments: [Treatment]
  subWaterIDArray: [String]
  growthComp: Float
  years: Float
  varPerf: Float
  floodRatio: Float
  pvla: Float
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
  nReducTotal: Float
  capitalCost: Float
  years: Float
}

type Query {
  getScenario(id: String): Scenario
  getScores(id: String): Scores
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