const config = require('../config')
const GithubGraphQLApi = require('node-github-graphql')
const { logger } = require('@vtfk/logger')

const github = new GithubGraphQLApi({ token: config.GITHUB_API_TOKEN })

module.exports = async (repositoryId) => {
  const fs = require('fs').promises
  logger('info', ['create-pr', 'creating pr'])
  const res = await github
    .query(
      `
      mutation pr($prInput: CreatePullRequestInput!) {
        createPullRequest(input: $prInput) {
          pullRequest {
            author {
              login
            }
            assignees (first: 100) {
              nodes {
                name
              }
            }
            changedFiles
          }
        }
      }    
    `,
      {
        prInput: {
          repositoryId,
          baseRefName: 'master',
          headRefName: config.GITHUB_PR_BRANCH,
          title: config.GITHUB_PR_TITLE
        }
      }
    )
    .catch(error => {
      logger('error', ['create-pr', 'error while creating pr', error])
      throw error
    })
  logger('info', ['create-pr', 'pr created'])
  return true
}
