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
  // server: '192.138.212.28', //ACESS FROM EXTERNAL TO NETWORK? WHAT TRIVEDI WAS USING?
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

var wmvp3Connect = new sql.ConnectionPool(wmvp3_DBConfig)
var tmConnect = new sql.ConnectionPool(tm_DBConfig)

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

// Estbalish a ScenarioWizQuery f(x) to connect to 'wMVP3_CapeCodMA' & get a response
var executeQuery = function (query, connection) {

  var request = new sql.Request(connection)

  return request.query(query)
}

const typeDefs = `

type Scenario {
  getID: ID!
  getCreatedBy: String
  getNloadSums: Float
  getProjNLoadSum: Float
  scenarioTreatments: [Treatment]
}

type Treatment {
  treatmentTypeID: String!
  nLoadReduction: Float
  projCostKG: Float
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

class Scenario {

  constructor(id, createdBy, treatments, nReducFert, nReducSW, nReducSeptic, nReducGW, nReducAtt,  nReducInEmbay, typeIDArray) {

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
  }

    getScenarioData() {

      return executeQuery('select top 1 * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + this.id, wmvp3Connect)
    }

    getTreatmentsData() {

      return executeQuery('select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + this.id, wmvp3Connect)
    }

    scenarioTreatments() {

      return this.treatments.map((i) => {

        var newTreatment = new Treatment(i.TreatmentType_ID, i.Nload_Reduction)

        return newTreatment.getTechMatrixData().then((j) => {

          newTreatment.projCostKG = j.recordset[0].ProjectCost_kg

          return newTreatment
        })
      })
    }

    getID() {
      return this.id
    }

    getCreatedBy() {
      return this.createdBy
    }

    getNloadSums() {
      return this.nReducAtt + this.nReducFert + this.nReducGW + this.nReducInEmbay + this.nReducSeptic + this.nReducSW
    }

    getProjNLoadSum() {
      
      return this.treatments.reduce((acc, i) => {
        
        return acc + i.Nload_Reduction
      }, 0) 
    }
  }

  class Treatment {

    constructor(treatmentTypeID, nLoadReduction, projCostKG) {

      this.treatmentTypeID = treatmentTypeID
      this.nLoadReduction = nLoadReduction
      this.projCostKG = projCostKG
    }

    getTechMatrixData() {
      return executeQuery('select * from Technology_Matrix where Technology_ID = ' + this.treatmentTypeID + ' and Show_In_wMVP != 0', tmConnect)
    }
      
    nLoadReduction() {
      return this.nLoadReduction
    }

    treatmentTypeID() {
      return this.treatmentTypeID
    }

    projCostKG() {
      return this.projCostKG
    }
  }

// Maps username to content
var fakeDatabase = {};

var root = {
  
  getScenario: function({id}) {

    var a = new Scenario(id)

    return a.getScenarioData().then((i) => {

      a.createdBy = i.recordset[0].CreatedBy
      a.nReducAtt = i.recordset[0].Nload_Reduction_Attenuation
      a.nReducFert = i.recordset[0].Nload_Reduction_Fert
      a.nReducGW = i.recordset[0].Nload_Reduction_GW
      a.nReducInEmbay = i.recordset[0].Nload_Reduction_InEmbay
      a.nReducSeptic = i.recordset[0].Nload_Reduction_Septic
      a.nReducSW = i.recordset[0].Nload_Reduction_SW

      return a.getTreatmentsData().then((j) => {

        a.treatments = j.recordset
        return a
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
  createMessage: function ({input}) {

    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return new Message(id, input);
  },


  // mutation {
  //   updateMessage(id: "4458a8c8632e1f9bdee7", input: {content: "hello world! UPDATED"}) 
  //   {
  //     id
  //     author
  //     content
  //   }
  // }
  updateMessage: function ({id,input}) {

    if (!fakeDatabase[id]) {

      throw new Error('no message exists with id ' + id);
    }

    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id].content = input.content
    return new Message(id, input);
  }
};




var app = express();

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');