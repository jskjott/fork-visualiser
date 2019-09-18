<template>
	<div id="app">
		<div>
			<h1>Fork Visualiser</h1>
		</div>
		<Menu/>
		<Visual/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

import Menu from './components/Menu.vue'
import Visual from './components/Visual.vue'

import graphQLQuery from './graphQLQuery'
import apiKey from '../githubAPIKey'

const TOKEN = apiKey

const vue = Vue.extend({
	name: 'app',
	components: {
		Menu,
		Visual,
	},
	data() {
		return {
			graphQL: null,
		}
	},
	mounted: function() {
		fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `token ${TOKEN}`,
			},
			body: JSON.stringify({ query: graphQLQuery }),
		})
			.then(res => res.json())
			.then(res => {
				this.graphQL = res.data
			})
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

</style>
