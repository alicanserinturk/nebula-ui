<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					v-if="$api.has('call_list_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					Düzenle <i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				<button
					v-if="$api.has('call_list_create')"
					@click="$router.push('/operation/call-list/create')"
					class="btn ml-2 btn-sm btn-rounded btn-primary i-con-h-a"
				>
					{{ $t("menu.modules.call_list_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-information :errors="errors"></app-information>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card>
						<div slot="header">
							<h5 class="mb-0 pt-1 float-left">{{ form.name }}</h5>
							<button
								v-if="form.is_active"
								@click="pause"
								class="float-right btn btn-white btn-rounded btn-sm"
							>
								<i class="el-icon-video-pause"></i> Pasifleştir
							</button>
							<button
								v-else
								@click="play"
								class="float-right btn btn-white btn-rounded btn-sm"
							>
								<i class="el-icon-video-play"></i> Aktifleştir
							</button>
						</div>
						<!--<div class="app-progress-bar  b-b">
              <div class="col app-progress px-2 d-flex b-r">
                <span class="w-48 avatar  b-a b-2x i-con-h-a"><i class="text-2x b-2x text-muted el-icon-right text-danger"><i></i></i></span>
                <div class="mx-3">
                  <div>
                    <strong style="font-size:20px;">0</strong><span class="ml-1 text-muted ">%2</span>
                  </div>
                  <small class="text-muted -50">Ulaşılamayanlar</small>
                </div>
               </div>
            </div>-->
						<!--<app-label label="Durum">
              <span class="badge badge-default badge-xs" v-if="!form.is_active">Pasif</span>
              <span v-else-if="form.status === 'working'" class="badge badge-primary badge-xs">Aranıyor</span>
              <span v-else-if="form.status === 'loading'" class="badge badge-light badge-xs">Yükleniyor</span>
              <span v-else-if="form.status === 'wait'" class="badge badge-light badge-xs">Beklemede</span>
              <span v-else-if="form.status === 'completed'" class="badge badge-success badge-xs">Tamamlandı</span>
            </app-label>-->
						<app-label icon="el-icon-alarm-clock" label="Planlanan Tarih">
							<app-date-text :text="form.starts_at"></app-date-text>
						</app-label>
						<app-label icon="el-icon-date" label="Arama Günleri">
							{{ filterDays(form.allowed_weekdays) }}
						</app-label>
						<app-label icon="el-icon-refresh" label="Arama Tekrarı"
							>{{ form.retry_days }} gün, günde
							{{ form.retry_per_day }} sefer
						</app-label>
						<app-label icon="el-icon-files" label="Aranma Türü">
							<span v-if="form.call_type === 'auto'">Otomatik Arama</span>
							<span v-else>Tıklayarak Arama</span>
						</app-label>
					</app-card>

					<app-card :remove-body-padding="true">
						<app-accordion>
							<template slot="header">
								<div class="p-4 b-b">
									<span class="pt-1 d-inline-block">Verimlilik Grafikleri</span>
								</div>
							</template>
							<div class="row">
								<div class="col-md-8 b-r">
									<div class="mt-4 mb-5">
										<h6 class="ml-4 mb-3">Ulaşılanlar</h6>
										<vue-funnel-graph
											:width="600"
											:height="95"
											:labels="labels"
											:values="values"
											:colors="colors"
											:sub-labels="subLabels"
											:display-percentage="true"
										></vue-funnel-graph>
									</div>
								</div>
								<div class="col-md-4 pt-3">
									<h6 class="mb-3 mt-2">Ulaşılamayanlar</h6>
									<VueApexCharts
										v-if="chart.series.length > 0"
										type="donut"
										:options="chart.chartOptions"
										:series="chart.series"
									></VueApexCharts>
								</div>
							</div>
						</app-accordion>
					</app-card>

					<app-card>
						<template slot="header">
							<span class="pt-1 d-inline-block">Dosyalar</span>
							<button
								v-if="!fileUpload"
								@click="showFileUpload"
								class="float-right btn btn-primary btn-rounded btn-sm"
							>
								<i class="el-icon-plus"></i> Dosya Ekle
							</button>
							<button
								v-else
								@click="fileUpload = false"
								class="float-right btn btn-white btn-rounded btn-sm"
							>
								<i class="el-icon-close"></i> Kapat
							</button>
						</template>
						<template v-if="fileUpload">
							<small class="mb-2 d-block">Dikkat Etmeniz Gerekenler</small>
							<ul class="list">
								<li class="list-item">
									Dosya formatı CSV olmalı ve dosya boyutu 2Mb altında
									olmalıdır.
								</li>
								<li class="list-item">
									CSV formatı ayırıcı belirteç olarak noktalı virgül (;)
									kullanıyor olmalıdır.
								</li>
								<li class="list-item">
									A,B,C sütunları dışındaki alanlar dikkate alınmaz.
								</li>
								<li class="list-item">
									A : Ad, B : Soyad, C : telefon numarası şeklinde yerleşmek
									zorundadır.
								</li>
								<li class="list-item">
									Ad, soyad veya her ikisi de yoksa A ve B sütunları boş
									bırakılarak numaralar C sütununa yerleştirilmek zorundadır.
								</li>
								<li class="list-item">
									Numaralar başında 0 olmadan 10 haneli olarak eklenmek
									zorundadır.
								</li>
							</ul>
							<app-form-row
								class="i-con-h-a"
								label="Arama Listesi"
								description="Dosya formatı CSV olmalı ve dosya boyutu 2Mb veya altında olmalıdır."
							>
								<el-upload
									:headers="{
										Authorization: 'Bearer ' + currentUser.api_token,
										Accept: 'application/json',
									}"
									class="upload-demo"
									accept=".csv"
									drag
									:on-error="fileError"
									:on-success="fileUploaded"
									:action="
										apiEndpoint +
											currentUser.customer.key +
											'/operation/calling-lists/' +
											form.id +
											'/files'
									"
								>
									<i class="i-con i-con-arrow-up"><i></i></i>
									<div class="el-upload__text">
										<small
											>Dosyayı sürükleyin veya seçmek için<em>
												tıklayın</em
											></small
										>
									</div>
								</el-upload>
							</app-form-row>
						</template>
						<template v-else>
							<div v-if="form.files.length === 0" class="p-3 text-center">
								<small
									>Herhangi bir liste bulunamadı. Yeni liste ekleyerek aramayı
									başlatabilirsiniz.</small
								>
							</div>
							<div v-else>
								<el-table :data="paginatedFiles" style="width: 100%">
									<el-table-column label="Dosya Adı" min-width="220">
										<template slot-scope="scope">
											<i class="el-icon-document mr-1"></i>
											<span>{{ scope.row.original_name }}</span>
										</template>
									</el-table-column>
									<el-table-column label="Durum" width="180">
										<template slot-scope="scope">
											<span
												v-if="scope.row.status === 'ready'"
												class="badge badge-primary badge-md"
												><i class="el-icon-phone-outline"></i>
												{{ scope.row.success_count }} Kayıt Hazır</span
											>
											<el-tooltip
												v-else-if="scope.row.status === 'error'"
												effect="dark"
												placement="top"
												:content="scope.row.failure_reason || 'Dosya işlenemedi.'"
											>
												<span class="badge badge-danger badge-md">
													<i class="el-icon-warning-outline"></i> Hata
												</span>
											</el-tooltip>
											<span
												v-else-if="scope.row.status === 'wait'"
												class="badge badge-white badge-md"
												><i class="el-icon-loading"></i> Bekliyor</span
											>
											<span
												v-else-if="scope.row.status === 'completed'"
												class="badge badge-success badge-md"
												><i class="el-icon-circle-check"></i> Tamamlandı</span
											>
											<span v-else class="badge badge-white badge-md"
												><i class="el-icon-top"></i> Yükleniyor</span
											>
										</template>
									</el-table-column>
									<el-table-column label="Hatalı" width="110" align="right">
										<template slot-scope="scope">
											<a
												v-if="scope.row.fail_count && scope.row.fail_count > 0"
												href="javascript:;"
												@click="openFailedRows(scope.row)"
												class="badge badge-secondary badge-md"
												><i class="el-icon-warning-outline"></i>
												{{ scope.row.fail_count }}</a
											>
											<span v-else class="text-muted">—</span>
										</template>
									</el-table-column>
									<el-table-column label="Yükleme Tarihi" width="160" align="right">
										<template slot-scope="scope">
											<small class="text-muted">
												<app-date-text :text="scope.row.created_at"></app-date-text>
											</small>
										</template>
									</el-table-column>
									<el-table-column width="80" align="right">
										<template slot-scope="scope">
											<button
												@click="deleteFile(fileIndex(scope.row))"
												class="btn btn-white btn-icon btn-rounded btn-sm i-con-h-a"
											>
												<i class="i-con i-con-trash"><i></i></i>
											</button>
										</template>
									</el-table-column>
								</el-table>
								<div class="d-flex justify-content-end p-3" v-if="form.files.length > filesPageSize">
									<el-pagination
										background
										layout="prev, pager, next"
										:total="form.files.length"
										:page-size="filesPageSize"
										:current-page.sync="filesPage"
									></el-pagination>
								</div>
							</div>
						</template>
					</app-card>
					<!--<app-card :remove-body-padding="true" title="Verimlilik Grafiği">
            <div class="mt-4 mb-5">
              <vue-funnel-graph :width="1050" :height="250" :labels="labels"
                  :values="values" :colors="colors" :sub-labels="subLabels" :direction="direction"
                  :gradient-direction="gradientDirection"
                  :animated="true" :display-percentage="true"
              ></vue-funnel-graph>
            </div>
          </app-card>-->
				</div>
			</div>
		</app-module-body>
		<el-dialog
			title="Başarısız Numaralar"
			:visible.sync="failedRowsModal.visible"
			width="720px"
			append-to-body
		>
			<div v-if="failedRowsModal.loading" class="p-4 text-center text-muted">
				<i class="el-icon-loading"></i> Yükleniyor...
			</div>
			<template v-else>
				<div
					v-if="failedRowsModal.total > failedRowsModal.limit"
					class="alert alert-warning mb-3"
				>
					<i class="el-icon-warning-outline mr-1"></i>
					Toplam <strong>{{ failedRowsModal.total }}</strong> hatalı kayıt
					bulundu. Performans için yalnızca ilk
					<strong>{{ failedRowsModal.limit }}</strong> kayıt gösteriliyor.
				</div>
				<el-table :data="failedRowsModal.rows" size="small" max-height="480">
					<el-table-column label="Ad" min-width="120">
						<template slot-scope="scope">
							<span>{{ scope.row.first_name || "—" }}</span>
						</template>
					</el-table-column>
					<el-table-column label="Soyad" min-width="120">
						<template slot-scope="scope">
							<span>{{ scope.row.last_name || "—" }}</span>
						</template>
					</el-table-column>
					<el-table-column label="Telefon" width="140">
						<template slot-scope="scope">
							<span>{{ scope.row.phone || "—" }}</span>
						</template>
					</el-table-column>
					<el-table-column label="Hata Nedeni" width="200">
						<template slot-scope="scope">
							<span class="badge badge-light badge-md">
								{{ failReasonLabel(scope.row.fail_reason) }}
							</span>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-dialog>
	</app-module>
</template>
<script>
import API from "../../../utils/API";
import { VueFunnelGraph } from "vue-funnel-graph-js";
import { mapGetters } from "vuex";
import VueApexCharts from "vue-apexcharts";

export default {
	components: {
		VueFunnelGraph,
		VueApexCharts,
	},
	data() {
		return {
			chart: {
				series: [],
				chartOptions: {
					labels: ["Meşgul", "Ulaşılamadı", "Diğer"],
					colors: ["#f15490", "#c52563", "#860236"],
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
										label: "Toplam",
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
			errors: null,
			fileUpload: false,
			filesPage: 1,
			filesPageSize: 10,
			failedRowsModal: {
				visible: false,
				loading: false,
				rows: [],
				total: 0,
				limit: 100,
			},
			form: {
				status_breakdown: [],
				files: [],
				allowed_weekdays: [],
			},
			counts: {
				success: 0,
				wait: 0,
				failed: 0,
				total: 0,
			},
			files: [],
			labels: ["Tümü", "Arananlar", "Ulaşılanlar"],
			subLabels: ["Liste"],
			values: [[0], [0], [0]],
			colors: [["#62e8f3", "#4ae24d"]],
			direction: "horizontal",
			gradientDirection: "horizontal",
			height: 250,
			width: 922,
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
		apiEndpoint: () => {
			return process.env.VUE_APP_API_ENDPOINT;
		},
		paginatedFiles() {
			const start = (this.filesPage - 1) * this.filesPageSize;
			return (this.form.files || []).slice(start, start + this.filesPageSize);
		},
	},
	beforeRouteEnter(to, from, next) {
		API.get("operation/calling-lists/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
				wm.setCounts();
			});
		});
	},
	methods: {
		setCounts() {
			this.counts.success = 0;
			this.counts.wait = 0;
			this.counts.failed = 0;
			this.counts.total = 0;
			(this.form.status_breakdown || []).forEach((item) => {
				const total = Number(item.total) || 0;
				if (item.status === "wait") {
					this.counts.wait += total;
				} else if (item.status === "failed") {
					this.counts.failed += total;
				} else {
					this.counts.success += total;
				}
				this.counts.total += total;
			});
			this.values = [
				[this.counts.total],
				[this.counts.success + this.counts.failed],
				[this.counts.success],
			];
		},
		fileUploaded() {
			this.fileUpload = false;
			this.errors = null;
			this.reloadFiles();
		},
		reloadFiles() {
			this.$api.get(
				"operation/calling-lists/" + this.form.id,
				{},
				(response) => {
					this.form = response.data.data;
					this.filesPage = 1;
					this.setCounts();
				}
			);
		},
		fileError(e) {
			this.errors = JSON.parse(e.toString().split("Error:")[1]).errors;
		},
		filterDays(days) {
			if (!Array.isArray(days) || days.length === 0) return "";

			const dayNames = {
				1: "Pazartesi",
				2: "Salı",
				3: "Çarşamba",
				4: "Perşembe",
				5: "Cuma",
				6: "Cumartesi",
				7: "Pazar",
			};
			const sorted = [...days].map(Number).sort((a, b) => a - b);
			const key = sorted.join(",");
			if (key === "1,2,3,4,5") return "Hafta içi";
			if (key === "6,7") return "Hafta sonu";
			if (key === "1,2,3,4,5,6,7") return "Her gün";
			return sorted.map((d) => dayNames[d]).join(", ");
		},
		showFileUpload() {
			this.fileUpload = true;
		},
		fileIndex(row) {
			return this.form.files.findIndex((f) => f.id === row.id);
		},
		openFailedRows(file) {
			this.failedRowsModal.visible = true;
			this.failedRowsModal.loading = true;
			this.failedRowsModal.rows = [];
			this.failedRowsModal.total = 0;
			this.$api.get(
				"operation/calling-lists/" +
					this.form.id +
					"/files/" +
					file.id +
					"/failed-rows",
				{},
				(response) => {
					const data = response.data.data || response.data;
					this.failedRowsModal.rows = data.rows || [];
					this.failedRowsModal.total = data.total || 0;
					this.failedRowsModal.limit = data.limit || 100;
					this.failedRowsModal.loading = false;
				},
				() => {
					this.failedRowsModal.loading = false;
					this.failedRowsModal.visible = false;
				}
			);
		},
		failReasonLabel(reason) {
			const map = {
				empty_phone: "Boş telefon",
				invalid_phone_length: "Geçersiz telefon uzunluğu",
			};
			return map[reason] || reason || "Bilinmeyen";
		},
		deleteFile(key) {
			let file = this.form.files[key];
			let self = this;
			self
				.$confirm(
					"Dosyayı sildiğinizde dosyaya dahil numaralar aranmayacak.",
					"Emin Misiniz?",
					{
						confirmButtonText: "Sil",
					}
				)
				.then(() => {
					this.$api.delete(
						"operation/calling-lists/" + this.form.id + "/files/" + file.id,
						{ is_active: status },
						(response) => {
							this.form.files.splice(key, 1);
							this.$message.success("Dosya silindi.");
						},
						(code, errors) => {
							this.errors = errors;
						}
					);
				});
		},
		pause() {
			let self = this;
			if (self.form.call_type === "auto") {
				self
					.$confirm(
						"Otomatik arama devam ediyor listeyi pasifleştirmek istediğinize emin misiniz?",
						"Emin Misiniz?",
						{
							confirmButtonText: "Pasifleştir",
						}
					)
					.then(() => {
						self.updateStatus(false);
					});
			} else {
				self.updateStatus(false);
			}
		},
		play() {
			let self = this;
			if (self.form.call_type === "auto") {
				self
					.$confirm(
						"Aktifleştirirseniz liste otomatik arnamaya devam edecek, emin misiniz?",
						"Emin Misiniz?",
						{
							confirmButtonText: "Aktifleştir",
						}
					)
					.then(() => {
						self.updateStatus(true);
					});
			} else {
				self.updateStatus(true);
			}
		},
		updateStatus(status) {
			this.$api.put(
				"operation/calling-lists/" + this.form.id,
				{ is_active: status },
				(response) => {
					this.form.is_active = status;
					if (status) {
						this.$message.success("Arama listesi aktifleştirildi.");
					} else {
						this.$message.success("Arama listesi pasifleştirildi.");
					}
				},
				(code, errors) => {
					this.errors = errors;
				}
			);
		},
	},
};
</script>
<style>


.el-upload-dragger {
	padding-top: 60px;
}

.el-upload {
	width: 100%;
}

.upload-demo {
	width: 100%;
}

.el-upload-dragger {
	width: 100%;
}
</style>
