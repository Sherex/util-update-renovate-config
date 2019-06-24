const config = require('../config')
const GithubGraphQLApi = require('node-github-graphql')

const github = new GithubGraphQLApi({ token: config.GITHUB_API_TOKEN })

module.exports = async (repositoryId) => {
  const fs = require('fs').promises
  console.log(`Creating PR...`)
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
    .catch(err => {
      console.error(JSON.stringify(err), null, 2)
    })
  console.log('PR Created!')
  return true
}
