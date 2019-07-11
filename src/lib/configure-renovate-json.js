const { access, writeFile } = require('fs').promises
const { TARGET_FILE, GIT_COMMIT_MESSAGE, GITHUB_PR_BRANCH } = require('../config')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const template = require('../data/template')
const { logger } = require('@vtfk/logger')

module.exports = async (repoPath) => {
  const branchName = GITHUB_PR_BRANCH
  const targetFile = TARGET_FILE
  const commitMessage = GIT_COMMIT_MESSAGE || `Updated ${targetFile}`
  const origPath = process.cwd()

  process.chdir(repoPath)

  try {
    await access(targetFile)
  } catch (error) {
    throw Error(`Could not find ${targetFile}. Current path: ${process.cwd()}`)
  }

  try {
    logger('info', ['configure-renovate-json', 'writing template to', targetFile])
    await writeFile(targetFile, JSON.stringify(template, null, 2))
    logger('info', ['configure-renovate-json', 'template was successfully written to', targetFile])
  } catch (error) {
    logger('error', ['configure-renovate-json', 'error while writing template to', targetFile])
    throw error
  }

  try {
    logger('info', ['configure-renovate-json', 'creating branch', branchName])
    await exec(`git checkout -b ${branchName}`)
    logger('info', ['configure-renovate-json', 'staging file', targetFile])
    await exec(`git add ${targetFile}`)
    logger('info', ['configure-renovate-json', 'commiting with message', commitMessage])
    await exec(`git commit -m ${commitMessage}`)
    logger('info', ['configure-renovate-json', 'pushing branch', branchName])
    await exec(`git push --set-upstream origin ${branchName}`)
  } catch (error) {
    logger('error', ['configure-renovate-json', 'error while performing git commands', error])
    throw error
  }

  process.chdir(origPath)
}
