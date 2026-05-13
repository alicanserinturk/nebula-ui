<template>
	<div>
		<!-- Filtre çubuğu (sadece kuyruk + numara, tarih = bugün) -->
		<div class="row row-xs mb-3">
			<div class="col-6">
				<app-form-queue-select v-model="filters.queue_id" :clearable="true"></app-form-queue-select>
			</div>
			<div class="col-6">
				<app-form-number-select v-model="filters.number_id" :clearable="true"></app-form-number-select>
			</div>
		</div>

		<div v-if="loading" class="text-center py-4">
			<i class="el-icon-loading"></i> <small>Yükleniyor...</small>
		</div>

		<div v-else-if="data">
			<!-- Hat Durumu Süreleri -->
			<app-card class="mb-2">
				<template slot="header">
					<h6 class="mb-0 small">
						<ion-icon name="time-outline" class="mr-1"></ion-icon>Hat Durumu Süreleri
					</h6>
				</template>
				<div v-if="data.states.length === 0" class="small text-muted">
					Bu aralıkta kayıt yok.
				</div>
				<div v-else class="d-flex flex-wrap" style="gap: 6px;">
					<div v-for="state in data.states" :key="state.id" class="px-2 py-1 bg-light rounded small">
						<span class="text-muted">{{ state.name }}:</span>
						<strong class="ml-1">{{ state.duration }}</strong>
					</div>
				</div>
			</app-card>

			<!-- Gelen / Giden çağrı kartları -->
			<div class="row row-xs">
				<div v-for="block in callBlocks" :key="block.key" class="col-md-6">
					<app-card class="mb-2">
						<template slot="header">
							<h6 class="mb-0 small">
								<ion-icon :name="block.icon" class="mr-1"></ion-icon>{{ block.title }}
							</h6>
						</template>
						<table class="table table-sm small mb-0">
							<tbody>
								<tr>
									<td class="text-muted py-1">Cevaplanan</td>
									<td class="text-right py-1"><strong>{{ block.stats.count_talking }}</strong></td>
								</tr>
								<tr>
									<td class="text-muted py-1">Toplam Konuşma</td>
									<td class="text-right py-1">{{ block.stats.talking_time }}</td>
								</tr>
								<tr>
									<td class="text-muted py-1">Ortalama Konuşma</td>
									<td class="text-right py-1">{{ block.stats.avg_talking_time }}</td>
								</tr>
								<tr>
									<td class="text-muted py-1">En Uzun / En Kısa</td>
									<td class="text-right py-1">{{ block.stats.max_talking_time }} / {{ block.stats.min_talking_time }}</td>
								</tr>
								<tr>
									<td class="text-muted py-1">Ringing Top. / Ort.</td>
									<td class="text-right py-1">{{ block.stats.ringing_time }} / {{ block.stats.avg_ringing_time }}</td>
								</tr>
							</tbody>
						</table>
					</app-card>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import moment from "moment";

export default {
	props: {
		userId: { type: [Number, String], required: true },
	},
	data() {
		return {
			loading: false,
			data: null,
			filters: {
				queue_id: null,
				number_id: null,
			},
		};
	},
	computed: {
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
		userId() {
			this.fetch();
		},
		filters: {
			deep: true,
			handler() {
				this.fetch();
			},
		},
	},
	methods: {
		fetch() {
			if (!this.userId) return;
			this.loading = true;
			const today = moment().format("YYYY-MM-DD");
			const params = { date: [today, today] };
			if (this.filters.queue_id) {
				params.queue_id = typeof this.filters.queue_id === "object" ? this.filters.queue_id.id : this.filters.queue_id;
			}
			if (this.filters.number_id) {
				params.number_id = typeof this.filters.number_id === "object" ? this.filters.number_id.id : this.filters.number_id;
			}
			this.$api.get(
				"reports/agent-performance/" + this.userId,
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
