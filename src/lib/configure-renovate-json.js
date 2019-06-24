const { access, writeFile } = require('fs').promises
const { TARGET_FILE, GIT_COMMIT_MESSAGE } = require('../config')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const template = require('../data/template')

module.exports = async (repoPath) => {
  const branchName = 'update-renovate-json'
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
    console.log('Writing to file!')
    await writeFile(targetFile, JSON.stringify(template, null, 2))
  } catch (error) {
    throw error
  }

  try {
    console.log(`Adds branch ${branchName}`)
    await exec(`git checkout -b ${branchName}`)
    console.log(`Staging file ${targetFile}`)
    await exec(`git add ${targetFile}`)
    console.log(`Commiting and pushing to ${branchName} with message ${commitMessage}`)
    await exec(`git commit -m ${commitMessage}`)
    await exec(`git push --set-upstream origin ${branchName}`)
  } catch (error) {
    throw error
  }
  
  process.chdir(origPath)
}