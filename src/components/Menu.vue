<template>
	<div class="menu">
		<input
			v-model="repository"
			placeholder="Paste in link to a Github repository"
		/>
		<button v-on:click="repoLink(repository)">
			<h2>Visualise Forks</h2>
		</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

let repository: string

export default Vue.extend({
	name: 'Menu',
	data() {
		return {
			repository,
		}
	},
	props: {
		currentRepo: String,
	},
	methods: {
		repoLink(repo: string) {
			this.$emit('repoLink', { repo })
		},
	},
})
</script>

<style scoped>
.menu {
	display: grid;
	justify-items: center;
}

input {
	background-color: #d0d2df;
	color: #626369;
	border: none;
	height: 2rem;
	font-size: 1rem;
	width: 100%;
	margin-bottom: 1rem;
	text-align: center;
}

button {
	background-color: #d0d2df;
	color: #626369;
	padding: 0 0.75rem 0 0.75rem;
}
</style>
