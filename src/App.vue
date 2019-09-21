<template>
	<div id="app">
		<div>
			<h1>Fork Visualiser</h1>
		</div>
		<Menu @repoLink="repoUpdate" />
		<Visual v-bind="{ graphQL }" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import Menu from './components/Menu.vue'
import Visual from './components/Visual.vue'

import apiKey from '../githubAPIKey'

const TOKEN = apiKey

export interface GraphQL {
	repository: {
		name: string
		owner: {
			login: string
			avatarUrl: string
		}
		defaultBranchRef: {
			target: []
		}
		forks: {
			edges: []
			nodes: []
		}
	}
}

let graphQL: GraphQL

const vue = Vue.extend({
	name: 'app',
	components: {
		Menu,
		Visual,
	},
	data() {
		return {
			graphQL,
		}
	},
	mounted: function() {},
	methods: {
		repoUpdate: function(repo: { repo: string }) {
			const query = this.constructQuery(repo.repo)
			this.fetchData(query)
		},
		fetchData: async function(query: string) {
			this.graphQL = await fetch('https://api.github.com/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `token ${TOKEN}`,
				},
				body: JSON.stringify({ query }),
			})
				.then(res => res.json())
				.then(res => {
					return res.data
				})
		},
		constructQuery: function(repo: string) {
			const [userName, repoName] = repo
				.match(/github\.com(.*)/)[1]
				.slice(1)
				.split('/')

			return `{
			  repository(owner: "${userName}", name: "${repoName}") {
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
		},
	}
})

export default vue
</script>

<style>
body {
	margin: 0;
	font-family: Arial, Helvetica, sans-serif;
	color: #c5cbe1;
}

h1 {
	margin-left: 2rem;
}
</style>
