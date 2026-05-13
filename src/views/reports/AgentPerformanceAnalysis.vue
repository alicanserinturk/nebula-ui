<template>
	<app-module>
		<app-module-header>
			<template slot="action">
				<button class="btn btn-light btn-rounded btn-sm" @click="$router.push('/reports/agent-performance')">
					<ion-icon name="arrow-back-outline"></ion-icon> Listeye Dön
				</button>
			</template>
		</app-module-header>
		<app-module-body>
			<app-warning></app-warning>

			<!-- Agent kimlik kartı -->
			<div v-if="data && data.user" class="mb-3 d-flex align-items-center">
				<span class="w-40 avatar bg-light mr-3">
					{{ (data.user.name || ' ')[0] }}{{ (data.user.surname || ' ')[0] }}
				</span>
				<div>
					<h5 class="mb-0">{{ data.user.name }} {{ data.user.surname }}</h5>
					<small class="text-muted">{{ data.user.email }}</small>
				</div>
			</div>

			<!-- Filtre çubuğu -->
			<div class="row row-xs mb-3">
				<div class="col-auto">
					<el-date-picker
						v-model="filters.date"
						type="daterange"
						size="medium"
						value-format="yyyy-MM-dd"
						start-placeholder="Başlangıç"
						end-placeholder="Bitiş"
						:picker-options="datePickerOptions"
					></el-date-picker>
				</div>
				<div class="col-auto">
					<app-form-queue-select v-model="filters.queue_id"></app-form-queue-select>
				</div>
				<div class="col-auto">
					<app-form-number-select v-model="filters.number_id"></app-form-number-select>
				</div>
			</div>

			<div v-if="loading" class="text-center py-5">
				<i class="el-icon-loading"></i> Yükleniyor...
			</div>

			<div v-else-if="data">
				<!-- Hat Durumları -->
				<app-card class="mb-3">
					<template slot="header">
						<h6 class="mb-0">
							<ion-icon name="time-outline" class="mr-1"></ion-icon>Hat Durumu Süreleri
						</h6>
					</template>
					<div v-if="data.states.length === 0" class="text-muted">
						Bu aralıkta hat durumu kaydı yok.
					</div>
					<div v-else class="d-flex flex-wrap" style="gap: 8px;">
						<div v-for="state in data.states" :key="state.id"
							class="card bg-light border-0"
							style="width: 150px; flex: 0 0 150px;">
							<div class="card-body p-2 d-flex align-items-center">
								<span class="w-32 avatar circle bg-white mr-2 flex-shrink-0">
									<ion-icon :name="stateIcon(state)" class="text-muted"></ion-icon>
								</span>
								<div class="text-truncate">
									<small class="text-muted d-block text-truncate">{{ state.name }}</small>
									<h6 class="mb-0">{{ state.duration }}</h6>
								</div>
							</div>
						</div>
					</div>
				</app-card>

				<!-- Kaçan Çağrılarda Ringing Analizi -->
				<app-card class="mb-3">
					<template slot="header">
						<div class="d-flex justify-content-between align-items-center">
							<h6 class="mb-0">
								<ion-icon name="alert-circle-outline" class="mr-1"></ion-icon>Kaçan Çağrılarda Ringing Analizi
							</h6>
							<a href="#" @click.prevent="missedModal.visible = true" class="small text-muted font-weight-bold">
								{{ data.user.name }}'nın Kaçırdığı Çağrıları Gör<ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon>
							</a>
						</div>
					</template>
					<div class="row text-center">
						<div class="col-md-4 col-6">
							<h4 class="mb-1">{{ data.ringing_total.count }}</h4>
							<small class="text-muted">Toplam Kaçan Çağrı</small>
						</div>
						<div class="col-md-4 col-6">
							<h4 class="mb-1">{{ data.ringing_total.duration }}</h4>
							<small class="text-muted">Kaçan Çağrılarda Ringing Süresi</small>
						</div>
						<div class="col-md-4 col-6">
							<h4 class="mb-1">{{ data.ringing_total.avg }}</h4>
							<small class="text-muted">Kaçan Çağrılarda Ortalama Ringing Süresi</small>
						</div>
					</div>
				</app-card>

				<!-- Gelen / Giden Çağrı Kartları -->
				<div class="row row-xs">
					<div v-for="block in callBlocks" :key="block.key" class="col-md-6">
						<app-card class="mb-3">
							<template slot="header">
								<h6 class="mb-0">
									<ion-icon :name="block.icon" class="mr-1"></ion-icon>
									{{ block.title }}
								</h6>
							</template>
							<div class="row text-center">
								<div class="col-6 mb-3">
									<h4 class="mb-1">{{ block.stats.count_talking }}</h4>
									<small class="text-muted">Cevaplanan</small>
								</div>
								<div class="col-6 mb-3">
									<h4 class="mb-1">{{ block.stats.talking_time }}</h4>
									<small class="text-muted">Toplam Konuşma</small>
								</div>
							</div>
							<table class="table table-sm mb-0">
								<tbody>
									<tr>
										<td class="text-muted">Ortalama Konuşma</td>
										<td class="text-right">{{ block.stats.avg_talking_time }}</td>
									</tr>
									<tr>
										<td class="text-muted">En Uzun Konuşma</td>
										<td class="text-right">{{ block.stats.max_talking_time }}</td>
									</tr>
									<tr>
										<td class="text-muted">En Kısa Konuşma</td>
										<td class="text-right">{{ block.stats.min_talking_time }}</td>
									</tr>
									<tr>
										<td class="text-muted">Toplam Ringing</td>
										<td class="text-right">{{ block.stats.ringing_time }}</td>
									</tr>
									<tr>
										<td class="text-muted">Ortalama Ringing</td>
										<td class="text-right">{{ block.stats.avg_ringing_time }}</td>
									</tr>
								</tbody>
							</table>
						</app-card>
					</div>
				</div>
			</div>
		</app-module-body>

		<el-dialog
			:append-to-body="true"
			title="Kaçan Çağrılar"
			:visible.sync="missedModal.visible"
			width="1200px"
			top="6vh"
		>
			<missed-calls-modal
				v-if="missedModal.visible"
				:user-id="userId"
				:date="filters.date"
				:queue-id="filters.queue_id"
				:number-id="filters.number_id"
			></missed-calls-modal>
		</el-dialog>
	</app-module>
