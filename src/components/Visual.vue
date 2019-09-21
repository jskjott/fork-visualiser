<template>
	<div id="container">
		<svg
id="visualisation" :width="width" :height="height"></svg>
	</div>
</template>

<script>
import * as d3 from 'd3'
import Vue from 'vue'

const RADIUS = 6
const D3CHARGE = -250
const STROKEOPACITY = 0.6
const HEIGHT = 400
const WIDTH = 400

export default Vue.extend({
	name: 'Visual',
	props: {
		graphQL: null,
	},
	data() {
		return {
			height: HEIGHT,
			width: WIDTH,
		}
	},
	methods: {
		drawVisualisation(graphQL) {
			const parentRepoNode = {
				defaultBranchRef: graphQL.repository.defaultBranchRef,
				name: graphQL.repository.name,
				owner: graphQL.repository.owner,
			}

			const nodes = [parentRepoNode]

			nodes.push(...graphQL.repository.forks.nodes)

			const nodeById = d3.map()
			const nodeByIndex = d3.map()

			nodes.forEach((node, i) => {
				nodeById.set(node.id, i)
				nodeByIndex.set(i.toString(), node)
			})

			const links = nodes.map((link, i) => {
				const linkObject = {
					index: i,
					source: nodes[0],
					target: nodes[i],
				}
				return linkObject
			})

			const simulation = d3
				.forceSimulation(nodes)
				.force('link', d3.forceLink(links))
				.force('charge', d3.forceManyBody().strength(D3CHARGE))
				.force(
					'center',
					d3.forceCenter(this.width / 2, this.height / 2),
				)

			const svg = d3.select('#visualisation')

			const link = svg
				.append('g')
				.attr('stroke', '#999')
				.attr('stroke-opacity', STROKEOPACITY)
				.selectAll('line')
				.data(links)
				.join('line')
				.attr('stroke-width', Math.sqrt(1))
				.attr('id', d => `line${d.index}`)
				.attr('stroke-opacity', STROKEOPACITY)

			const node = svg
				.append('g')
				.attr('stroke', 'black')
				.attr('stroke-width', 1)
				.selectAll('circle')
				.data(nodes)
				.join('circle')
				.attr('r', RADIUS)
				.attr('fill', '#626369')
				.attr('id', d => `circle${d.index}`)

			simulation.on('tick', () => {
				link.attr('x1', d => d.source.x)
					.attr('y1', d => d.source.y)
					.attr('x2', d => d.target.x)
					.attr('y2', d => d.target.y)

				node.attr(
					'cx',
					d =>
						(d.x = Math.max(
							RADIUS,
							Math.min(this.width - RADIUS, d.x),
						)),
				).attr(
					'cy',
					d =>
						(d.y = Math.max(
							RADIUS,
							Math.min(this.height - RADIUS, d.y),
						)),
				)
				node.attr('cx', d => d.x).attr('cy', d => d.y)
			})

			svg.node()
		},
	},
	watch: {
		graphQL: function() {
			this.drawVisualisation(this.graphQL)
		},
	},
})
</script>

<style scoped>
#container {
	display: grid;
	justify-items: center;
	align-items: center;
}
</style>
