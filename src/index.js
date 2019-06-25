const getRepos = require('./lib/get-repos-gql')
const cloneRepo = require('./lib/clone-repo')
const confRenovate = require('./lib/configure-renovate-json')
const createPr = require('./lib/create-pr')
const tempDir = require('./lib/temp-dir')
const { logger } = require('@vtfk/logger')

;(async () => {
  logger('info', ['index', 'Start'])
  try {
    const repos = await getRepos('Sherex', 'user')
    const tempPath = await tempDir.create()
  
    for (let i = 0; i < 2 /*repos.length*/; i++) {
      const repo = repos[i]
      logger('info', ['index', repo.nameWithOwner, 'Processing'])
      const repoPath = await cloneRepo(repo.nameWithOwner, tempPath)
      await confRenovate(repoPath)
      await createPr(repo.id)
      logger('info', ['index', repo.nameWithOwner, 'Done'])
    }
  
    await tempDir.remove()
  } catch (error) {
    throw error
  }

  
})().catch(error => {
  logger('error', ['index', 'error in index', error])
  console.error(error)
})
