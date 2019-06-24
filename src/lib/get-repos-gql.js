const config = require('../config')
const GithubGraphQLApi = require('node-github-graphql')
const template = require('../data/template')

const github = new GithubGraphQLApi({ token: config.GITHUB_API_TOKEN })

module.exports = async (type, name) => {
  //const res = require('../../data.json')
  const res = await getRepos(name)
  console.log(`Got ${res.length} repos!`)
  
  let names = res
    .filter(repo => repo.object !== null)
    .map(repo => ({
      name: repo.object.repository.name,
      text: JSON.stringify(JSON.parse(repo.object.text)),
      id: repo.id,
      url: repo.url,
      nameWithOwner: repo.nameWithOwner
    }))
  console.log(`Found ${names.length} repos with a renovate.json!`)
  names = names.filter(repo => repo.text !== JSON.stringify(template))
  console.log(`Filtered to ${names.length} repos where renovate.json is incorrect!`)
  console.log(names.map(repo => repo.nameWithOwner))
  return names
}

async function getRepos(org) {
  const fs = require('fs').promises
  let cursor = ''
  let hasNextPage = true
  let repos = []
  while (hasNextPage) {
    console.log(`Request start | Cursor: ${cursor}`)
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
    ).catch(err => {
      console.error(JSON.stringify(err), null, 2)
    })
    console.log(`Request end`)
    const reposData = res.data.user.repositories

    console.log(`Has next page: ${reposData.pageInfo.hasNextPage}`)
    hasNextPage = reposData.pageInfo.hasNextPage
    cursor = reposData.pageInfo.endCursor

    console.log(`Repos: ${reposData.nodes.length}`)
    repos = repos.concat(reposData.nodes)
  }
  fs.writeFile('./data.json', JSON.stringify(repos))
  return repos
}