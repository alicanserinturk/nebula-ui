<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<app-information :errors="errors"></app-information>
			<app-table
				downloadable
				endpoint="agent/tasks"
				vector="customer"
				:filters="filters"
			>
				<template :slot-scope="item">
					<el-table-column width="55px">
						<template slot-scope="scope">
							<span
								v-if="!scope.row.contact.name && !scope.row.contact.surname"
								class="w-36 avatar circle bg-light"
							>
								<i class="el-icon-user"></i>
							</span>
							<span v-else class="w-36 avatar circle bg-light">
								<span
									v-if="scope.row.contact.name && scope.row.contact.name[0]"
									>{{ scope.row.contact.name[0] }}</span
								>
								<span
									v-if="
										scope.row.contact.surname && scope.row.contact.surname[0]
									"
									>{{ scope.row.contact.surname[0] }}</span
								>
							</span>
						</template>
					</el-table-column>
					<el-table-column width="130" label="Müşteri">
						<template slot-scope="scope">
							<span
								v-if="!scope.row.contact.name && !scope.row.contact.surname"
								>Yeni Müşteri</span
							>
							<span v-else class="text-capitalize"
								>{{ scope.row.contact.name }}
								{{ scope.row.contact.surname }}</span
							>
							<span class="sub-item text-muted">
								<span>{{ scope.row.contact.phone }}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column align="left" width="200px" label="Görev Nereden Geldi">
						<template slot-scope="scope" v-if="scope.row.source">
							<span class="app-text-dots"
								><i class="el-icon-tickets mr-1"></i>
								{{ scope.row.source.name }}</span
							>
						</template>
					</el-table-column>
					<el-table-column align="left" width="200px" label="Operasyon">
						<template slot-scope="scope" v-if="scope.row.number">
							<span class="app-text-dots">{{ scope.row.number.name }}</span>
							<small class="sub-item text-muted d-block" v-if="scope.row.number.number">
								{{ scope.row.number.number }}
							</small>
						</template>
					</el-table-column>
					<el-table-column align="right" width="125" label="Oluşturma Tarihi">
						<template slot-scope="scope">
							<span class="text-muted">
								<app-date-text :text="scope.row.created_at"></app-date-text>
							</span>
						</template>
					</el-table-column>
					<el-table-column align="right">
						<template slot-scope="scope">
							<div class="p-1">
								<button
									v-if="calledNumbers.includes(scope.row.id)"
									:disabled="true"
									class="btn btn-white text-primary ml-1 btn-sm btn-rounded"
								>
									<i class="el-icon-loading"></i>
									Arama Başlatıldı
								</button>
								<template v-else-if="callableNumbers.includes(scope.row.id)">
									<button
										class="btn btn-white btn-sm btn-rounded ml-1"
										@click="clearTask"
									>
										<i class="el-icon-circle-check mr-1"></i>
										Listemden Kaldır
									</button>
									<button
										@click="startCall(scope.row)"
										class="ml-1 btn btn-sm btn-rounded btn-outline-primary"
									>
										<i class="el-icon-phone-outline"></i>
										Tekrar Ara
									</button>
								</template>
								<button
									v-else
									@click="startCall(scope.row)"
									class="btn btn-primary btn-sm btn-rounded"
								>
									<i class="el-icon-phone-outline"></i>
									Ara
								</button>
							</div>
						</template>
					</el-table-column>
				</template>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
export default {
	data() {
		return {
			errors: null,
			options: {},
			calledNumbers: [],
			callableNumbers: [],
			filters: {
				status: {
					name: "Durum",
					type: "primary",
					value: "scheduled",
					options: [
						{ name: "Planlanmış", value: "scheduled" },
						{ name: "Bekleyen", value: "pending" },
						{ name: "Üstlendiklerim", value: "mine" },
					],
				},
				call_list_id: {
					name: "Arama Listesi",
					type: "call_list",
					value: null,
					options: [],
				},
				call_endpoint_id: {
					name: "Arama Endpoint",
					type: "call_endpoint",
					value: null,
					options: [],
				},
				number_id: {
					name: "Numara",
					type: "number",
					value: null,
					options: [],
				},
			},
		};
	},
	created() {},
	methods: {
		clearTask() {
			this.$router.push(
				this.$route.path + "?reload=" + Math.floor(Math.random() * 1000)
			);
		},
		startCall(item) {
			// Server-side click-to-call: tüm validasyonlar (state, number match,
			// blacklist) ve atomik claim + AMI originate backend'de yapılır.
			// before-call ve EventBus(sipStartCall) bu yolda KULLANILMAZ —
			// onlar client-initiated (manuel dial / JsSIP) yola özgüdür.
			// Asterisk originate'ten sonra agent SIP'ine incoming INVITE
			// gelir ve JsSIP UA bunu normal inbound akışıyla karşılar.
			this.$api.get(
				"agent/tasks/call/" + item.id,
				{},
				() => {
					this.calledNumbers.push(item.id);
					setTimeout(() => {
						this.callableNumbers.push(item.id);
						const index = this.calledNumbers.indexOf(item.id);
						if (index > -1) {
							this.calledNumbers.splice(index, 1);
						}
					}, 1000);
					this.errors = null;
				},
				(code, errors) => {
					// Claim hatası: task başkası tarafından alınmış, blacklist,
					// outbound state vb. Listeyi yenile ki güncel durum görünsün.
					this.errors = errors;
					this.$router.push(
						this.$route.path + "?reload=" + Math.floor(Math.random() * 1000)
					);
				}
			);
		},
	},
};
</script>
<style>
.cell {
	overflow: hidden !important;
	white-space: nowrap !important;
	text-overflow: ellipsis !important;
}
</style>
