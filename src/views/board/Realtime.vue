<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card :remove-body-padding="true">
						<div class="px-4 pt-3 row">
							<div class="col">
								<strong class="text-label text-muted">Kullanıcılar</strong>
							</div>
							<div class="col-auto app-call-chart">
								<el-radio-group size="mini" v-model="showActiveUsers">
									<el-radio-button :label="true">Çevrim İçi</el-radio-button>
									<el-radio-button :label="false">Çevrim Dışı</el-radio-button>
								</el-radio-group>
							</div>
						</div>
						<div v-if="loading.users" class="card-body p-3 text-center">
							<small>Yükleniyor...</small>
						</div>
						<div v-else class="card-body p-0">
							<div class="px-4 pt-3 pb-1">
								<div class="row row-sm" v-if="showActiveUsers">
									<div v-for="(item, index) in agentStatuses" class="col" :key="'agent-' + index">
										<div class="d-flex bg-light r-3x p-3 pointer">
											<span class="w-48 avatar bg-white b-a i-con-h-a"
												><h5 class="mb-0">
													<ion-icon
														:name="item.icon"
														class=" b-2x"
														:class="item.class"
													></ion-icon></h5
											></span>
											<div class="mx-3 ">
												<div>
													<strong style="font-size:20px;">{{
														getStatusUsers(item.key).length
													}}</strong
													><span class="ml-1 text-muted "
														>%<span
															v-if="
																getStatusUsers(item.key).length !== 0 &&
																	getOnlineUsers().length !== 0
															"
															>{{
																(
																	(getStatusUsers(item.key).length /
																		getOnlineUsers().length) *
																	100
																).toFixed(0)
															}}</span
														><span v-else>0</span></span
													>
												</div>
												<small class="text-muted -50">{{ item.label }}</small>
											</div>
										</div>

										<!--  <div class="d-block" :class="item.class" style="position:absolute; bottom:1rem; left:1rem; right: 1rem; border-radius: 18px; height: 5px;"></div>
                  --></div>
								</div>
							</div>
							<div class="app-simple-table" v-if="showActiveUsers">
								<el-table :data="getOnlineUsers()" style="width: 100%">
									<el-table-column width="60" fixed="left">
										<template slot-scope="scope">
											<span
												v-if="scope.row.user"
												class="w-36 avatar circle bg-light"
												>{{ scope.row.user.name[0]
												}}{{ scope.row.user.surname[0] }}</span
											>
										</template>
									</el-table-column>
									<el-table-column width="240" label="Kullanıcı" fixed="left">
										<template slot-scope="scope">
											<span class="d-block" v-if="scope.row.user"
												>{{ scope.row.user.name }}
												{{ scope.row.user.surname }}</span
											>
											<small class="sub-item text-muted">{{
												scope.row.user.email
											}}</small>
										</template>
									</el-table-column>
									<el-table-column fixed="right" align="right">
										<template slot-scope="scope">
											<span
												class="badge badge-lg badge-pill text-dark"
												:class="{
													'bg-danger-lt text-danger':
														scope.row.call_status === 'avail' ||
														(scope.row.state &&
															scope.row.state.name &&
															!scope.row.call_status),
													'bg-warning-lt text-warning':
														scope.row.call_status === 'break',
													'bg-success-lt text-success':
														scope.row.call_status === 'in_call',
													'bg-primary-lt text-primary':
														scope.row.call_status === 'ringing',
													'badge-light':
														!scope.row.state || !scope.row.state.name,
												}"
											>
												<span>
													<span
														v-if="scope.row.state && scope.row.state.name"
														>{{ scope.row.state.name }}</span
													>
													<span
														v-else="
															!scope.row.call_status ||
																(!scope.row.state.name && scope.row.call_status)
														"
														>Hatta Değil</span
													>
												</span>
												<span
													v-if="
														scope.row.call_status ||
															(scope.row.state &&
																scope.row.state.name &&
																!scope.row.call_status)
													"
												>
													&bull;
													<ion-icon
														:name="getStatusByKey(scope.row.call_status).icon"
													></ion-icon>
													{{ getStatusByKey(scope.row.call_status).label }}
												</span>
												<span v-if="scope.row.started_at">
													&bull;
													<app-date-range-text
														:start-date="scope.row.started_at"
														:end-date="now.toString()"
													></app-date-range-text>
												</span>
												<span v-else>&bull; Bir süredir</span>
											</span>
											<!--<span v-if="
														scope.row.call_status ||
															(scope.row.state &&
																scope.row.state.name &&
																!scope.row.call_status)
													"
												class="badge badge-lg badge-pill badge-light">
												<span
													
												>
													<ion-icon
														:name="getStatusByKey(scope.row.call_status).icon"
													></ion-icon> {{getStatusByKey(scope.row.call_status).label}}
												</span>
											</span>
											<span
												class="badge badge-lg badge-pill badge-light">
												<span v-if="scope.row.started_at">
													<app-date-range-text
														:start-date="scope.row.started_at"
														:end-date="now.toString()"
													></app-date-range-text>
												</span>
												<span v-else>&bull; Bir süredir</span>
											</span>-->
										</template>
									</el-table-column>
								</el-table>
							</div>
							<div class="app-simple-table" v-else>
								<el-table :data="offlineUsersCache" style="width: 100%">
									<el-table-column width="60">
										<template slot-scope="scope">
											<span
												v-if="scope.row.user"
												class="w-36 avatar circle bg-light"
												>{{ scope.row.user.name[0]
												}}{{ scope.row.user.surname[0] }}</span
											>
										</template>
									</el-table-column>
									<el-table-column label="Kullanıcı">
										<template slot-scope="scope">
											<span class="d-block" v-if="scope.row.user"
												>{{ scope.row.user.name }}
												{{ scope.row.user.surname }}</span
											>
											<small class="sub-item text-muted">{{
												scope.row.user.email
											}}</small>
										</template>
									</el-table-column>
									<el-table-column label="Son Görülme" align="right">
										<template slot-scope="scope">
											<span class="badge badge-light badge-md badge-pill">
												Çevrimdışı &bull;
												<app-date-text
													:text="scope.row.started_at"
												></app-date-text>
											</span>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
					</app-card>

					<div class="card card-calls" ref="calls">
						<div class="px-4 pt-3 row">
							<div class="col">
								<span class="text-label text-muted">Çağrılar</span>
							</div>
							<div class="col-auto app-call-chart">
								<el-radio-group size="mini" v-model="filter.call.direction">
									<el-radio-button :label="null">Tümü</el-radio-button>
									<el-radio-button label="in">Gelen</el-radio-button>
									<el-radio-button label="out">Giden</el-radio-button>
								</el-radio-group>
							</div>
						</div>
						<div v-if="loading.calls" class="card-body p-4 text-center">
							<small>Yükleniyor...</small>
						</div>
						<div
							v-else-if="calls.length === 0"
							class="card-body p-4 text-center"
						>
							<div class="text-center">
								<app-svg
									class="col-2 mx-auto"
									src="/assets/img/vectors/board-calls.svg"
								></app-svg>
								<h6 class="font-weight-bold">Aktif arama bulunmuyor</h6>
								<span
									>Herhangi bir aktif arama bulunduğunda bu alan
									görüntüleyebileceksiniz.</span
								>
							</div>
						</div>
						<div v-else class="app-simple-table">
							<div class="px-2 pt-3 pb-2 b-b">
								<el-popover
									v-for="(number, index) in numbers"
									:key="'number-' + index"
									placement="top"
									width="260"
									trigger="hover"
								>
									<div>
										<h6 class="mb-1 font-weight-bold">
											{{ number.name }}
										</h6>
										<div class="row row-xs pt-2 pb-3">
											<div class="col">
												<span
													class="text-success badge bg-light badge-lg badge-pill"
													:class="{
														'text-muted': number.in_call.length === 0,
													}"
													><ion-icon class="" name="call-outline"></ion-icon>
													{{ number.in_call.length }}</span
												>
											</div>
											<div class="col">
												<span
													class=" text-primary badge bg-light badge-lg badge-pill"
													:class="{
														'text-muted':
															number.ringing.length + number.calling.length ===
															0,
													}"
													><ion-icon
														class=""
														name="musical-note-outline"
													></ion-icon>
													{{
														number.ringing.length + number.calling.length
													}}</span
												>
											</div>
											<div class="col">
												<span
													class=" text-danger badge bg-light badge-lg badge-pill"
													:class="{ 'text-muted': number.queue.length === 0 }"
													><ion-icon
														class=""
														name="hourglass-outline"
													></ion-icon>
													{{ number.queue.length }}</span
												>
											</div>
											<div class="col">
												<span
													class=" badge bg-light badge-lg badge-pill"
													:class="{ 'text-muted': number.ivr.length === 0 }"
													><ion-icon class="" name="keypad-outline"></ion-icon>
													{{ number.ivr.length }}</span
												>
											</div>
										</div>
										<div>
											<el-progress
												:format="progressFormat"
												:text-inside="true"
												:stroke-width="18"
												color="#FE4D62"
												:percentage="
													Math.ceil(
														(number.queue.length / number.calls.length) * 100
													)
														? Math.ceil(
																(number.queue.length / number.calls.length) *
																	100
														  )
														: 0
												"
											></el-progress>
										</div>
									</div>
									<span
										slot="reference"
										class="badge mb-2 badge-pill ml-2 bg-light px-3 py-2"
									>
										<el-checkbox v-model="number.checked" size="mini" label="1"
											>{{ number.name }}
											<span
												class="badge badge-md bg-white badge-pill"
												v-if="number.calls.length !== 0"
												>{{ number.calls.length }}</span
											></el-checkbox
										>
									</span>
								</el-popover>
							</div>
							
							<div class="pr-4 pl-4 pt-4 pb-0">
								<div class="row row-sm" v-if="showActiveUsers">
									<div v-for="(item, key) in callStatuses" class="col" :key="'call-status-' + key" :class="{'text-left': key === 0,'text-center': key === 1 || key === 2,'text-right': key === 3,}">
										<div class=" bg-white r-3x pointer">
											<div class="d-inline-block">
												<span class="w-48  avatar bg-white text-center b-a i-con-h-a"
												><h3 class="mb-0">
													<ion-icon
														:name="item.icon"
														class=" b-2x"
														:class="item.class"
													></ion-icon></h3
											></span>
											</div>
											<div class="mx-3 d-inline-block">
												<div>
													<strong style="font-size:20px;">{{chart.series[0].data[key]}}</strong
													>
												</div>
												<small class="text-muted -50">{{ item.label }}</small>
											</div>
										</div>
									</div>
								</div>

							</div>
							<div class="pl-1 pr-4 py-1" v-if="chart.visible">
							
								<apexchart
									height="240"
									:options="chart.chartOptions"
									:series="chart.series"
								></apexchart>
								
							</div>
							
							<el-table :data="filteredCalls()" style="width: 100%">
								<el-table-column width="60">
									<template slot-scope="scope">
										<span class="w-36 avatar bg-light circle">
											<ion-icon
												style="font-size:18px"
												name="call"
												class="text-muted"
											></ion-icon>
											<ion-icon
												:name="
													scope.row.direction === 'out'
														? 'arrow-redo'
														: 'arrow-undo'
												"
												class="text-muted"
												style="font-size:12px;position:absolute; top:6px; right:7px;"
											></ion-icon
										></span>
									</template>
								</el-table-column>
								<el-table-column label="Çağrı Detayları">
									<template slot-scope="scope">
										<span v-if="scope.row.direction === 'in'">{{
											scope.row.from
										}}</span>
										<span v-else>{{ scope.row.to }}</span>
										<small class="sub-item text-muted">
											<span v-if="scope.row.direction === 'in'">Gelen</span>
											<span v-else>Giden</span>
											<span
												class="ml-2"
												v-if="scope.row.user && scope.row.user.name"
												><ion-icon name="person-outline" class="mr-1"></ion-icon
												>{{ scope.row.user.name }}
												{{ scope.row.user.surname }}</span
											>
											<span
												class="ml-2"
												v-if="scope.row.queue && scope.row.queue.name"
												><ion-icon name="people-outline" class="mr-1"></ion-icon
												>{{ scope.row.queue.name }}</span
											>
											<span class="ml-2" v-if="scope.row.number"
												><ion-icon
													name="cellular-outline"
													class="mr-1"
												></ion-icon
												>{{ scope.row.number.name }}</span
											>
										</small>
									</template>
								</el-table-column>
								<el-table-column fixed="right" align="right" label="Durum">
									<template slot-scope="scope">
										<span
											v-if="scope.row.current_state === 'ivr'"
											class="badge badge-md badge-pill badge-light"
											>IVR &bull;
											<app-date-range-text
												:start-date="scope.row.started_at"
												:end-date="now.toString()"
											></app-date-range-text
										></span>
										<span
											v-else-if="scope.row.current_state === 'ringing'"
											class="badge badge-md badge-pill bg-primary-lt"
											>Çalıyor &bull;
											<app-date-range-text
												:start-date="scope.row.started_at"
												:end-date="now.toString()"
											></app-date-range-text
										></span>
										<span
											v-else-if="scope.row.current_state === 'calling'"
											class="badge badge-md badge-pill bg-primary-lt"
											>Aranıyor &bull;
											<app-date-range-text
												:start-date="scope.row.started_at"
												:end-date="now.toString()"
											></app-date-range-text
										></span>
										<span
											v-else-if="scope.row.current_state === 'in_call'"
											class="badge badge-md badge-pill bg-success-lt"
											>Çağrıda &bull;
											<app-date-range-text
												:start-date="scope.row.started_at"
												:end-date="now.toString()"
											></app-date-range-text
										></span>
										<span
											v-else-if="scope.row.current_state === 'hangup'"
											class="badge badge-md badge-pill bg-danger-lt "
											>Sonlandı &bull;
											<app-date-range-text
												:start-date="scope.row.started_at"
												:end-date="now.toString()"
											></app-date-range-text
										></span>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
			<!-- <div class="col-md-auto">
           <app-card>
               <p><strong>Çağrı Kalitesi</strong></p>
               <el-progress type="dashboard" :percentage="percentage" :color="colors" status="success"></el-progress>
           </app-card>
       </div>-->
		</app-module-body>
	</app-module>
