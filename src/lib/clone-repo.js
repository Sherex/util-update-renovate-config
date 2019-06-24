const { promisify } = require('util')
const path = require('path')
const exec = promisify(require('child_process').exec)
const rimraf = promisify(require('rimraf'))
const { mkdir, access } = require('fs').promises
const { GITHUB_API_TOKEN, GITHUB_BASE_URL } = require('../config')
const url = require('url')


module.exports = async (repoPath, tempGitDir) => {

  let repoUrl = new url.URL(GITHUB_BASE_URL)
  repoUrl.username = GITHUB_API_TOKEN
  repoUrl.pathname = repoPath

  const localGitRepoPath = path.join(tempGitDir, repoPath)

  try {
    await exec('git --version')
  } catch (error) {
    console.error('Please install "git"')
    throw error
  }

  try {
    access(tempGitDir)
    console.log(`Cloning repo "${repoPath}" to ${localGitRepoPath}`)
    await exec(`git clone ${repoUrl} ${localGitRepoPath}`)
    console.log(`Repo cloned successfully!`)
  } catch (error) {
    throw error
  }
  return localGitRepoPath
}