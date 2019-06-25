module.exports = /* GraphQL */`
mutation pr($prInput: CreatePullRequestInput!) {
  createPullRequest(input: $prInput) {
    pullRequest {
      author {
        login
      }
    }
  }
}`