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
				endpoint="reports/outbound-call-analize"
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
							<span class="sub-item text-muted"
								><span v-if="scope.row.sum.answer">{{
									scope.row.sum.answer
								}}</span
								><span v-else>00:00:00</span></span
							>
						</template>
					</el-table-column>
					<el-table-column label="Çalma Süresi">
						<template slot-scope="scope">
							{{ scope.row.count.ivr }}
							<span class="sub-item text-muted"
								><span v-if="scope.row.sum.ringing">{{ scope.row.sum.ringing }}</span
								><span v-else>00:00:00</span></span
							>
						</template>
					</el-table-column>
					<el-table-column label="Abondan">
						<template slot-scope="scope">
							{{ scope.row.count.abondan }}
							<span class="sub-item text-muted"
								><span v-if="scope.row.sum.abondan">{{
									scope.row.sum.abondan
								}}</span
								><span v-else>00:00:00</span></span
							>
						</template>
					</el-table-column>
					<el-table-column label="Cevapsız">
						<template slot-scope="scope">
							{{ scope.row.count.unanswered }}
							<span class="sub-item text-muted"
								><span v-if="scope.row.sum.unanswered">{{
									scope.row.sum.unanswered
								}}</span
								><span v-else>00:00:00</span></span
							>
						</template>
					</el-table-column>
					<el-table-column label="Toplam">
						<template slot-scope="scope">
							{{ scope.row.count.total }}
							<span class="sub-item text-muted"
								><span v-if="scope.row.sum.total">{{
									scope.row.sum.total
								}}</span
								><span v-else>00:00:00</span></span
							>
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
						grid: {
							show: false,
						},
						chart: {
							height: 350,
							type: "area",
						},
						dataLabels: {
							enabled: false,
						},
						stroke: {
							curve: "smooth",
							show: true,
							width: 2,
						},
						yaxis: {
							type: "datetime",
							categories: [
								"2012-21-01",
								"2012-21-02",
								"2012-21-03",
								"2012-21-04",
								"2012-21-05",
								"2012-21-06",
								"2012-21-07",
							],
						},
						tooltip: {
							x: {
								format: "dd MMMM yy",
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
				sum: {
					visible: false,
					options: {
						grid: {
							show: false,
						},
						chart: {
							height: 350,
							type: "area",
						},
						dataLabels: {
							enabled: false,
						},
						stroke: {
							curve: "smooth",
							show: true,
							width: 2,
						},
						xaxis: {
							type: "datetime",
							categories: [],
							labels: {
								datetimeFormatter: {
									year: "yyyy",
									month: "MMM 'yy",
									day: "dd MMM",
									hour: "HH:mm",
								},
							},
						},

						yaxis: {
							labels: {
								formatter: function(value) {
									return new Date(value * 1000).toISOString().substr(11, 8);
								},
							},
						},
						tooltip: {
							x: {
								format: "dd MMMM yy",
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
				queue_id: {
					name: "Kuyruk",
					type: "queue",
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
				let cache = {};
				cache.date = item.date ? item.date : "";
				cache.count_answer = item.count.answer ? item.count.answer : "";
				cache.count_total = item.count.total ? item.count.total : "";
				cache.count_unanswered = item.count.unanswered ? item.count.unanswered : "";
				cache.count_unreachable = item.count.unreachable ? item.count.unreachable : "";
				cache.sum_answer = item.sum.answer ? item.sum.answer : "";
				cache.sum_calling = item.sum.calling ? item.sum.calling : "";
				cache.sum_ringing = item.sum.ringing ? item.sum.ringing : "";
				cache.sum_total = item.sum.total ? item.sum.total : "";
				arr.push(cache);
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
				{
					name: "Başarılı",
					data: [],
					color: "#00E396"
				},
				{
					name: "Ivr",
					data: [],
					color: "#008FFB"
				},
				{
					name: "Abondan",
					data: [],
					color: "#FFB01A"
				},
				{
					name: "Cevapsız",
					data: [],
					color: "#FF4560"
				},
			];
			let sum = [
				{
					name: "Başarılı",
					data: [],
					color: "#00E396"
				},
				{
					name: "Ivr",
					data: [],
					color: "#008FFB"
				},
				{
					name: "Abondan",
					data: [],
					color: "#FFB01A"
				},
				{
					name: "Cevapsız",
					data: [],
					color: "#FF4560"
				},
			];
			data.data.forEach((element) => {
				count[0].data.push(element.count.answer ? element.count.answer : 0);
				count[1].data.push(element.count.ivr ? element.count.ivr : 0);
				count[2].data.push(element.count.abondan ? element.count.abondan : 0);
				count[3].data.push(
					element.count.unanswered ? element.count.unanswered : 0
				);
				sum[0].data.push(element.sum.answer ? element.sum.answer : '00:00:00');
				sum[1].data.push(element.sum.ivr ? element.sum.ivr : '00:00:00');
				sum[2].data.push(element.sum.abondan ? element.sum.abondan : '00:00:00');
				sum[3].data.push(element.sum.unanswered ? element.sum.unanswered : '00:00:00');
			});

			this.charts.count.series = count;
			this.charts.count.visible = true;

			this.charts.sum.series = sum;
			this.charts.sum.visible = true;

			console.log(this.charts.count.series);
			console.log(this.charts.sum.series);
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