</template>
<script>
import { mapGetters } from "vuex";
import formatter from "../../utils/Formatters";
import VueApexCharts from "vue-apexcharts";

export default {
	components: {
		apexchart: VueApexCharts,
	},
	data() {
		return {
			chart: {
				visible: false,
				series: [
					{
						name: "Data",
						data: [0, 0, 0, 0],
					},
				],
				chartOptions: {
					grid: {
						show: false,
					},
					chart: {
						height: 150,
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
						categories: ["Çağrıda", "Çalıyor", "IVR", "Kuyruk"],
						labels: {
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
			numbers: [],
			filter: {
				call: {
					direction: null,
				},
			},
			activeTab: "online",
			loading: {
				users: false,
				calls: false,
			},
			percentage: 40,
			colors: [
				{ color: "#F44336", percentage: 25 },
				{ color: "#FFC107", percentage: 50 },
				{ color: "#2196F3", percentage: 75 },
				{ color: "#4CAF50", percentage: 100 },
			],
			agentStatuses: [
				{
					key: "in_call",
					count: 14,
					icon: "call",
					label: "Çağrıda",
					class: "text-success",
				},
				{
					key: "ringing",
					count: 1,
					icon: "musical-note",
					label: "Ringing",
					class: "text-primary",
				},
				{
					key: "break",
					count: 2,
					icon: "pause",
					label: "Mola",
					class: "text-warning",
				},
				{
					key: "avail",
					count: 3,
					icon: "time",
					label: "Beklemede",
					class: "text-danger",
				},
				{
					key: null,
					count: 3,
					icon: "close",
					label: "Hatta Değil",
					class: "text-light",
				},
			],
			callStatuses: [
				{
					key: "in_call",
					count: 14,
					icon: "call",
					label: "Çağrıda",
					class: "text-success",
				},
				{
					key: "ringing",
					count: 1,
					icon: "musical-note",
					label: "Ringing",
					class: "text-primary",
				},
				{
					key: "ivr",
					count: 2,
					icon: "people",
					label: "Kuyruk",
					class: "text-warning",
				},
				{
					key: "queue",
					count: 3,
					icon: "cellular",
					label: "IVR",
					class: "text-danger",
				},
			],

			calls: [],
			users: [],
			onlineUsers: [],
			offlineUsers: [],

			showActiveUsers: true,
			now: new Date(),
		};
	},

	computed: {
		...mapGetters(["socket", "currentUser"]),

		onlineUsersCache() {
			return this.users.filter((user) => user.is_online === true);
		},
		offlineUsersCache() {
			return this.users.filter((user) => user.is_online === false);
		},
		graphWidth() {
			return this.$refs.calls.clientWidth;
		},
	},
	watch: {
		numbers: {
			deep: true,
			handler(calls) {
				this.setGraph();
			},
		},
	},
	created() {
		this.getUsersInCall();
		this.getNumbersData();
		this.listenEvents();
		setInterval(() => {
			this.now = new Date();
		}, 1000);
	},
	beforeDestroy() {
		this.closeEvents();
	},
	methods: {
		setGraph() {
			let calls = 0;
			let queue = 0;
			let ivr = 0;
			let ringing = 0;
			let in_call = 0;
			let colorInit = 0;
			this.chart.visible = false;
			this.numbers.forEach((number) => {
				if (this.getSelectedNumbers().includes(number.id)) {
					calls += number.calls.length;
					queue += number.queue.length;
					ivr += number.ivr.length;
					ringing += number.ringing.length + number.calling.length;
					in_call += number.in_call.length;
				}
				colorInit = colorInit + 20;
			});
			this.chart.series = [
				{
					color: this.currentUser.settings.interface_primary_color,
					name: "Data",
					data: [in_call, ringing, ivr, queue],
				},
			];
			this.chart.chartOptions.xaxis.labels.style.colors = [
				this.currentUser.settings.interface_primary_color,
			];
			this.chart.chartOptions.stroke.colors = [
				this.currentUser.settings.interface_primary_color,
			];
			this.chart.chartOptions.fill.colors = [
				this.currentUser.settings.interface_primary_color,
			];
			this.chart.chartOptions.markers.colors = [
				this.currentUser.settings.interface_primary_color,
			];
			this.chart.visible = true;
		},
		setNumberDetails() {
			let numbers = this.numbers;
			numbers.forEach((item, key) => {
				numbers[key].calls = [];
				numbers[key].in_call = [];
				numbers[key].queue = [];
				numbers[key].ivr = [];
				numbers[key].ringing = [];
				numbers[key].calling = [];
			});
			this.calls.forEach((call) => {
				let numberIndex = false;
				numbers.forEach((item, key) => {
					if (call.number && call.number.id && parseInt(item.id) === parseInt(call.number.id)) {
						numberIndex = key;
					}
				});

				if (numberIndex !== false && numbers[numberIndex]) {
					numbers[numberIndex].calls.push(call);
					if (call.current_state && call.current_state !== "") {
						if (!numbers[numberIndex][call.current_state]) {
							numbers[numberIndex][call.current_state] = [];
						}
						numbers[numberIndex][call.current_state].push(call);
					}
				}
			});
			this.numbers = numbers;
			this.setGraph();
		},
		progressFormat(percentage) {
			return "%" + percentage + " Kuyruk ";
		},
		getNumbersData() {
			this.$api.get("settings/numbers", {}, (response) => {
				let numbers = [];
				response.data.data.forEach((number, index) => {
					numbers[index] = {
						checked: true,
						id: number.id,
						name: number.name,
						calls: [],
						in_call: [],
						queue: [],
						ivr: [],
						ringing: [],
						calling: [],
					};
				});
				this.numbers = numbers;
				console.log("numbers", this.numbers);
				this.getCallsInProgress();
			});
		},
		getNumberDetailById(id) {
			let ret = false;
			this.getNumbers().forEach((number) => {
				if (parseInt(number.id) === parseInt(id)) ret = number;
			});
			return ret;
		},
		getNumbers() {
			let numbers = [];
			this.calls.forEach((call) => {
				let numberIndex = false;
				numbers.forEach((item, key) => {
					if (parseInt(item.id) === parseInt(call.number.id)) numberIndex = key;
				});
				if (call.number && call.number.id && numberIndex === false) {
					numbers.push({
						...call.number,
						calls: [],
						in_call: [],
						queue: [],
						ivr: [],
						ringing: [],
						calling: [],
					});
					numberIndex = numbers.length - 1;
				}
				if (numberIndex !== false) {
					numbers[numberIndex].calls.push(call);
					if (call.current_state && call.current_state !== "") {
						numbers[numberIndex][call.current_state].push(call);
					}
				}
			});
			return numbers;
		},
		getSelectedNumbers() {
			let checked = [];
			this.numbers.forEach((item) => {
				if (item.checked) checked.push(item.id);
			});
			return checked;
		},
		filteredCalls() {
			return this.calls.filter((item) => {
				if (
					((this.filter.call.direction !== null &&
						item.direction === this.filter.call.direction) ||
						this.filter.call.direction === null) &&
					this.getSelectedNumbers().includes(parseInt(item.number.id))
				)
					return true;
				else {
					return false;
				}
			});
		},
		getStatusByKey(status) {
			let cache = {};
			status = status ? status : "avail";
			this.agentStatuses.forEach((item) => {
				if (status === item.key) {
					cache = item;
				}
			});
			return cache;
		},
		listenEvents() {
			this.socket.server.on("agent_states", this.statusUserEvent);
			this.socket.server.on("call_states", this.statusCallEvent);
		},
		getCallsByQueue(key) {
			let data = [];
			this.calls.forEach((item) => {
				if (
					item.queue.name &&
					item.queue.name === key &&
					item.direction === "in"
				) {
					data.push(item);
				}
			});
			return data;
		},
		getCallsByDirection(key) {
			let data = [];
			this.calls.forEach((item) => {
				if (item.direction === key) {
					data.push(item);
				}
			});
			return data;
		},
		statusUserEvent(data) {
			let index = this.users.findIndex((item) => {
				if (data.id && item.id && item.id.toString() === data.id.toString()) return true;
				if (data.user_id && item.user && item.user.id.toString() === data.user_id.toString()) return true;
				return false;
			});

			if (index !== -1) {
				if (data.partial) {
					let user = this.users[index];
					if (data.partial.call_status !== undefined) user.call_status = data.partial.call_status;
					if (data.partial.is_online !== undefined) user.is_online = data.partial.is_online;
					if (data.partial.started_at !== undefined) user.started_at = data.partial.started_at;
					
					if (data.partial.state_id !== undefined) {
						if (data.partial.state_id === null) {
							user.state = null;
						} else {
							user.state = { 
								id: data.partial.state_id, 
								name: data.partial.state_name || (user.state ? user.state.name : '') 
							};
						}
					}
				} else {
					this.users[index] = data;
				}
			} else {
				if (!data.partial) {
					this.users.unshift(data);
				}
			}
			this.$forceUpdate();
		},
		statusCallEvent(data) {
			console.log("Call", data);
			let index = this.calls.findIndex((item) => {
				return parseInt(item.call_id) === parseInt(data.call_id);
			});
			if (index !== -1) {
				if (data.current_state !== "hangup") {
					this.calls[index] = data;
				} else {
					this.calls.splice(index, 1);
				}
			} else {
				this.calls.unshift(data);
			}
			this.setNumberDetails();
			this.$forceUpdate();
		},
		closeEvents() {
			this.socket.server.off("agent_states", this.statusUserEvent);
			this.socket.server.off("call_states", this.statusCallEvent);
		},
		getStatusUsers(key, isOnline = true) {
			let statusUsers = [];
			this.users.forEach((item) => {
				if (
					key === "avail" &&
					!item.call_status &&
					item.state &&
					item.state.name &&
					item.is_online
				) {
					statusUsers.push(item);
				} else if (
					!key &&
					!item.call_status &&
					(!item.state || !item.state.name) &&
					item.is_online
				) {
					statusUsers.push(item);
				} else if (key && item.call_status === key && item.is_online) {
					statusUsers.push(item);
				}
			});
			return statusUsers;
		},
		getOnlineUsers(key) {
			let onlineUsers = [];
			this.users.forEach((item) => {
				if (item.is_online) {
					onlineUsers.push(item);
				}
			});
			return onlineUsers;
		},
		getUsersInCall() {
			this.loading.users = true;
			this.$api.get("dashboard/realtime/users", {}, (response) => {
				this.loading.users = false;
				this.users = response.data;
			});
		},
		getCallsInProgress() {
			this.loading.calls = true;
			this.$api.get("dashboard/realtime/calls", {}, (response) => {
				this.loading.calls = false;
				this.calls = response.data;
				this.setNumberDetails();
			});
		},
	},
};
</script>
<style lang="scss">
.el-radio-button__inner {
	width: 100%;
}
.app-simple-table {
	.el-table__row td {
		&:first-child {
			padding-left: 0.75rem;
		}
		&:last-child {
			padding-right: 0.75rem;
		}
	}
}
.app-call-chart .el-radio-button__inner {
	border: 0 !important;
	padding: 6px 10px !important;
}
.app-call-chart .el-radio-group label {
	flex: unset;
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
.badge .el-checkbox__inner {
	border-radius: 100px;
}
.badge .el-checkbox__label {
	padding-left: 5px;
	font-size: 12px;
}
.badge .el-checkbox {
	margin-bottom: 0;
}
</style>
