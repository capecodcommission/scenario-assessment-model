// RUN 'node server.js' to start 

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')
var sql = require("mssql");

// wMVP3_CapeCodMA' DB config object
var wmvp3_DBConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  server: '10.10.1.174',
  port: '65335',
  database: 'wMVP3_CapeCodMA',
  stream: true,
  requestTimeout: 300000,
  connectionTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

// Tech Matrix db config
var tm_DBConfig = {
  user: 'DBAccess',
  password: 'Acce$$DB',
  server: '10.10.1.174',
  port: '65335',
  database: 'Tech_Matrix',
  stream: true,
  requestTimeout: 300000,
  connectionTimeout: 300000,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 300000
  }
};

// Connection pools
var wmvp3Connect = new sql.ConnectionPool(wmvp3_DBConfig)
var tmConnect = new sql.ConnectionPool(tm_DBConfig)

// Connect pools
wmvp3Connect.connect(err => {
  if (err) {
    console.log("wmvp3Connect error -->", err)
  }
})
tmConnect.connect(err => {
  if (err) {
    console.log("tmConnect error -->", err)
  }
})

// Execute query to connection pools
var executeQuery = function (query, connection) {

  var request = new sql.Request(connection)

  return request.query(query)
}

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

// Scenario class
class Scenario {

  // Initialize scenario properties
  constructor(id, createdBy, treatments, nReducFert, nReducSW, nReducSeptic, nReducGW, nReducAtt,  nReducInEmbay, typeIDArray, techMatrixArray, areaID, treatmentIDCustomArray, subWatershedArray, subWaterIDArray) {

    this.id = id;
    this.createdBy = createdBy;
    this.treatments = treatments;
    this.nReducFert = nReducFert
    this.nReducSW = nReducSW
    this.nReducSeptic = nReducSeptic
    this.nReducGW = nReducGW
    this.nReducAtt = nReducAtt
    this.nReducInEmbay = nReducInEmbay
    this.typeIDArray = typeIDArray
    this.techMatrixArray = techMatrixArray
    this.areaID = areaID
    this.treatmentIDCustomArray = treatmentIDCustomArray
    this.subWatershedArray = subWatershedArray
    this.subWaterIDArray = subWaterIDArray
  }

