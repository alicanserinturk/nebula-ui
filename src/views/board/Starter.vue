<template>
	<app-module>
		<div class="pt-3 pb-3">
			<h5 class="font-weight-bold mb-0">Hoş Geldin {{ currentUser.name }}</h5>
			<small>Genel Durum</small>
		</div>
		<app-module-body>
			<div class="row row-md">
				<div
					v-for="(widget, index) in sortedWidgets"
					:key="index"
					:class="widgetCol(widget.type)"
				>
					<CallReportByDate
						v-if="widget.type === 'manager_call_report'"
						:data="widget.data"
						@filter-change="onManagerFilterChange"
					/>
					<AgentBoard
						v-else-if="widget.type === 'agent_performance'"
						:data="widget.data"
					/>
					<AgentTasksWidget
						v-else-if="widget.type === 'agent_tasks'"
						:data="widget.data"
					/>
					<AnnouncementsWidget
						v-else-if="widget.type === 'announcements'"
						:data="widget.data"
					/>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<script>
import CallReportByDate from "./CallReportByDate";
import AgentBoard from "./AgentBoard";
import AnnouncementsWidget from "./AnnouncementsWidget";
import AgentTasksWidget from "./AgentTasksWidget";
import { mapGetters } from "vuex";

export default {
	components: {
		CallReportByDate,
		AgentBoard,
		AnnouncementsWidget,
		AgentTasksWidget,
	},
	data() {
		return {
			widgets: [],
			filter: {
				interval: "weekly",
			},
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
		sortedWidgets() {
			const order = [
				"manager_call_report",
				"agent_performance",
				"announcements",
				"agent_tasks",
			];
			return [...this.widgets].sort(
				(a, b) => order.indexOf(a.type) - order.indexOf(b.type)
			);
		},
	},
	created() {
		this.fetchInit();
	},
	methods: {
		fetchInit() {
			this.$api.get("dashboard/init", this.filter, (response) => {
				this.widgets = response.data.data.widgets;
			});
		},
		onManagerFilterChange(newFilter) {
			this.filter = { ...this.filter, interval: newFilter.interval };
			this.fetchInit();
		},
		widgetCol(type) {
			if (type === "announcements") return "col-md-8 col-12 mb-3";
			if (type === "agent_tasks") return "col-md-4 col-12 mb-3";
			return "col-md-12 mb-3";
		},
	},
};
</script>
