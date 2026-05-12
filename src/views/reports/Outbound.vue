<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<app-card :remove-body-padding="true" class="inbound-reports">
				<el-tabs v-model="activeTab">
					<el-tab-pane name="count" label="Çağrı Sayısı">
						<div class="px-2 pt-4 pb-2" v-if="charts.count.visible">
							<apexchart
								height="250"
								type="area"
								:options="charts.count.options"
								:series="charts.count.series"
							></apexchart>
						</div>
						<div class="text-center p-3" v-else>
							<small><i class="el-icon-loading"></i> Yükleniyor</small>
						</div>
					</el-tab-pane>
					<el-tab-pane name="sum" label="Çağrı Süresi">
						<div class="px-2 pt-4 pb-2" v-if="charts.sum.visible">
							<apexchart
								height="250"
								type="area"
								:options="charts.sum.options"
								:series="charts.sum.series"
							></apexchart>
						</div>
						<div class="text-center p-3" v-else>
							<small><i class="el-icon-loading"></i> Yükleniyor</small>
						</div>
					</el-tab-pane>
				</el-tabs>
			</app-card>
			<app-table
				:downloadable="true"
				:before-download="download"
				endpoint="reports/outbound-analysis"
				:options="options"
				vector="report"
				:filters="filters"
				@loaded="handle"
			>
				<template slot-scope="item">
					<el-table-column label="Periyot">
						<template slot-scope="scope">
							<a href="#" @click="changeFilter(scope.row.date)">{{
								scope.row.date
							}}</a>
							<small class="sub-item text-muted d-block">{{
								scope.row.from
							}}</small>
						</template>
					</el-table-column>
					<el-table-column label="Başarılı">
						<template slot-scope="scope">
							{{ scope.row.count.answer }}
							<span class="sub-item text-muted">{{ scope.row.sum.answer }}</span>
						</template>
					</el-table-column>
					<el-table-column label="Ulaşılamayan">
						<template slot-scope="scope">
							{{ scope.row.count.unreachable }}
							<span class="sub-item text-muted">{{ scope.row.sum.unreachable }}</span>
						</template>
					</el-table-column>
					<el-table-column label="Cevapsız">
						<template slot-scope="scope">
							{{ scope.row.count.unanswered }}
							<span class="sub-item text-muted">{{ scope.row.sum.unanswered }}</span>
						</template>
					</el-table-column>
					<el-table-column label="Toplam">
						<template slot-scope="scope">
							{{ scope.row.count.total }}
							<span class="sub-item text-muted">{{ scope.row.sum.total }}</span>
						</template>
					</el-table-column>
				</template>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
	components: {
		apexchart: VueApexCharts,
	},
	data() {
		return {
			activeTab: "count",
			charts: {
				count: {
					visible: false,
					options: {
						grid: { show: false },
						chart: { height: 350, type: "area" },
						dataLabels: { enabled: false },
						stroke: { curve: "smooth", show: true, width: 2 },
						xaxis: {
							type: "category",
							categories: [],
						},
						fill: {
							gradient: {
								shade: "light",
								type: "vertical",
								shadeIntensity: 0.9,
								gradientToColors: undefined,
								inverseColors: false,
								opacityFrom: 1,
								opacityTo: 0.3,
								stops: [0, 90, 100],
								colorStops: [],
							},
						},
					},
					series: [],
				},
				sum: {
					visible: false,
					options: {
						grid: { show: false },
						chart: { height: 350, type: "area" },
						dataLabels: { enabled: false },
						stroke: { curve: "smooth", show: true, width: 2 },
						xaxis: {
							type: "category",
							categories: [],
						},
						yaxis: {
							labels: {
								formatter: function(value) {
									const seconds = Math.max(0, Math.floor(Number(value) || 0));
									const h = Math.floor(seconds / 3600);
									const m = Math.floor((seconds % 3600) / 60);
									const s = seconds % 60;
									const pad = (n) => String(n).padStart(2, "0");
									return `${pad(h)}:${pad(m)}:${pad(s)}`;
								},
							},
						},
						fill: {
							gradient: {
								shade: "light",
								type: "vertical",
								shadeIntensity: 0.9,
								gradientToColors: undefined,
								inverseColors: false,
								opacityFrom: 1,
								opacityTo: 0.3,
								stops: [0, 90, 100],
								colorStops: [],
							},
						},
					},
					series: [],
				},
			},
			options: {},
			filters: {
				date: {
					name: "Tarih",
					type: "date",
					hidden: true,
					value: "",
					options: [],
				},
				user_id: {
					name: "Kullanıcı",
					type: "user",
					value: null,
					options: [],
				},
				number_id: {
					name: "Numara",
					type: "number",
					value: null,
					options: [],
				},
				interval: {
					name: "Periyot",
					type: "primary",
					hidden: true,
					value: "monthly",
					options: [
						{ name: "Aylık", value: "monthly" },
						{ name: "Günlük", value: "daily" },
						{ name: "Saatlik", value: "hourly" },
					],
				},
			},
			crm: {
				visible: false,
				id: false,
			},
		};
	},
	created() {},
	methods: {
		download(data){
			let arr = [];
			data.forEach((item) => {
				arr.push({
					date: item.date || "",
					count_answer: item.count.answer || 0,
					count_unreachable: item.count.unreachable || 0,
					count_unanswered: item.count.unanswered || 0,
					count_total: item.count.total || 0,
					sum_answer: item.sum.answer || "00:00:00",
					sum_calling: item.sum.calling || "00:00:00",
					sum_ringing: item.sum.ringing || "00:00:00",
					sum_unreachable: item.sum.unreachable || "00:00:00",
					sum_unanswered: item.sum.unanswered || "00:00:00",
					sum_total: item.sum.total || "00:00:00",
				});
			});
			return arr;
		},
		changeFilter(date) {
			
			if (this.filters.interval.value === "monthly") {
				let filtersCache = { ...this.filters };
				filtersCache.interval.value = "daily";
				filtersCache.date.value = date;
				this.filters = { ...filtersCache };
			} else if (this.filters.interval.value === "daily") {
				let filtersCache = { ...this.filters };
				filtersCache.interval.value = "hourly";
				filtersCache.date.value = date;
				this.filters = { ...filtersCache };
			}
		},
		handle(data) {
			let count = [
				{ name: "Başarılı", data: [], color: "#00E396" },
				{ name: "Ulaşılamayan", data: [], color: "#FFB01A" },
				{ name: "Cevapsız", data: [], color: "#FF4560" },
			];
			let sum = [
				{ name: "Başarılı", data: [], color: "#00E396" },
				{ name: "Ulaşılamayan", data: [], color: "#FFB01A" },
				{ name: "Cevapsız", data: [], color: "#FF4560" },
			];
			let dates = [];
			data.data.forEach((element) => {
				dates.push(element.date);
				count[0].data.push(element.count.answer || 0);
				count[1].data.push(element.count.unreachable || 0);
				count[2].data.push(element.count.unanswered || 0);
				// Chart için ham saniye — yaxis formatter HH:MM:SS'e çevirir
				sum[0].data.push(element.sum.answer_seconds || 0);
				sum[1].data.push(element.sum.unreachable_seconds || 0);
				sum[2].data.push(element.sum.unanswered_seconds || 0);
			});

			// Apex'in deep watcher'ı nested categories mutation'ını her zaman
			// yakalamadığı için options'ı yeni reference olarak yeniden atıyoruz
			// ve chart'ı bir tick için kapatıp açarak temiz remount sağlıyoruz.
			this.charts.count.series = count;
			this.charts.count.options = {
				...this.charts.count.options,
				xaxis: { ...this.charts.count.options.xaxis, categories: dates },
			};
			this.charts.sum.series = sum;
			this.charts.sum.options = {
				...this.charts.sum.options,
				xaxis: { ...this.charts.sum.options.xaxis, categories: dates },
			};

			this.charts.count.visible = false;
			this.charts.sum.visible = false;
			this.$nextTick(() => {
				this.charts.count.visible = true;
				this.charts.sum.visible = true;
			});
		},
	},
};
</script>
<style>
.inbound-reports .el-tabs__nav-wrap::after {
	height: 0;
}
.inbound-reports .el-tabs__header.is-top {
	padding: 15px 10px 0 10px !important;
	border-bottom: 1px solid rgba(135, 150, 165, 0.1);
}
.inbound-reports .el-tabs__item {
	padding: 0 20px 0 20px !important;
	line-height: 26px !important;
}
</style>