    // Retrieve data from Scenario Wiz
    getScenarioData() {

      return executeQuery('select top 1 * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + this.id, wmvp3Connect)
    }

    // Retrieve data from Treatment Wiz
    getTreatmentsData() {

      return executeQuery('select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + this.id, wmvp3Connect)
    }

    // Retrieve data from Treatment Wiz
    getFTCoeffData() {

      return executeQuery('select * from CapeCodMA.FTCoeff where EMBAY_ID = ' + this.areaID, wmvp3Connect)
    }

    // Retrieve data from Tech Matrix
    getTechMatrixData() {

      var queryTypeString = this.typeIDArray.map(i => {return "'" + i + "'"}).join(',')
      return executeQuery('select * from Technology_Matrix where Technology_ID in (' + queryTypeString + ') and Show_In_wMVP != 0', tmConnect)
    }

    getSubwatershedsData() {
      var queryTypeString = this.treatmentIDCustomArray.map(i => {return "'" + i + "'"}).join(',')
      return executeQuery('SELECT tw.TreatmentID, sw.* FROM CapeCodMA.Treatment_Wiz tw INNER JOIN CapeCodMA.Subwatersheds sw ON geometry::STGeomFromText(tw.POLY_STRING, 3857).STIntersects(sw.Shape) = 1 AND tw.TreatmentID in (' + queryTypeString + ')', wmvp3Connect)
    }

    // Return new Treatments, fill in projcostKG for each Treatment
    scenarioTreatments() {

      var techMatrixArray = this.techMatrixArray
      var subWaterArray = this.subWatershedArray

      // Loop through Treatments
      return this.treatments.map((i) => {

        // Build new Treatment object using array from scenario.treatments
        var newTreatment = new Treatment(i.TreatmentType_ID, i.Nload_Reduction, i.Treatment_Class, i.POLY_STRING, i.Custom_POLY)

        // Find matching Tech Matrix row using Treatment ID/Technology ID
        var techRow = techMatrixArray.find((j) => {return j.Technology_ID === i.TreatmentType_ID})
        var subWaterRows = subWaterArray.filter((j) => {return j.TreatmentID === i.TreatmentID}).map((k) => {return k.SUBWATER_ID})

        // Fill projcostKG from Tech Matrix
        newTreatment.projCostKG = techRow.ProjectCost_kg
        newTreatment.omCostKG = techRow.OMCost_kg
        newTreatment.lcCostKG = techRow.Avg_Life_Cycle_Cost
        newTreatment.treatmentCompat = techRow.NewCompat
        newTreatment.subWaterIDArray = subWaterRows
        
        return newTreatment
      })
    }

    getID() {

      return this.id
    }

    getCreatedBy() {
      return this.createdBy
    }

    // Sum all nitrogen loads 
    getNloadSums() {
      return this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
    }

    // Obtain capital cost
    capitalCost() {

      // Initialize project cost running total
      var projKGReduc = 0

      var treatArray = this.treatments
      
      // Loop through Tech Matrix array
      this.techMatrixArray.map((i) => {

        var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

        // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
        projKGReduc += i.ProjectCost_kg * treatmentNLoadReduc
      })

      // Sum nload reductions from Treatment Wiz
      var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

      // Math to return the Capital Cost
      return (projKGReduc)/totalNloadSums
    }

    // Obtain OM cost
    omCost() {

      // Initialize project cost running total
      var omKGReduc = 0

      var treatArray = this.treatments
      
      // Loop through Tech Matrix array
      this.techMatrixArray.map((i) => {

        var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

        // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
        omKGReduc += i.OMCost_kg * treatmentNLoadReduc
      })

      // Sum nload reductions from Treatment Wiz
      var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

      // Math to return the Capital Cost
      return (omKGReduc)/totalNloadSums
    }

    // Obtain Life Cycle cost
    lcCost() {

      // Initialize project cost running total
      var lcKGReduc = 0

      var treatArray = this.treatments
      
      // Loop through Tech Matrix array
      this.techMatrixArray.map((i) => {

        var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

        // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
        lcKGReduc += i.Avg_Life_Cycle_Cost * treatmentNLoadReduc
      })

      // Sum nload reductions from Treatment Wiz
      var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

      // Math to return the Capital Cost
      return (lcKGReduc)/totalNloadSums
    }

    subWaterIDArray() {

      return this.subWaterIDArray
    }

    // Obtain Growth Compatability
    // growthComp() {

    //   // Initialize project cost running total
    //   var lcKGReduc = 0

    //   var treatArray = this.treatments
      
    //   // Loop through Tech Matrix array
    //   this.techMatrixArray.map((i) => {

    //     var treatmentNLoadReduc = treatArray.find((j) => i.Technology_ID === j.TreatmentType_ID).Nload_Reduction

    //     // Add running total of project cost kg from Tech Matrix * nload reduction from Treatment Wiz
    //     lcKGReduc += i.Avg_Life_Cycle_Cost * treatmentNLoadReduc
    //   })

    //   // Sum nload reductions from Treatment Wiz
    //   var totalNloadSums = this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW

    //   // Math to return the Capital Cost
    //   return (lcKGReduc)/totalNloadSums
    // }
  }

  // Treatment class
  class Treatment {

    // Initialize treatment properties
    constructor(treatmentTypeID, nLoadReduction, treatmentClass, treatmentPolyString, treatmentCustomPoly, projCostKG, omCostKG, lcCostKG, treatmentCompat, subWaterIDArray) {

      this.treatmentTypeID = treatmentTypeID
      this.nLoadReduction = nLoadReduction
      this.projCostKG = projCostKG
      this.omCostKG = omCostKG
      this.lcCostKG = lcCostKG
      this.treatmentClass = treatmentClass
      this.treatmentCompat = treatmentCompat
      this.treatmentPolyString = treatmentPolyString
      this.treatmentCustomPoly = treatmentCustomPoly
      this.subWaterIDArray = subWaterIDArray
    }
      
    // Getters for each property
    nLoadReduction() {
      return this.nLoadReduction
    }

    treatmentTypeID() {
      return this.treatmentTypeID
    }

    projCostKG() {
      return this.projCostKG
    }

    omCostKG() {
      return this.omCostKG
    }

    lcCostKG() {
      return this.lcCostKG
    }

    treatmentClass() {
      return this.treatmentClass
    }
    
    treatmentCompat() {
      return this.treatmentCompat
    }

    treatmentPolyString() {
      return this.treatmentPolyString
    }

    treatmentCustomPoly() {
      return this.treatmentCustomPoly
    }

    subWaterIDArray() {
      return this.subWaterIDArray
    }
  }

var root = {
  
  // Main data query, initializes Scenario object and scenario functions
  getScenario: function({id}) {

    // Init new Scenario class
    var a = new Scenario(id)

    // Get data from scenario wiz
    return a.getScenarioData().then((i) => {

      // Fill relevant scenario properties with query results, initialize arrays
      a.createdBy = i.recordset[0].CreatedBy
      a.nReducAtt = i.recordset[0].Nload_Reduction_Attenuation
      a.nReducFert = i.recordset[0].Nload_Reduction_Fert
      a.nReducGW = i.recordset[0].Nload_Reduction_GW
      a.nReducInEmbay = i.recordset[0].Nload_Reduction_InEmbay
      a.nReducSeptic = i.recordset[0].Nload_Reduction_Septic
      a.nReducSW = i.recordset[0].Nload_Reduction_SW
      a.areaID = i.recordset[0].AreaID
      a.treatments = []
      a.typeIDArray = []
      a.techMatrixArray = []
      a.treatmentIDCustomArray = []
      a.subWatershedArray = []
      a.subWaterIDArray = []

      // Get data from Treatment Wiz
      return a.getTreatmentsData().then((j) => {

        // Loop through results of Treatment Wiz data, fill relevant arrays
        j.recordset.map((k) => {

          if (k.Custom_POLY === 1) {
            a.treatmentIDCustomArray.push(k.TreatmentID)
          }

          a.typeIDArray.push(k.TreatmentType_ID)
          a.treatments.push(k)
        })

        // Get data from Tech Matrix
        return a.getTechMatrixData().then((k) => {
          
          // Loop through results from Tech Matrix data, fill relevant array
          k.recordset.map((l) => {
            a.techMatrixArray.push(l)
          })

          return a.getSubwatershedsData().then((m) => {

            m.recordset.map((n) => {
              a.subWaterIDArray.push(n.SUBWATER_ID)
              a.subWatershedArray.push({
                TreatmentID: n.TreatmentID,
                SUBWATER_ID: n.SUBWATER_ID
              })
            })

            return a
          })
        })
      })
   })
  },

  // mutation {
  //     createMessage(input:{
  //       author:"mario"
  //       content:"hello world!"
  //     }) {
  //       id
  //     }
  //   }
  // createMessage: function ({input}) {

  //   // Create a random id for our "database".
  //   var id = require('crypto').randomBytes(10).toString('hex');

  //   fakeDatabase[id] = input;
  //   return new Message(id, input);
  // },


  // mutation {
  //   updateMessage(id: "4458a8c8632e1f9bdee7", input: {content: "hello world! UPDATED"}) 
  //   {
  //     id
  //     author
  //     content
  //   }
  // }
  // updateMessage: function ({id,input}) {

  //   if (!fakeDatabase[id]) {

  //     throw new Error('no message exists with id ' + id);
  //   }

  //   // This replaces all old data, but some apps might want partial update.
  //   fakeDatabase[id].content = input.content
  //   return new Message(id, input);
  // }
};




var app = express();

app.use(cors())


// Unsure about definition of rootValue, but will place relevant links here
// https://github.com/graphql/graphql-js/blob/master/src/execution/execute.js#L122
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');