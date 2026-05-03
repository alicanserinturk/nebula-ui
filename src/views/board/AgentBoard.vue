<template>
	<div class="row">
		<div class="col">
			<app-card title="Günlük Performansınız">
				<AgentPerformanceGraphs :data="items"></AgentPerformanceGraphs>
			</app-card>
		</div>
	</div>
</template>
<script>
import AgentPerformanceGraphs from "../reports/AgentPerformanceGraphs.vue";

export default {
	components:{
		AgentPerformanceGraphs
	},
	data() {
		return {
			items: {},
		};
	},
	created() {
		this.getItems();
	},
	methods: {
		getItems() {
			this.$api.get("dashboard/for-agent", {}, (response) => {
				this.items = response.data;
			});
		},
	},
};
</script>
