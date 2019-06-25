module.exports = /* GraphQL */`
query repos($name: String!, $cursor: String) {
  user(login: $name) {
    repositories(first: 100, after: $cursor) {
      nodes {
        object(expression: "master:renovate.json") {
          ... on Blob {
            repository {
              name
            }
            text
          }
        }
        id
        url
        nameWithOwner
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
}`