<template>
	<div class="call-reports">
		<div class="row">
			<div class="col-12 col-xl-12">
				<app-card :remove-body-padding="true" class="app-call-chart">
					<div class="pl-4 pr-3 pb-2 pt-3">
						<div class="row row-sm">
							<div class="col pt-1">
								<span class="text-label text-muted">Çağrı Değerlendirme</span>
							</div>
							<div class="col-auto">
								<el-radio-group size="mini" v-model="filter.direction">
									<el-radio-button label="in">Gelen</el-radio-button>
									<el-radio-button label="out">Giden</el-radio-button>
								</el-radio-group>
							</div>
							<div class="col-auto">
								<el-radio-group size="mini" v-model="filter.interval">
									<el-radio-button label="daily">Bugün</el-radio-button>
									<el-radio-button label="weekly">1 H</el-radio-button>
									<el-radio-button label="monthly">1 Ay</el-radio-button>
								</el-radio-group>
							</div>
						</div>
					</div>
					<el-tabs v-model="activeTab">
						<el-tab-pane :name="key" :key="key" v-for="(chart, key) in charts">
							<template slot="label">
								<h5 class="font-weight-bold mb-0 pt-1">
									<ion-icon
										:name="types[key].icon"
										class=" text-muted mr-1"
									></ion-icon
									>{{ getChartTotal(key, "this") }}
								</h5>
								<small class="text-muted">Önceki Dönem</small>
								<i
									v-if="
										getChartTotal(key, 'before') > getChartTotal(key, 'this')
									"
									class="i-con i-con-trending-down text-danger"
									><i></i
								></i>
								<i
									v-else-if="
										getChartTotal(key, 'before') < getChartTotal(key, 'this')
									"
									class="i-con i-con-trending-up text-success"
									><i></i
								></i>
								<small class="mx-1 text-muted text-danger">
									<span
										>%{{
											getChartPercent(
												key,
												getChartTotal(key, "before"),
												getChartTotal(key, "this")
											)
										}}</span
									>
									({{ getChartTotal(key, "before") }})
								</small>
							</template>
							<div class="px-3" style="height:317px">
								<apexchart
									:key="'chart' + key"
									v-if="chart.visible"
									height="300"
									:options="chart.chartOptions"
									:series="chart.series"
								></apexchart>
							</div>
						</el-tab-pane>
					</el-tabs>
					<div>
						<!--<div class="px-4 pb-3 mb-2 b-b">
						<div class="mb-3">
							<span class="text-md">Çağrı Grafiği</span><br />
						</div>
						<div class="d-flex">
							<div class="i-con-h-a">
								<small class="text-muted">Bugün</small>
								<div class="mt-1">
									<strong class="text-md">365</strong>
									<small class="mx-1 text-muted">Geçen hafta bugüne göre</small>
									<i class="i-con i-con-trending-up text-success"><i></i></i>
									<small class="mx-1 text-muted">+5%</small>
								</div>
							</div>
						</div>
					</div>-->
						<div class="px-2"></div>
					</div>
				</app-card>
			</div>
		</div>
	</div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import moment from "moment";
import formatter from "../../utils/Formatters";
import { mapGetters } from "vuex";

