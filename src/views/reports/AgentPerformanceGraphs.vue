<template>
	<div class="px-1">
		<template
			v-if="
				(data.calls && data.calls.inbound) ||
					(data.calls && data.calls.outbound) ||
					(data.states && data.states.length > 0)
			"
		>
			<div v-if="data.calls && data.calls.inbound" class="pb-3">
				<h6 class="mb-3 font-weight-bold">
					Gelen Arama
					<small class="ml-2 d-inline-block font-weight-300"
						>Ort:
						<span v-if="data.calls.inbound.avg_talking_time">{{
							data.calls.inbound.avg_talking_time.split(".")[0]
						}}</span></small
					>
				</h6>
				<div class="row no-gutters">
					<div class="col-6">
						<div class="row mb-3">
							<div class="col-6">
								<app-label label="Toplam Çağrı"
									><ion-icon class="mr-1" name="call-outline"></ion-icon
									>{{ data.calls.inbound.count_talking }}</app-label
								>
							</div>
							<div class="col-6">
								<app-label label="Cevapsız Çağrı"
									><ion-icon
										class="mr-1"
										name="close-circle-outline"
									></ion-icon>
									{{ data.no_answer.inbound }}</app-label
								>
							</div>
						</div>
						<div class="row mb-3">
							<div class="col">
								<app-label label="Ortalama Çalma"
									><ion-icon
										class="mr-1"
										name="musical-note-outline"
									></ion-icon>
									<span v-if="data.calls.inbound.avg_ringing_time">{{
										data.calls.inbound.avg_ringing_time.split(".")[0]
									}}</span></app-label
								>
							</div>
							<div class="col">
								<app-label label="Toplam Çalma">
									<ion-icon class="mr-1" name="musical-note-outline"></ion-icon
									>{{ data.calls.inbound.ringing_time }}</app-label
								>
							</div>
						</div>
						<div class="row row-sm">
							<div class="col">
								<app-label label="En Kısa Konuşma"
									><ion-icon class="mr-1" name="mic-outline"></ion-icon>
									{{ data.calls.inbound.min_talking_time }}</app-label
								>
							</div>
							<div class="col">
								<app-label label="En Uzun Konuşma"
									><ion-icon class="mr-1" name="mic-outline"></ion-icon>
									{{ data.calls.inbound.max_talking_time }}</app-label
								>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="mb-3">
							<app-label label="Verimlilik Durumu">
								<div class="app-progress-detail border reverse w-100">
									<div class="app-progress-detail-label">
										<small class="text-muted"
											>Toplam: {{ stateTimeByKey("inbound", data) }}</small
										>
									</div>
								</div>

								<div class="app-progress-custom">
									<div
										class="app-progress-part bg-success first"
										:style="
											'width:' +
												getPercent(
													data.calls.inbound.talking_time,
													stateTimeByKey('inbound', data)
												) +
												'%'
										"
									>
										<el-tooltip
											:content="'Konuşma: ' + data.calls.inbound.talking_time"
											placement="top"
										>
											<span class="d-block w-100"
												>%{{
													getPercent(
														data.calls.inbound.talking_time,
														stateTimeByKey("inbound", data)
													)
												}}</span
											>
										</el-tooltip>
									</div>
									<div
										class="app-progress-part bg-primary second"
										:style="
											'width:' +
												getPercent(
													data.calls.inbound.ringing_time,
													stateTimeByKey('inbound', data)
												) +
												'%'
										"
									>
										<el-tooltip
											:content="'Çalma: ' + data.calls.inbound.ringing_time"
											placement="top"
										>
											<span class="d-block w-100"
												>%{{
													getPercent(
														data.calls.inbound.ringing_time,
														stateTimeByKey("inbound", data)
													)
												}}</span
											>
										</el-tooltip>
									</div>
									<div
										class="app-progress-part bg-light third"
										:style="
											'width:' +
												getPercent(
													getAvailTime(
														stateTimeByKey('inbound', data),
														data.calls.inbound.talking_time,
														data.calls.inbound.ringing_time
													),
													stateTimeByKey('inbound', data)
												) +
												'%'
										"
									>
										<el-tooltip content="03:43:12" placement="top">
											<span class="d-block w-100"
												>%{{
													getPercent(
														getAvailTime(
															stateTimeByKey("inbound", data),
															data.calls.inbound.talking_time,
															data.calls.inbound.ringing_time
														),
														stateTimeByKey("inbound", data)
													)
												}}</span
											>
										</el-tooltip>
									</div>
								</div>
								<div class="app-progress-detail border" :style="'min-width:8%;width:'+parseInt((f.dateToMilliseconds(data.calls.inbound.talking_time) + f.dateToMilliseconds(data.calls.inbound.ringing_time ? data.calls.inbound.ringing_time : '00:00:00')) / f.dateToMilliseconds(stateTimeByKey('inbound', data)) * 100).toString()+'%'">
									<div class="app-progress-detail-label px-3 text-center">
										<small class="text-muted">{{f.millisecondToDate(f.dateToMilliseconds(data.calls.inbound.talking_time) + f.dateToMilliseconds(data.calls.inbound.ringing_time ? data.calls.inbound.ringing_time : '00:00:00'))}}</small>
									</div>
								</div>
							</app-label>
							<app-label label="Özet">
								<small class="d-block mt-2 text-muted"
									>Giden arama durumunda
									<strong class="text-primary">{{
										stateTimeByKey("inbound", data)
									}}</strong>
									vakit geçirildi ve
									<strong class="text-primary">{{
										data.calls.inbound.talking_time
									}}</strong>
									konuşuldu ancak
									<strong class="text-primary">{{
										getAvailTime(
											stateTimeByKey("inbound", data),
											data.calls.inbound.talking_time,
											data.calls.inbound.ringing_time
										)
									}}</strong>
									boşta beklendi.</small
								>
							</app-label>
						</div>
					</div>
				</div>
			</div>

			<div v-if="data.calls && data.calls.outbound" class="pb-4 b-b pt-2">
				<h6 class="mb-3 font-weight-bold">
					Giden Arama
					<small class="ml-2 d-inline-block font-weight-300"
						>Ort:
						<span v-if="data.calls.outbound.avg_talking_time">{{
							data.calls.outbound.avg_talking_time.split(".")[0]
						}}</span></small
					>
				</h6>
				<div class="row no-gutters">
					<div class="col-6">
						<div class="row mb-3">
							<div class="col-6">
								<app-label label="Toplam Çağrı"
									><ion-icon class="mr-1" name="call-outline"></ion-icon
									>{{ data.calls.outbound.count_talking }}</app-label
								>
							</div>
							<div class="col-6">
								<app-label label="Cevapsız Çağrı"
									><ion-icon
										class="mr-1"
										name="close-circle-outline"
									></ion-icon>
									{{ data.no_answer.outbound }}</app-label
								>
							</div>
						</div>
						<div class="row mb-3">
							<div class="col">
								<app-label label="Ortalama Çalma"
									><ion-icon
										class="mr-1"
										name="musical-note-outline"
									></ion-icon>
									<span v-if="data.calls.outbound.avg_ringing_time">{{
										data.calls.outbound.avg_ringing_time.split(".")[0]
									}}</span></app-label
								>
							</div>
							<div class="col">
								<app-label label="Toplam Çalma">
									<ion-icon class="mr-1" name="musical-note-outline"></ion-icon
									>{{ data.calls.outbound.ringing_time }}</app-label
								>
							</div>
						</div>
						<div class="row row-sm">
							<div class="col">
								<app-label label="En Kısa Konuşma"
									><ion-icon class="mr-1" name="mic-outline"></ion-icon>
									{{ data.calls.outbound.min_talking_time }}</app-label
								>
							</div>
							<div class="col">
								<app-label label="En Uzun Konuşma"
									><ion-icon class="mr-1" name="mic-outline"></ion-icon>
									{{ data.calls.outbound.max_talking_time }}</app-label
								>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="mb-3">
							<app-label label="Verimlilik Durumu">
								<div class="app-progress-detail border reverse w-100">
									<div class="app-progress-detail-label">
										<small class="text-muted"
											>Toplam: {{ stateTimeByKey("outbound", data) }}</small
										>
									</div>
								</div>

								<div class="app-progress-custom">
									<div
										class="app-progress-part bg-success first"
										:style="
											'width:' +
												getPercent(
													data.calls.outbound.talking_time,
													stateTimeByKey('outbound', data)
												) +
												'%'
										"
									>
										<el-tooltip
											:content="'Konuşma: ' + data.calls.outbound.talking_time"
											placement="top"
										>
											<span class="d-block w-100"
												>%{{
													getPercent(
														data.calls.outbound.talking_time,
														stateTimeByKey("outbound", data)
													)
												}}</span
											>
										</el-tooltip>
									</div>
									<div
										class="app-progress-part bg-primary second"
										:style="
											'width:' +
												getPercent(
													data.calls.outbound.ringing_time,
													stateTimeByKey('outbound', data)
												) +
												'%'
										"
									>
										<el-tooltip
											:content="'Çalma: ' + data.calls.outbound.ringing_time"
											placement="top"
										>
											<span class="d-block w-100"
												>%{{
													getPercent(
														data.calls.outbound.ringing_time,
														stateTimeByKey("outbound", data)
													)
												}}</span
											>
										</el-tooltip>
									</div>
									<div
										class="app-progress-part bg-light third"
										:style="
											'width:' +
												getPercent(
													getAvailTime(
														stateTimeByKey('outbound', data),
														data.calls.outbound.talking_time,
														data.calls.outbound.ringing_time
													),
													stateTimeByKey('outbound', data)
												) +
												'%'
										"
									>
										<el-tooltip content="03:43:12" placement="top">
											<span class="d-block w-100"
												>%{{
													getPercent(
														getAvailTime(
															stateTimeByKey("outbound", data),
															data.calls.outbound.talking_time,
															data.calls.outbound.ringing_time
														),
														stateTimeByKey("outbound", data)
													)
												}}</span
											>
										</el-tooltip>
									</div>
								</div>
								<div class="app-progress-detail border" :style="'min-width:8%;width:'+parseInt((f.dateToMilliseconds(data.calls.outbound.talking_time) + f.dateToMilliseconds(data.calls.outbound.ringing_time ? data.calls.outbound.ringing_time : '00:00:00')) / f.dateToMilliseconds(stateTimeByKey('outbound', data)) * 100).toString()+'%'">
									<div class="app-progress-detail-label px-3 text-center">
										<small class="text-muted">{{f.millisecondToDate(f.dateToMilliseconds(data.calls.outbound.talking_time) + f.dateToMilliseconds(data.calls.outbound.ringing_time ? data.calls.outbound.ringing_time : '00:00:00'))}}</small>
									</div>
								</div>
							</app-label>
							<app-label label="Özet">
								<small class="d-block mt-2 text-muted"
									>Giden arama durumunda
									<strong class="text-primary">{{
										stateTimeByKey("outbound", data)
									}}</strong>
									vakit geçirildi ve
									<strong class="text-primary">{{
										data.calls.outbound.talking_time
									}}</strong>
									konuşuldu ancak
									<strong class="text-primary">{{
										getAvailTime(
											stateTimeByKey("outbound", data),
											data.calls.outbound.talking_time,
											data.calls.outbound.ringing_time
										)
									}}</strong>
									boşta beklendi.</small
								>
							</app-label>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-3">
				<h6 class="mb-3 font-weight-bold mt-2">
					Durumlar
				</h6>
				<div class="row">
					<div class="col">
						<app-label label="Durum Süreleri">
							<div
								class="row mt-4"
								v-if="data.states && data.states.length > 0"
							>
								<div class="col-lg-4 col-6 mb-2" v-for="item in data.states">
									<div class="d-flex align-items-center i-con-h-a my-1">
										<div>
											<span class="avatar w-40 b-a b-2x">
												<template v-if="item.key == 'inbound'">
													<ion-icon name="call" class="text-success"></ion-icon>
													<ion-icon
														name="arrow-undo"
														class="text-success"
														style="font-size:12px;position:absolute; top:6px; right:7px;"
													></ion-icon>
												</template>
												<template v-else-if="item.key == 'outbound'">
													<ion-icon name="call" class="text-success"></ion-icon>
													<ion-icon
														name="arrow-redo"
														class="text-success"
														style="font-size:12px;position:absolute; top:6px; right:7px;"
													></ion-icon>
												</template>
												<template v-else>
													<ion-icon
														class="text-warning"
														name="hourglass"
													></ion-icon>
												</template>
											</span>
										</div>
										<div class="mx-3">
											<span class="d-block ajax"
												><strong>{{ item.time }}</strong></span
											>
											<small class="text-muted">{{ item.name }}</small>
										</div>
									</div>
								</div>
							</div>
							<div class="row" v-else>
								<div class="col">
									Herhangi bir durum süresi bulunamadı.
								</div>
							</div>
						</app-label>
					</div>
					<div class="col-3">
						<app-label label="Grafik">
							<VueApexCharts
								v-if="data.states && data.states.length > 0"
								type="donut"
								:options="getChartOptions(data.states)"
								:series="getChartSeries(data.states)"
							></VueApexCharts>
						</app-label>
					</div>
				</div>
			</div>
		</template>
		<template v-else>
			<div class="text-center">
				<app-svg
					class="col-2 mx-auto"
					src="/assets/img/vectors/statistics.svg"
				></app-svg>
				<h6 class="font-weight-bold">Herhangi bir etkinlik bulunmuyor</h6>
				<span
					>Hatta girdikçe ve arama yaptıkça bu alanda vakit geçirilen hat
					durumlarının detaylarını ve çağrılarla ilgili istatistikleri
					görüntüleyebilirsiniz.</span
				>
			</div>
		</template>
	</div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import moment from "moment";