</template>
<script>
import moment from "moment";
import MissedCallsModal from "./MissedCallsModal.vue";

export default {
	components: { MissedCallsModal },
	data() {
		const self = this;
		return {
			loading: false,
			data: null,
			pickerAnchor: null,
			missedModal: { visible: false },
			filters: {
				date: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
				queue_id: null,
				number_id: null,
			},
			datePickerOptions: {
				// Aralığın ilk gününü baz alıp ±31 gün dışındaki günleri devre dışı bırak.
				// Backend de aynı 31 gün limitini enforce ediyor; UI'da kullanıcının yanlış
				// seçim yapmadan önce uyarılması için.
				onPick({ minDate, maxDate }) {
					self.pickerAnchor = maxDate ? null : minDate;
				},
				disabledDate(time) {
					if (!self.pickerAnchor) return false;
					const limitMs = 31 * 24 * 3600 * 1000;
					return Math.abs(time.getTime() - self.pickerAnchor.getTime()) > limitMs;
				},
			},
		};
	},
	computed: {
		userId() {
			return this.$route.params.user_id;
		},
		callBlocks() {
			if (!this.data) return [];
			return [
				{ key: "inbound", title: "Gelen Çağrılar", icon: "arrow-undo-outline", stats: this.data.calls.inbound },
				{ key: "outbound", title: "Giden Çağrılar", icon: "arrow-redo-outline", stats: this.data.calls.outbound },
			];
		},
	},
	created() {
		this.fetch();
	},
	watch: {
		filters: {
			deep: true,
			handler() {
				this.fetch();
			},
		},
	},
	methods: {
		stateIcon(state) {
			// state.key (pbx_states.state) → ionicon adı eşlemesi. Pano'daki ikon
			// dilini takip ediyor; eşleşmeyen custom state'ler "briefcase-outline".
			const map = {
				inbound: "arrow-undo-outline",
				outbound: "arrow-redo-outline",
				break: "cafe-outline",
				lunch: "restaurant-outline",
				meeting: "people-outline",
				training: "school-outline",
				offline: "power-outline",
				avail: "checkmark-circle-outline",
			};
			return map[state.key] || "briefcase-outline";
		},
		fetch() {
			this.loading = true;
			const userId = this.$route.params.user_id;
			const params = {};
			if (
				Array.isArray(this.filters.date) &&
				this.filters.date.length === 2 &&
				this.filters.date[0] &&
				this.filters.date[1]
			) {
				params.date = this.filters.date;
			}
			if (this.filters.queue_id) {
				params.queue_id = typeof this.filters.queue_id === "object" ? this.filters.queue_id.id : this.filters.queue_id;
			}
			if (this.filters.number_id) {
				params.number_id = typeof this.filters.number_id === "object" ? this.filters.number_id.id : this.filters.number_id;
			}
			this.$api.get(
				"reports/agent-performance/" + userId,
				params,
				(response) => {
					this.data = response.data.data;
					this.loading = false;
				},
				() => {
					this.loading = false;
				}
			);
		},
	},
};
</script>
