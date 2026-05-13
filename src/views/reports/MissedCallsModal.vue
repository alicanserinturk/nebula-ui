<template>
	<div>
		<div v-if="loading" class="text-center py-4">
			<i class="el-icon-loading"></i> <small>Yükleniyor...</small>
		</div>
		<div v-else-if="items.length === 0" class="text-center py-4 text-muted">
			<small>Bu kriterlere uygun kaçan çağrı bulunmuyor.</small>
		</div>
		<div v-else>
			<el-table :data="items" size="mini" style="width: 100%;">
				<el-table-column width="55">
					<template slot-scope="scope">
						<span class="w-36 avatar bg-light circle">
							<ion-icon style="font-size:18px" name="call" class="text-muted"></ion-icon>
							<ion-icon
								:name="scope.row.direction === 'out' ? 'arrow-redo' : 'arrow-undo'"
								class="text-muted"
								style="font-size:12px;position:absolute; top:6px; right:7px;"
							></ion-icon>
						</span>
					</template>
				</el-table-column>
				<el-table-column label="Çağrı Detayları">
					<template slot-scope="scope">
						{{ scope.row.contact.number }}
						<small class="sub-item text-muted">
							<span v-if="scope.row.direction === 'in'">Gelen</span>
							<span v-else>Giden</span>
							<span class="ml-1">{{ Math.round((scope.row.ring_time || 0) / 1000) }} sn</span>
							<el-tooltip v-if="scope.row.user" placement="top" effect="dark">
								<template slot="content">
									<div v-for="(ev, i) in scope.row.events" :key="i">
										<span v-if="ev.user">{{ ev.user.name }} {{ ev.user.surname }}</span>
										<span v-else>-</span>
										<span class="ml-1">— {{ Math.round((ev.ring_time || 0) / 1000) }} sn yanıtlamadı</span>
									</div>
								</template>
								<span class="ml-2">
									<ion-icon name="person-outline" class="mr-1"></ion-icon>
									{{ scope.row.user.name }} {{ scope.row.user.surname }}
									<small v-if="scope.row.attempts > 1" class="text-muted">+{{ scope.row.attempts - 1 }}</small>
								</span>
							</el-tooltip>
							<span class="ml-2" v-if="scope.row.queue">
								<ion-icon name="cellular-outline" class="mr-1"></ion-icon>{{ scope.row.queue.name }}
							</span>
							<span class="ml-2" v-if="scope.row.number">
								<ion-icon name="people-outline" class="mr-1"></ion-icon>{{ scope.row.number.name }}
							</span>
						</small>
					</template>
				</el-table-column>
				<el-table-column width="210" align="right" label="Sonuç">
					<template slot-scope="scope">
						<span v-if="scope.row.is_success" class="badge bg-success-lt badge-md badge-pill">
							Tekrar Ulaşabildi
							<template v-if="scope.row.attempts > 1"> ({{ scope.row.attempts }}. deneme)</template>
						</span>
						<span v-else class="badge badge-pill bg-danger-lt badge-md">Kaçan Çağrı</span>
					</template>
				</el-table-column>
				<el-table-column width="120" label="Tarih" align="right">
					<template slot-scope="scope">
						<app-date-text :text="scope.row.created_at"></app-date-text>
					</template>
				</el-table-column>
			</el-table>
			<div v-if="meta.last_page > 1" class="mt-3 text-center">
				<el-pagination
					background
					small
					layout="prev, pager, next"
					:current-page.sync="page"
					:page-size="meta.per_page"
					:total="meta.total"
					@current-change="fetch"
				></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		userId: { type: [Number, String], required: true },
		date: { type: Array, default: () => [] },
		queueId: { type: [Number, Object, String], default: null },
		numberId: { type: [Number, Object, String], default: null },
	},
	data() {
		return {
			loading: false,
			items: [],
			meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
			page: 1,
		};
	},
	created() {
		this.fetch();
	},
	methods: {
		fetch() {
			this.loading = true;
			const params = { user_id: this.userId, page: this.page };
			if (Array.isArray(this.date) && this.date.length === 2 && this.date[0] && this.date[1]) {
				params.date = this.date;
			}
			if (this.queueId) {
				params.queue_id = typeof this.queueId === "object" ? this.queueId.id : this.queueId;
			}
			if (this.numberId) {
				params.number_id = typeof this.numberId === "object" ? this.numberId.id : this.numberId;
			}
			this.$api.get(
				"reports/missed-calls",
				params,
				(response) => {
					this.items = response.data.data || [];
					this.meta = response.data.meta || this.meta;
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
