<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card :remove-body-padding="true">
						<div class="p-4 row b-b">
							<div class="col">
								<strong class="text-label">Kullanıcılar</strong>
							</div>
							<div class="col text-right">
								<small class="text-muted mr-2">Çevrimiçi Kullanıcılar:</small>
								<el-switch
									v-model="showActiveUsers"
									active-color="var(--primary-color)"
								></el-switch>
							</div>
						</div>
						<div v-if="loading.users" class="card-body p-3 text-center">
							<small>Yükleniyor...</small>
						</div>
						<div v-else class="card-body p-0">
							<div class="app-progress-bar b-b" v-if="showActiveUsers">
								<div
									v-for="item in agentStatuses"
									class="col app-progress pb-3 d-flex b-r"
								>
									<span class="w-48 avatar  b-a b-2x i-con-h-a"
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
												>%{{
													(
														(getStatusUsers(item.key).length /
															getOnlineUsers().length) *
														100
													).toFixed(0)
												}}</span
											>
										</div>
										<small class="text-muted -50">{{ item.label }}</small>
									</div>
									<!--  <div class="d-block" :class="item.class" style="position:absolute; bottom:1rem; left:1rem; right: 1rem; border-radius: 18px; height: 5px;"></div>
                  -->
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
												class="badge badge-lg badge-pill"
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
														:name="getStatusIcon(scope.row.call_status)"
													></ion-icon>
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
												Çevrimdışı &bull; <app-date-text
												:text="scope.row.started_at"
											></app-date-text
										>
											</span>
										</template>
									</el-table-column>
									
								</el-table>
							</div>
						</div>
					</app-card>

					<div class="card">
						<div class="p-4 b-b row">
							<div class="col">
								<strong>Çağrı</strong>
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
						<div v-else class="card-body p-0">
							<table class="table table-theme v-middle m-0">
								<thead class="text-muted">
									<tr>
										<th class="pl-4" width="60px"></th>
										<th>Müşteri</th>
										<th width="150px">Arama Grubu</th>
										<th width="150px">Durum</th>
										<th>Kullanıcı</th>

										<th width="100px" style="text-align: right" class="pr-4">
											Süre
										</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in calls" class="v-middle pointer">
										<td class="pl-4 pr-0">
											<span
												class="w-32 avatar circle bg-light"
												v-if="item.direction === 'in'"
												><i class="el-icon-back"></i
											></span>
											<span
												class="w-32 avatar circle bg-light"
												v-if="item.direction === 'out'"
												><i class="el-icon-right"></i
											></span>
										</td>
										<td class="flex">
											<span v-if="item.direction === 'in'">{{
												item.from
											}}</span>
											<span v-else>{{ item.to }}</span>
											<small class="d-block text-muted" v-if="item.pbx">{{
												item.pbx.name
											}}</small>
										</td>
										<td class="flex">
											<span v-if="item.queue">{{ item.queue.name }}</span>
										</td>
										<td class="flex">
											
										</td>
										<td class="flex">
											<span v-if="item.user"
												>{{ item.user.name }} {{ item.user.surname }}</span
											>
										</td>
										<td class="flex pr-4" style="text-align: right">
											
										</td>
									</tr>
								</tbody>
							</table>
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
import VueApexCharts from "vue-apexcharts";

export default {
	components: {
		VueApexCharts,
	},
	data() {
		return {
			activeTab: "online",
			loading: {
				users: false,
				calls: false,
			},
			chart: {
				series: [44, 55, 41, 17, 15],
				chartOptions: {
					labels: ["Rose A", "Rose B", "Rose C", "Rose D", "Rose E"],
					colors: [
						"#FFD14D",
						"#F0F2F5",
						"var(--primary-color)",
						"#5BC146",
						"#FE4D62",
					],
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
									name: {
										show: false,
									},
									value: {
										show: true,
									},
									total: {
										show: true,
										label: "Total",
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
			calls: [],
			users: [],
			onlineUsers: [],
			offlineUsers: [],

			showActiveUsers: true,
			now: new Date(),
		};
	},

	computed: {
		...mapGetters(["socket"]),
		onlineUsersCache() {
			return this.users.filter((user) => user.is_online === true);
		},
		offlineUsersCache() {
			return this.users.filter((user) => user.is_online === false);
		},
	},
	created() {
		console.log("test");
		this.getUsersInCall();
		this.getCallsInProgress();
		this.listenEvents();
		setInterval(() => {
			this.now = new Date();
		}, 1000);
	},
	beforeDestroy() {
		this.closeEvents();
	},
	methods: {
		getStatusIcon(status) {
			let icon = "avail";
			status = status ? status : "avail";
			this.agentStatuses.forEach((item) => {
				if (status === item.key) {
					icon = item.icon;
				}
			});
			return icon;
		},
		listenEvents() {
			console.log("listenEvents");
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
			console.log("statusUserEvent", data);
			
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
		},
		statusCallEvent(data) {
			console.log("statusCallEvent", data);
			
			let index = this.calls.findIndex((item) => {
				return item.call_id === data.call_id;
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
		},
		closeEvents() {
			this.socket.server.off("agent_states", this.statusUserEvent);
			this.socket.server.off("call_states", this.statusCallEvent);
		},
		getStatusUsers(key, isOnline = true) {
			let statusUsers = [];
			this.users.forEach((item) => {
				if (item.call_status === key && item.is_online) {
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
</style>
