const { promisify } = require('util')
const path = require('path')
const exec = promisify(require('child_process').exec)
const { access } = require('fs').promises
const { GITHUB_API_TOKEN, GITHUB_BASE_URL } = require('../config')
const url = require('url')
const { logger } = require('@vtfk/logger')

module.exports = async (repoPath, tempGitDir) => {
  let repoUrl = new url.URL(GITHUB_BASE_URL)
  repoUrl.username = GITHUB_API_TOKEN
  repoUrl.pathname = repoPath

  const localGitRepoPath = path.join(tempGitDir, repoPath)

  try {
    await exec('git --version')
  } catch (error) {
    logger('error', ['clone-repo', 'git is not installed', error])
    throw error
  }

  try {
    await access(tempGitDir)
    logger('info', ['clone-repo', 'cloning repo', repoPath, localGitRepoPath])
    await exec(`git clone ${repoUrl} ${localGitRepoPath}`)
    logger('info', ['clone-repo', 'clone', 'success'])
  } catch (error) {
    throw error
  }
  return localGitRepoPath
}
