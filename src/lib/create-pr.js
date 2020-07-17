const config = require('../config')
const github = require('./github-client')
const GQLCreatePullRequest = require('../graphql/gql-create-pullrequest')
const { logger } = require('@vtfk/logger')

module.exports = async (repositoryId) => {
  logger('info', ['create-pr', 'creating pr'])
  await github.request(
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
