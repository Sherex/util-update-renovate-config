const config = require('../config')
const GithubGraphQLApi = require('node-github-graphql')
const template = require('../data/template')
const { logger } = require('@vtfk/logger')

const github = new GithubGraphQLApi({ token: config.GITHUB_API_TOKEN })

module.exports = async (type, name) => {
  logger('info', ['get-repos', 'getting repositories'])
  const res = await getRepos(name)
  logger('info', ['get-repos', 'number of repositories', res.length])

  let repos = res
    .filter(repo => repo.object !== null)
    .map(repo => ({
      name: repo.object.repository.name,
      text: JSON.stringify(JSON.parse(repo.object.text)),
      id: repo.id,
      url: repo.url,
      nameWithOwner: repo.nameWithOwner
    }))
  logger('info', ['get-repos', 'repos with renovate.json', repos.length])
  repos = repos.filter(repo => repo.text !== JSON.stringify(template))
  logger('info', ['get-repos', 'repos to be processed', repos.length])
  return repos
}

async function getRepos(org) {
  let cursor = ''
  let hasNextPage = true
  let repos = []
  while (hasNextPage) {
    logger('info', ['get-repos', 'requesting graphql', 'cursor', cursor])
    const res = await github.query(
      `
        query repos($org: String!, $cursor: String) {
          user(login: $org) {
            repositories(first: 100, after: $cursor) {
              nodes {
                object(expression: "master:renovate.json") {
                  ... on Blob {
                    repository {
                      name
                    }
                    text
                  }
                }
                id
                url
                nameWithOwner
              }
              pageInfo {
                hasNextPage
                endCursor
              }
              totalCount
            }
          }
        }
      `,
      {
        org
      }
    ).catch(error => {
      logger('error', ['get-repos', 'error while getting repos', error])
      throw error
    })
    const reposData = res.data.user.repositories

    logger('info', ['get-repos', 'requesting graphql', 'repos gotten', reposData.nodes.length, 'success'])

    hasNextPage = reposData.pageInfo.hasNextPage
    cursor = reposData.pageInfo.endCursor
    repos = repos.concat(reposData.nodes)
    logger('info', ['get-repos', 'requesting graphql', 'repositories left', Number(reposData.totalCount) - repos.length])
  }
  return repos
}