import formatter from "../../utils/Formatters";
import { mapGetters } from "vuex";

export default {
	components: {
		VueApexCharts,
	},
	props: {
		data: {
			required: true,
		},
		row: {
			required: false,
		},
	},
	data() {
		return {
			items: [],
			chart: {
				series: [],
				chartOptions: {
					labels: [],
					//colors: [],
					dataLabels: {
						enabled: false,
					},
					legend: {
						show: false,
					},
					chart: {
						type: "donut",
						width: "100%",
					},
					yaxis: {
						labels: {},
					},
					plotOptions: {
						stroke: {
							colors: undefined,
						},
						pie: {
							lineCap: "round",
							customScale: 1,
							donut: {
								size: "88%",
								labels: {
									show: true,
									formatter: function(value) {
										return formatter.millisecondToDate(value);
									},
									name: {
										show: false,
									},
									value: {
										show: true,
										formatter: function(value) {
											return formatter.millisecondToDate(value);
										},
									},
								},
							},
						},
					},
					responsive: [
						{
							breakpoint: 480,
							options: {
								chart: {
									width: 200,
								},
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},
			},
		};
	},
	computed: {
		f(){
			return formatter;
		}
	},
	created() {},
	methods: {
		getPercent(size, total) {
			return (
				formatter.dateToMilliseconds(size) /
				(formatter.dateToMilliseconds(total) / 100)
			).toFixed(1);
		},
		getAvailTime(total, talking, ringing) {
			total = formatter.dateToMilliseconds(total);
			talking = formatter.dateToMilliseconds(talking);
			ringing = ringing ? formatter.dateToMilliseconds(ringing) : 0;
			return formatter.millisecondToDate(Math.max(0, total - talking - ringing));
		},
		stateTimeByKey(key, row) {
			let time = false;
			row.states.forEach((item) => {
				if (item.key === key) time = item.time;
			});
			return time;
		},
		getChartOptions(states) {
			let options = { ...this.chart.chartOptions };
			options.labels = [];
			states.forEach((element) => {
				options.labels.push(element.name);
			});
			return options;
		},
		getChartSeries(states) {
			let series = [];
			states.forEach((element) => {
				series.push(formatter.dateToMilliseconds(element.time));
			});
			return series;
		},
	},
};
</script>
<style>
.app-progress-custom {
	width: 100%;
	border-radius: 200px;
	background: #eaeaea;
	margin-bottom: 10px;
	overflow: hidden;
	height: 24px;
}
.app-progress-part {
	min-width: 40px !important;
	display: inline-block;
	height: 24px;
	line-height: 24px;
	padding: 0 10px;
	font-size: 10px;
	text-align: center;
}

.app-progress-detail {
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
	border-top: 0 !important;
	height: 15px;
	position: relative;
	display: block;
	margin-bottom: 30px;
	border-color: #dadada !important;
}
.app-progress-detail-label {
	bottom: -25px;
	display: block;
	position: absolute;
	left: calc(50% - 30px);
}
.app-progress-detail.reverse {
	margin-bottom: 15px;
	margin-top: 30px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	border-top: 1px solid #dadada !important;
	border-bottom: 0 !important;
}
.app-progress-detail.reverse .app-progress-detail-label {
	bottom: 0;
	top: -25px;
	left: calc(50% - 50px);
}
</style>
