<template>
	<div id="app">
		<div>
			<h1>Fork Visualiser</h1>
		</div>
		<Menu @repoLink="repoUpdate" />
		<Visual v-bind="{ currentRepo }" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import Menu from './components/Menu.vue'
import Visual from './components/Visual.vue'

import graphQLQuery from './graphQLQuery'
import apiKey from '../githubAPIKey'

const TOKEN = apiKey

let currentRepo: string
let graphQL: object

const vue = Vue.extend({
	name: 'app',
	components: {
		Menu,
		Visual,
	},
	data() {
		return {
			currentRepo,
			graphQL,
		}
	},
	mounted: function() {},
	methods: {
		repoUpdate: function(repo: string) {
			this.currentRepo = repo
			this.fetchData(repo)
		},
		fetchData: async function(repo: string) {
			this.graphQL = await fetch('https://api.github.com/graphql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `token ${TOKEN}`,
				},
				body: JSON.stringify({ query: graphQLQuery }),
			})
				.then(res => res.json())
				.then(res => {
					return res.data
				})
		},
	},
	watch: {
		graphQL: function() {
			console.log('graphQL update:', this.graphQL)
		},
	},
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
