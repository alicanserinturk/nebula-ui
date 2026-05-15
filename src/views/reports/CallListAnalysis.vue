<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<div class="row row-xs app-table-filter-bar mb-3">
				<div class="col-auto" style="min-width: 280px">
					<app-form-call-list-select
						ref="callListSelect"
						v-model="filter.call_list_id"
					></app-form-call-list-select>
				</div>
			</div>

			<template v-if="!filter.call_list_id">
				<div class="app-table-landing pb-4">
					<div class="text-center row pt-4">
						<div style="width: 200px" class="mx-auto">
							<app-svg :src="'/assets/img/vectors/select.svg'"></app-svg>
						</div>
						<div class="col-12">
							<div class="text-center">
								<h5 class="mb-2 d-block font-weight-bold">
									Filtre seçimi yapın
								</h5>
								<span>
									Sonuçların listelenebilmesi
									<span class="badge badge-md bg-primary-lt mx-1 badge-pill">
										Arama Listesi
									</span>
									filtresini seçin.
								</span>
								<div class="mt-4">
									<button
										class="btn btn-primary btn-rounded"
										@click="focusFilter"
									>
										<ion-icon name="checkmark-circle-outline"></ion-icon>
										Filtre Seç
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>

			<template v-else>
				<div v-if="loading" class="p-4 text-center text-muted">
					<i class="el-icon-loading"></i> Yükleniyor...
				</div>

				<template v-else-if="data">
					<app-card :remove-body-padding="true">
						<template slot="header">
							<h5 class="mb-0 mt-1">{{ data.list.name }} — Toplam</h5>
						</template>
						<div class="row b-b">
							<div class="col-md-3 b-r pt-4 pb-4 text-center">
								<h3 style="font-weight: 500" class="mb-1">
									{{ data.list.totals.total }}
								</h3>
								<small class="d-block text-muted">Toplam Kayıt</small>
							</div>
							<div class="col-md-3 b-r pt-4 pb-4 text-center">
								<h3 style="font-weight: 500" class="mb-1 text-success">
									{{ data.list.totals.called }}
								</h3>
								<small class="d-block text-muted">Aranan</small>
							</div>
							<div class="col-md-3 b-r pt-4 pb-4 text-center">
								<h3 style="font-weight: 500" class="mb-1 text-warning">
									{{ data.list.totals.pending }}
								</h3>
								<small class="d-block text-muted">Bekleyen</small>
							</div>
							<div class="col-md-3 pt-4 pb-4 text-center">
								<h3 style="font-weight: 500" class="mb-1 text-danger">
									{{ data.list.totals.failed_rows }}
								</h3>
								<small class="d-block text-muted">Hatalı Yüklenen</small>
							</div>
						</div>
						<div class="p-3">
							<h6 class="mb-3">Sonuç Kodu Dağılımı</h6>
							<div
								v-if="data.list.result_code_breakdown.length === 0"
								class="text-muted small"
							>
								Henüz sonuç kodu kaydı yok.
							</div>
							<template v-else>
								<VueApexCharts
									:key="'overall-' + filter.call_list_id"
									type="bar"
									:height="chartHeight(data.list.result_code_breakdown)"
									:options="buildChartOptions(decorate(data.list.result_code_breakdown))"
									:series="buildSeries(decorate(data.list.result_code_breakdown))"
								></VueApexCharts>
							</template>
						</div>
					</app-card>

					<app-card v-if="data.files.length > 0" :remove-body-padding="true">
						<template slot="header">
							<h5 class="mb-0 mt-1">Dosya Bazlı Analiz</h5>
						</template>
						<div
							v-for="file in data.files"
							:key="file.id"
							class="b-b py-3 px-3"
						>
							<div class="row align-items-center mb-2">
								<div class="col-md-5">
									<i class="el-icon-document mr-1"></i>
									<strong>{{ file.original_name }}</strong>
									<small class="text-muted d-block ml-4">
										<app-date-text :text="file.created_at"></app-date-text>
									</small>
								</div>
								<div class="col-md-7 text-right">
									<span class="badge badge-light badge-md mr-1">
										Toplam: <strong>{{ file.totals.total }}</strong>
									</span>
									<span class="badge badge-success badge-md mr-1">
										Aranan: <strong>{{ file.totals.called }}</strong>
									</span>
									<span class="badge badge-warning badge-md mr-1">
										Bekleyen: <strong>{{ file.totals.pending }}</strong>
									</span>
									<span class="badge badge-danger badge-md">
										Hatalı: <strong>{{ file.totals.failed_rows }}</strong>
									</span>
								</div>
							</div>
							<div v-if="file.result_code_breakdown.length > 0">
								<VueApexCharts
									:key="'file-' + file.id"
									type="bar"
									:height="chartHeight(file.result_code_breakdown)"
									:options="buildChartOptions(decorate(file.result_code_breakdown))"
									:series="buildSeries(decorate(file.result_code_breakdown))"
								></VueApexCharts>
							</div>
							<div v-else class="text-muted small ml-4">
								Bu dosya için henüz sonuç kodu kaydı yok.
							</div>
						</div>
					</app-card>
				</template>
			</template>
		</app-module-body>
	</app-module>
