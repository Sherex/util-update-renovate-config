const { TEMP_GIT_DIR } = require('../config')
const { mkdir } = require('fs').promises
const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))
const { logger } = require('@vtfk/logger')
const { join } = require('path')

module.exports.create = async () => {
  logger('info', ['temp-dir', 'Creating directory', TEMP_GIT_DIR])
  await mkdir(TEMP_GIT_DIR)
  return TEMP_GIT_DIR
}

module.exports.remove = async (subDirPath = '') => {
  logger('info', ['temp-dir', 'Removing directory', join(TEMP_GIT_DIR, subDirPath)])
  await rimraf(join(TEMP_GIT_DIR, subDirPath))
}
