const config = require('../config')
const { GraphQLClient } = require('graphql-request')
require('cross-fetch/polyfill') // Required for 'graphql-requrest'

const client = new GraphQLClient(config.GITHUB_GRAPHQL_URL, {
  headers: {
    authorization: `Bearer ${config.GITHUB_API_TOKEN}`
  }
})

module.exports = client
