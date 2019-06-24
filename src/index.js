const getRepos = require('./lib/get-repos-gql')
const cloneRepo = require('./lib/clone-repo')
const confRenovate = require('./lib/configure-renovate-json')
const createPr = require('./lib/create-pr')
const tempDir = require('./lib/temp-dir')
;(async () => {
  try {
    const repos = await getRepos('user', 'Sherex')
    const tempPath = await tempDir.create()
  
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i]
      console.log(`#### ${repo.nameWithOwner} ####`)
      const repoPath = await cloneRepo(repo.nameWithOwner, tempPath)
      console.log(`Configuring ${repoPath}`)
      await confRenovate(repoPath)
      await createPr(repo.id)
      console.log('Done!')
    }
  
    await tempDir.remove()
  } catch (error) {
    throw error
  }

  
})().catch(error => {
  console.error(error)
})