</template>
<script>
import VueApexCharts from "vue-apexcharts";

export default {
	components: { VueApexCharts },
	data() {
		return {
			loading: false,
			data: null,
			filter: {
				call_list_id: null,
			},
		};
	},
	computed: {
		// Backend result_codes lookup'unu id -> {name, is_success, is_deleted}
		// formatına çevirir; chart render sırasında her id için tek erişim.
		resultCodeMap() {
			const map = {};
			if (!this.data || !Array.isArray(this.data.result_codes)) return map;
			this.data.result_codes.forEach((rc) => {
				map[rc.id] = rc;
			});
			return map;
		},
	},
	methods: {
		decorate(items) {
			return (items || []).map((it) => {
				const rc = this.resultCodeMap[it.result_code_id] || {};
				return {
					result_code_id: it.result_code_id,
					count: it.count,
					name: rc.name || "Silinmiş Kod #" + it.result_code_id,
					is_success: !!rc.is_success,
					is_deleted: !!rc.is_deleted,
				};
			});
		},
		focusFilter() {
			const wrap = this.$refs.callListSelect && this.$refs.callListSelect.$el;
			if (!wrap) return;
			wrap.scrollIntoView({ behavior: "smooth", block: "center" });
			const input = wrap.querySelector("input");
			if (input) {
				setTimeout(() => input.focus(), 200);
			}
		},
		getData() {
			if (!this.filter.call_list_id) {
				this.data = null;
				return;
			}
			this.loading = true;
			this.$api.get(
				"operation/calling-lists/" + this.filter.call_list_id + "/analytics",
				{},
				(response) => {
					this.data = response.data.data;
					this.loading = false;
				},
				() => {
					this.loading = false;
					this.data = null;
				}
			);
		},
		buildSeries(items) {
			return [{ name: "Adet", data: items.map((i) => i.count) }];
		},
		chartHeight(items) {
			// Yatay barda her satır ~36px; min 160, max 600 ile sınırla.
			return Math.min(600, Math.max(160, items.length * 36 + 60));
		},
		buildChartOptions(items) {
			return {
				chart: {
					id: "rc-" + Math.random().toString(36).slice(2, 8),
					type: "bar",
					toolbar: { show: false },
				},
				plotOptions: {
					bar: {
						horizontal: true,
						borderRadius: 4,
						barHeight: "65%",
						distributed: true,
					},
				},
				colors: items.map((i) => (i.is_success ? "#28a745" : "#dc3545")),
				dataLabels: { enabled: false },
				legend: { show: false },
				xaxis: {
					categories: items.map(
						(i) => (i.name || "—") + " (" + i.count + ")"
					),
					labels: { style: { fontSize: "12px" } },
				},
				yaxis: {
					labels: {
						show: true,
						style: { fontSize: "13px", fontWeight: 500 },
						maxWidth: 320,
					},
				},
				tooltip: {
					y: { formatter: (val) => val + " adet" },
				},
			};
		},
	},
	watch: {
		"filter.call_list_id"() {
			this.getData();
		},
	},
};
</script>
