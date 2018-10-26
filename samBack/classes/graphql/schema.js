var { buildSchema, GraphQLScalarType } = require('graphql');


const resolvers = {
  Coordinates: new GraphQLScalarType({
    
    name: 'Coordinates',
    description: 'A set of coordinates. x, y',
    parseValue(value) {

      return value;
    },
    serialize(value) {

      return value;
    },
    parseLiteral(ast) {

      return ast.value;
    },
  })
}

// GraphQL type definitions
const typeDefs = `

scalar Coordinates

type Scenario {
  getID: ID!
  getCreatedBy: String
  getNloadSums: Float
  scenarioTreatments: [Treatment]
  subWaterIDArray: [String]
}

type Polygon {
  type: String
  rings: Coordinates
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
  treatmentPolyString: Polygon
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
  embaymentName: String
  getID: String
  progressTMDL: Float
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

type Mutation {
  insertSamVote(scenarioid: Int, meetingid: Int, cap_cost: Float, om_cost: Float, lc_cost: Float, years: Float, var_perf: Float, jobs: Float, growth_comp: Float, flood_ratio: Float, pvla: Float): Boolean
}

schema {
  query: Query
  mutation: Mutation
}
`

// Construct a schema, using GraphQL schema language
var schema = buildSchema(typeDefs, resolvers);

module.exports = {

  schema: schema
}