const { TEMP_GIT_DIR } = require('../config')
const { mkdir, rmdir } = require('fs').promises
const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))

module.exports.create = async () => {
  console.log(`Creating directory ${TEMP_GIT_DIR}`)
  await mkdir(TEMP_GIT_DIR)
  return TEMP_GIT_DIR
}

module.exports.remove = async () => {
  console.log(`Removing directory ${TEMP_GIT_DIR}`)
  await rimraf(TEMP_GIT_DIR)
}