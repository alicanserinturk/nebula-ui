<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<!--<div class="row mb-3 ">
            <div class="col-auto">
                <el-radio-group>
                    <el-radio-button>Haha</el-radio-button>
                    <el-radio-button>Haha</el-radio-button>
                </el-radio-group>
            </div>
            <div class="col-auto">
                
            </div>
        </div>-->
			<div class="row row-xs app-table-filter-bar mb-3">
				<div class="col-auto">
					<div class="app-module-toolbar bg-white pb-0 pt-0 position-relative">
						<el-radio-group v-model="filter.direction" size="mini">
							<el-radio-button label="in">Gelen Arama</el-radio-button>
							<el-radio-button label="out">Giden Arama</el-radio-button>
						</el-radio-group>
					</div>
				</div>
				<div class="col-auto">
					<div
						class="app-module-toolbar no-padding bg-white pb-0 pt-0 position-relative p-0"
					>
						<app-form-number-select
							v-model="filter.number_id"
						></app-form-number-select>
					</div>
				</div>
				<div class="col-auto">
					<div
						class="app-module-toolbar no-padding bg-white pb-0 pt-0 position-relative"
					>
						<app-form-user-select
							v-model="filter.user_id"
						></app-form-user-select>
					</div>
				</div>
				<div class="col-auto">
					<div
						class="app-module-toolbar no-padding bg-white pb-0 pt-0 position-relative"
					>
						<el-date-picker
						v-model="filter.start_at"
						type="daterange"
						size="medium"
						start-placeholder="Başlangıç"
						end-placeholder="Bitiş">
						</el-date-picker>
					</div>
				</div>
			</div>

			<app-card :remove-body-padding="true">
				<template slot="header">
					<div class="row row-xs app-table-filter-bar">
						<div class="col-auto">
							<h5 class="mb-0 mt-1">Grafik</h5>
						</div>
					</div>
				</template>
				<div class="row b-b">
					<div class="col-md-4 b-r pt-4 pb-4 text-center">
						<h3 style="font-weight:500" class="mb-1">
							<ion-icon
								style="font-size:20px"
								name="thumbs-up-outline"
							></ion-icon>
							{{ getSuccessCount }}
						</h3>
						<small class="d-block text-muted" style="font-weight:500"
							>Başarılı</small
						>
					</div>
					<div class="col-md-4 b-r pt-4 pb-4 text-center">
						<h3 style="font-weight:500" class="mb-1">
							<ion-icon
								style="font-size:20px"
								name="thumbs-down-outline"
							></ion-icon>
							{{ getFailedCount }}
						</h3>
						<small class="d-block text-muted" style="font-weight:500"
							>Başarısız</small
						>
					</div>
					<div class="col-md-4 b-r pt-4 pb-4 text-center">
						<h3 style="font-weight:500" class="mb-1">
							<ion-icon
								style="font-size:20px"
								name="bookmark-outline"
							></ion-icon>
							{{ getOtherCount }}
						</h3>
						<small class="d-block text-muted" style="font-weight:500"
							>Diğer</small
						>
					</div>
				</div>
				<div class="pt-2">
					<VueApexCharts
						v-if="chartVisible"
						type="bar"
						height="350"
						:options="chartOptions"
						:series="series"
					></VueApexCharts>
				</div>
			</app-card>
		</app-module-body>
	</app-module>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import moment from "moment";

export default {
	components: {
		VueApexCharts,
	},
	data() {
		return {
            loading: false,
			filter: {
				direction: "in",
				user_id: null,
				number_id: null,
				start_at: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
			},
			data: [],
			chartVisible: false,
			series: [
				{
					data: [],
				},
			],
			chartOptions: {
				chart: {
					height: 350,
					type: "bar",
					events: {
						click: function(chart, w, e) {
							// console.log(chart, w, e)
						},
					},
				},
				plotOptions: {
					bar: {
						borderRadius: 6,
						columnWidth: "45%",
						distributed: true,
					},
				},
				dataLabels: {
					enabled: false,
				},
				legend: {
					show: false,
				},
				xaxis: {
					categories: [],
					labels: {
						style: {
							fontSize: "12px",
						},
					},
				},
			},
		};
	},
	computed: {
		getSuccessCount() {
			let count = 0;
			if (this.data.evaluation_code) {
				this.data.evaluation_code.forEach((item) => {
					if (item.is_success === true) count = item.count;
				});
			}
			return count;
		},
		getFailedCount() {
			let count = 0;
			if (this.data.evaluation_code) {
				this.data.evaluation_code.forEach((item) => {
					if (item.is_success === false) count = item.count;
				});
			}
			return count;
		},
		getOtherCount() {
			let count = 0;
			if (this.data.evaluation_code) {
				this.data.evaluation_code.forEach((item) => {
					if (item.is_success === null) count = item.count;
				});
			}
			return count;
		},
	},
	created() {
		this.getData();
	},
	methods: {
		getData() {
            this.loading = true;
            this.chartVisible = false;
			this.$api.get("reports/result-code-analysis", this.filter, (response) => {
				this.data = response.data.data;
				this.series[0].data = [];
				this.chartOptions.xaxis.categories = [];
				this.data.result_code.forEach((item) => {
					this.series[0].data.push(item.count);
					this.chartOptions.xaxis.categories.push([
						item.name ? item.name : "Sonlandırılmadı",
						item.count + " Çağrı",
					]);
				});
				this.chartVisible = true;
                this.loading = false;
			});
		},
	},
	watch: {
		filter: {
			deep: true,
			handler() {
				this.getData();
			},
		},
	},
};
</script>
<style>
.app-module-toolbar .el-radio-button:first-child .el-radio-button__inner {
	box-shadow: none !important;
}

.app-table-filter-bar .app-module-toolbar .el-radio-button__inner {
	box-shadow: none !important;
	border: 0;
	border-radius: 8px !important;
}
.app-table-filter-bar .app-module-toolbar {
	border-radius: 10px;
	padding: 5px;
	box-sizing: border-box !important;
	margin: 0;
	box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.05);
}
.app-table-filter-bar .app-module-toolbar > * {
	padding: 5px 0;
}
.app-table-filter-bar .app-module-toolbar.no-padding > * {
	padding: 0 !important;
}
</style>
