const github = require('./github-client')
const GQLgetRepoByUser = require('../graphql/gql-get-repo-by-user')
const GQLgetRepoByOrg = require('../graphql/gql-get-repo-by-org')
const template = require('../data/template')
const { logger } = require('@vtfk/logger')

module.exports = async (name, type) => {
  logger('info', ['get-repos', 'getting repositories'])
  const res = await getRepos(name, type)
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

async function getRepos (name, type) {
  let cursor = null
  let hasNextPage = true
  let repos = []
  while (hasNextPage) {
    logger('info', ['get-repos', 'requesting graphql', 'cursor', cursor])
    const res = await github.request(
      type === 'org' ? GQLgetRepoByOrg : GQLgetRepoByUser,
      {
        name,
        cursor
      }
    ).catch(error => {
      logger('error', ['get-repos', 'error while getting repos', error.message])
      throw error
    })

    let reposData
    if (type === 'org') {
      reposData = res.organization.repositories
    } else {
      reposData = res.user.repositories
    }

    logger('info', ['get-repos', 'requesting graphql', 'repos gotten', reposData.nodes.length, 'success'])

    hasNextPage = reposData.pageInfo.hasNextPage
    cursor = reposData.pageInfo.endCursor
    repos = repos.concat(reposData.nodes)
    logger('info', ['get-repos', 'requesting graphql', 'repositories left', Number(reposData.totalCount) - repos.length])
  }
  return repos
}
