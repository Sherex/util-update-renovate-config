const config = require('../config')
const GithubGraphQLApi = require('node-github-graphql')
const GQLCreatePullRequest = require('../graphql/gql-create-pullrequest')
const { logger } = require('@vtfk/logger')

const github = new GithubGraphQLApi({ token: config.GITHUB_API_TOKEN })

module.exports = async (repositoryId) => {
  logger('info', ['create-pr', 'creating pr'])
  await github.query(
    GQLCreatePullRequest,
    {
      prInput: {
        repositoryId,
        baseRefName: 'master',
        headRefName: config.GITHUB_PR_BRANCH,
        title: config.GITHUB_PR_TITLE
      }
    }
  ).catch(error => {
    logger('error', ['create-pr', 'error while creating pr', error])
    throw error
  })
  logger('info', ['create-pr', 'pr created'])
  return true
}
