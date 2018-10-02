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

type Query {
  getScenario(id: String): Scenario
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