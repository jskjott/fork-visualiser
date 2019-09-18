export default `{
  repository(owner: "jskjott", name: "webring") {
    name
    owner {
      login
      avatarUrl
    }
    defaultBranchRef {
      target {
        ... on Commit {
          history(first: 100) {
            edges {
              node {
                ... on Commit {
                  oid
                }
              }
            }
          }
        }
      }
    }
    forks(first: 100) {
      nodes {
        name
        owner {
          login
          avatarUrl
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 100) {
                edges {
                  node {
                    ... on Commit {
                      oid
                    }
                  }
                }
              }
            }
          }
        }
      }
      edges {
        node {
          url
        }
      }
    }
  }
}`
