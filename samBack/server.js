var express = require('express');
var graphqlHTTP = require('express-graphql');
var cors = require('cors')
var {getScenario} = require('./classes/queries/scenarioQueries')
var {getScores} = require('./classes/queries/scoreQueries')
var {getSummary} = require('./classes/queries/summaryQueries')
var {insertSamVote} = require('./classes/mutations/voteMutations')
var {schema} = require('./classes/graphql/schema')

var root = {
  // Main data queries
  getScenario,
  getScores,
  getSummary,
  insertSamVote
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
var server = app.listen(4000);

const serverClose = function() {

  server.close()
}

module.exports = {
  
  server: server,
  serverClose: serverClose
}