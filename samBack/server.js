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

var wmvp3Connect = new sql.ConnectionPool(wmvp3_DBConfig)

wmvp3Connect.connect(err => {
  if (err) {
    console.log("wmvp3Connect error -->", err)
  }
})

// Estbalish a ScenarioWizQuery f(x) to connect to 'wMVP3_CapeCodMA' & get a response
var executeQuery = function (query, connection) {

  var request = new sql.Request(connection)

  return request.query(query)
}

const typeDefs = `

type Scenario {
  getID: String!
  getCreatedBy: String
  scenarioTreatments: [Treatment]
}

type Treatment {
  treatmentID: String
  treatmentName: String
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

  constructor(id, createdBy, treatments) {

    this.id = id;
    this.createdBy = createdBy;
    this.treatments = treatments;
  }

    getScenarioData() {

      return executeQuery('select top 1 * from CapeCodMA.Scenario_Wiz where ScenarioID = ' + this.id, wmvp3Connect)
    }

    getTreatmentsData() {

      return executeQuery('select * from CapeCodMA.Treatment_Wiz where ScenarioID = ' + this.id, wmvp3Connect)
    }

    scenarioTreatments() {

      return this.treatments.map((i) => {

        return new Treatment(i.TreatmentID, i.TreatmentType_Name)
      })
    }

    getID() {
      return this.id
    }

    getCreatedBy() {
      return this.createdBy
    }
  }

  class Treatment {

    constructor(treatmentID, name) {

      this.treatmentID = treatmentID
      this.name = name
    }
      
      treatmentID() {
        return this.treatmentID
      }
  
      treatmentName() {
        return this.name
      }
    }

// Maps username to content
var fakeDatabase = {};

var root = {
  
  getScenario: function({id}) {

    var a = new Scenario(id)

    return a.getScenarioData().then((i) => {

      a.createdBy = i.recordset[0].CreatedBy

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