export default {
	components: {
		apexchart: VueApexCharts,
	},
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			types: {
				time: {
					name: "Görüşme Süresi",
					icon: "time-outline",
				},
				count: {
					name: "Görüşme Sayısı",
					icon: "call-outline",
				},
			},
			chartVisible: false,
			filter: {
				interval: "weekly",
				direction: "out",
			},
			percentage: 25,
			colors: [
				{ color: "#fe4d62", percentage: 10 },
				{ color: "#ffd14d", percentage: 25 },
				{ color: "#007bff", percentage: 50 },
			],
			activeTab: "count",
			days: [],
			dates: {
				this: [],
				before: [],
			},
			charts: {
				count: {
					visible: false,
					series: [],
					chartOptions: {
						grid: {
							show: false,
						},
						chart: {
							height: 340,
							type: "area",
						},
						dataLabels: {
							enabled: false,
						},
						stroke: {
							curve: "smooth",
							show: true,
							width: 0,
							colors: [],
						},
						xaxis: {
							type: "string",
							categories: [],
							label: {
								style: {
									colors: [],
								},
							},
						},
						yaxis: {
							labels: {
								formatter: (value) => {
									return value;
								},
							},
						},
						markers: {
							colors: [],
						},

						fill: {
							colors: [],
							type: "gradient",
							gradient: {
								shade: "light",
								type: "vertical",
								shadeIntensity: 0,
								gradientToColors: undefined,
								inverseColors: false,
								opacityFrom: 0.8,
								opacityTo: 0.8,
								stops: [100, 100],
								colorStops: [],
							},
						},
					},
				},
				time: {
					visible: false,
					series: [],
					chartOptions: {
						grid: {
							show: false,
						},
						chart: {
							height: 340,
							type: "area",
						},
						dataLabels: {
							enabled: false,
						},
						stroke: {
							curve: "smooth",
							show: true,
							width: 0,
							colors: [],
						},
						xaxis: {
							type: "string",
							categories: [],
							label: {
								style: {
									colors: [],
								},
							},
						},
						yaxis: {
							labels: {
								formatter: (value) => {
									return formatter.millisecondToDate(value);
								},
							},
						},
						markers: {
							colors: [],
						},

						fill: {
							colors: [],
							type: "gradient",
							gradient: {
								shade: "light",
								type: "vertical",
								shadeIntensity: 0,
								gradientToColors: undefined,
								inverseColors: false,
								opacityFrom: 0.8,
								opacityTo: 0.8,
								stops: [100, 100],
								colorStops: [],
							},
						},
					},
				},
			},
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
		f() {
			return formatter;
		},
		items() {
			return this.data || {};
		},
		getTotalInboundCounts() {
			let count = 0;
			if (this.items.call) {
				this.items.call.count.inbound.forEach((item) => {
					count += item.count;
				});
			}
			return count;
		},
		getTotalOutboundCounts() {
			let count = 0;
			if (this.items.call) {
				this.items.call.count.outbound.forEach((item) => {
					count += item.count;
				});
			}
			return count;
		},
		getTotalInboundTimes() {
			let time = 0;
			if (this.time.series[0]) {
				this.time.series[0].data.forEach((item) => {
					if (item) time += item;
				});
			}
			return time;
		},
		getTotalOutboundTimes() {
			let time = 0;
			if (this.time.series[1]) {
				this.time.series[1].data.forEach((item) => {
					if (item) time += item;
				});
			}
			return time;
		},
	},
	created() {
		this.getDays();
	},
	watch: {
		filter: {
			deep: true,
			handler(newFilter, oldFilter) {
				if (newFilter.interval !== oldFilter.interval) {
					this.$emit("filter-change", { ...newFilter });
				} else {
					this.getChartData();
				}
			},
		},
		data: {
			deep: true,
			handler() {
				this.getDays();
			},
		},
	},
	methods: {

		getChartTotal(type, term) {
			let count;
			let data = false;
			this.charts[type].series.forEach((item) => {
				if (item.primaryKey == term) data = [...item.data];
			});
			let total = 0;
			if (data && data.length > 0) {
				data.forEach((item) => {
					total += item;
				});
			}
			return type === "time" ? formatter.millisecondToDate(total) : total;
		},
		getChartPercent(type, thisTerm, beforeTerm) {
			if (type === "time") {
				thisTerm = formatter.dateToMilliseconds(thisTerm);
				beforeTerm = formatter.dateToMilliseconds(beforeTerm);
			}
			if (thisTerm === beforeTerm) return 0;
			else if (thisTerm < beforeTerm)
				return Math.abs(((thisTerm / beforeTerm) * 100 - 100).toFixed(0));
			else return Math.abs(((beforeTerm / thisTerm) * 100 - 100).toFixed(0));
		},
		LightenDarkenColor(col, amt) {
			var usePound = false;

			if (col[0] == "#") {
				col = col.slice(1);
				usePound = true;
			}

			var num = parseInt(col, 16);

			var r = (num >> 16) + amt;

			if (r > 255) r = 255;
			else if (r < 0) r = 0;

			var b = ((num >> 8) & 0x00ff) + amt;

			if (b > 255) b = 255;
			else if (b < 0) b = 0;

			var g = (num & 0x0000ff) + amt;

			if (g > 255) g = 255;
			else if (g < 0) g = 0;

			return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
		},

		dateToSecond(string) {
			return formatter.millisecondToDate(string);
		},
		getDays() {
			let today = moment().format("YYYY-MM-DD");
			let i;
			let beforeDays = [];
			let thisDays = [];
			if (this.filter.interval === "weekly") {
				let lastWeekStart = moment()
					.subtract(1, "weeks")
					.startOf("isoWeek")
					.format("YYYY-MM-DD");
				let thisWeekStart = moment()
					.startOf("isoWeek")
					.format("YYYY-MM-DD");
				for (i = 0; i < 7; i++) {
					beforeDays.push(
						moment(lastWeekStart)
							.add(i, "d")
							.format("YYYY-MM-DD")
					);
					thisDays.push(
						moment(thisWeekStart)
							.add(i, "d")
							.format("YYYY-MM-DD")
					);
				}
				this.dates.before = beforeDays;
				this.dates.this = thisDays;
			} else if (this.filter.interval === "daily") {
				this.dates.before = [
					moment()
						.subtract(1, "d")
						.format("YYYY-MM-DD"),
				];
				this.dates.this = [moment().format("YYYY-MM-DD")];
			} else {
				let lastMonthStart = moment(
					moment()
						.subtract(1, "M")
						.format("YYYY-MM-DD")
				).startOf("month");
				let lastMonthEnd = moment()
					.subtract(1, "M")
					.endOf("month")
					.format("YYYY-MM-DD");
				let thisMonthStart = moment(moment().format("YYYY-MM-DD")).startOf(
					"month"
				);
				let thisMonthEnd = moment()
					.endOf("month")
					.format("YYYY-MM-DD");
				let lastdiff = Math.abs(lastMonthStart.diff(lastMonthEnd, "days"));
				let thisdiff = Math.abs(thisMonthStart.diff(thisMonthEnd, "days"));
				for (i = 0; i < lastdiff + 1; i++) {
					beforeDays.push(
						moment(lastMonthStart.format("YYYY-MM-DD"))
							.add(i, "d")
							.format("YYYY-MM-DD")
					);
				}
				for (i = 0; i < thisdiff + 1; i++) {
					thisDays.push(
						moment(thisMonthStart.format("YYYY-MM-DD"))
							.add(i, "d")
							.format("YYYY-MM-DD")
					);
				}
				this.dates.before = beforeDays;
				this.dates.this = thisDays;
			}
			this.getChartData();
		},
		getChartCategories() {
			if (this.filter.interval === "daily") {
				return ["1"];
			} else if (this.filter.interval === "weekly") {
				return [
					"Pzt",
					"Salı",
					"Çarşamba",
					"Perşembe",
					"Cuma",
					"Cumartesi",
					"Pazar",
				];
			} else {
				return [
					"01",
					"02",
					"03",
					"04",
					"05",
					"06",
					"07",
					"08",
					"09",
					"10",
					"11",
					"12",
					"13",
					"14",
					"15",
					"16",
					"17",
					"18",
					"19",
					"20",
					"21",
					"22",
					"23",
					"24",
					"25",
					"26",
					"27",
					"28",
					"29",
					"30",
					"31",
				];
			}
		},
		getChartData() {
			if (!this.items.call) return;
			let charts = ["count", "time"];
			charts.forEach((chartKey) => {
				let direction = this.filter.direction === "in" ? "inbound" : "outbound";
				let terms = {
					this: [],
					before: [],
				};
				let chartOptions = {
					chartOptions: { ...this.charts[chartKey].chartOptions },
					visible: false,
					series: [],
				};
				let chartCategories = this.getChartCategories();
				chartOptions.chartOptions.xaxis.categories = chartCategories;
				Object.keys(terms).forEach((termKey) => {
					let termData = [];
					chartCategories.forEach((chartCategory, chartCategoryIndex) => {
						if (
							this.items.call[chartKey][direction] !== null &&
							this.items.call[chartKey][direction].length > 0
						) {
							let value = 0;
							this.items.call[chartKey][direction].forEach((item) => {
								if (this.dates[termKey][chartCategoryIndex] === item.day) {
									value =
										chartKey === "time"
											? formatter.dateToMilliseconds(item[chartKey])
											: item[chartKey];
								} else {
								}
							});
							termData.push(value);
						} else {
							termData.push(0);
						}
					});
					let categoryName = termKey === "this" ? "Bu Dönem" : "Önceki Dönem";
					let color =
						termKey === "this"
							? this.currentUser.settings.interface_primary_color
							: this.LightenDarkenColor(
									this.currentUser.settings.interface_primary_color,
									100
							  );
					chartOptions.series.push({
						primaryKey: termKey,
						color: color,
						name: categoryName,
						data: termData,
					});
				});
				this.charts[chartKey].visible = false;
				chartOptions.chartOptions.xaxis.label.style.colors = [
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						-40
					),
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						100
					),
				];
				chartOptions.chartOptions.stroke.colors = [
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						-40
					),
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						100
					),
				];
				chartOptions.chartOptions.fill.colors = [
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						-40
					),
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						100
					),
				];
				chartOptions.chartOptions.markers.colors = [
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						-40
					),
					this.LightenDarkenColor(
						this.currentUser.settings.interface_primary_color,
						100
					),
				];
				chartOptions.visible = true;
				let self = this;
				setTimeout(() => {
					self.charts[chartKey].chartOptions = { ...chartOptions.chartOptions };
					self.charts[chartKey].series = [...chartOptions.series];
					self.charts[chartKey].visible = chartOptions.visible;
				}, 0);
			});
		},
	},
};
</script>
<style>
.call-reports .el-tabs__nav-wrap::after {
	height: 0;
}
.call-reports .el-tabs__header.is-top {
	padding: 15px 10px 0 10px !important;
	border-bottom: 1px solid rgba(135, 150, 165, 0.1);
}
.call-reports .el-tabs__item {
	padding: 0 20px 65px 20px !important;
	line-height: 26px !important;
}
.el-carousel__arrow {
	text-align: center !important;
}
.el-carousel__arrow i {
	margin-left: auto !important;
	margin-right: auto !important;
}
.app-disk-space-progress .el-progress__text {
	font-size: 14px !important;
}
.app-call-chart .el-radio-group label {
	flex: unset;
}
.app-call-chart .el-radio-button__inner {
	border: 0 !important;
	padding: 6px 10px !important;
}
.app-call-chart .el-radio-button__orig-radio:checked + .el-radio-button__inner {
	border-radius: 50px !important;
}
.app-call-chart .el-radio-button:first-child .el-radio-button__inner {
	border-radius: 8px 0 0 8px;
}
.app-call-chart .el-radio-button:last-child .el-radio-button__inner {
	border-radius: 0 8px 8px 0;
}
</style>
