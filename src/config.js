require('dotenv').config()

module.exports = {
  GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN || '',
  GITHUB_BASE_URL: process.env.GITHUB_BASE_URL || 'https://github.com',
  GITHUB_PR_BRANCH: process.env.GITHUB_PR_BRANCH || 'update-renovate-json',
  GITHUB_PR_TITLE: process.env.GITHUB_PR_TITLE || 'Update Renovate Configuration',
  TEMP_GIT_DIR: process.env.TEMP_GIT_DIR || './tmp-git',
  TARGET_FILE: process.env.TARGET_FILE || 'renovate.json',
  GIT_COMMIT_MESSAGE: process.env.GIT_COMMIT_MESSAGE // Defaults to 'Updated ${targetFilename}'
}
