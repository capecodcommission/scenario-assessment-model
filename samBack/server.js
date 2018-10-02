var express = require('express');
var graphqlHTTP = require('express-graphql');
var cors = require('cors')
var {getScenario} = require('./classes/queries')
var {schema} = require('./classes/schema')

var root = {
  // Main data query, initializes Scenario object and scenario functions
  getScenario
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