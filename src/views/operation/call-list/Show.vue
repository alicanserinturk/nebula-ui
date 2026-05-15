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
							<small class="mb-3 d-block text-muted">
								<i class="el-icon-info-circle"></i> Dikkat Etmeniz Gerekenler
							</small>
							<ul class="list-tips mb-3">
								<li>
									<i class="el-icon-document text-primary mr-2"></i>
									<span>
										<strong>CSV</strong>, <strong>XLS</strong> veya
										<strong>XLSX</strong> formatında, 2MB altında olmalıdır.
									</span>
								</li>
								<li>
									<i class="el-icon-files text-primary mr-2"></i>
									<span>
										Birden fazla sayfa varsa <strong>sadece ilk sayfa</strong>
										dikkate alınır.
									</span>
								</li>
								<li>
									<i class="el-icon-magic-stick text-primary mr-2"></i>
									<span>
										Dosyayı seçtikten sonra açılacak ekranda
										<strong>hangi kolonun hangi alana</strong> karşılık geldiğini
										seçeceksiniz.
									</span>
								</li>
								<li>
									<i class="el-icon-phone-outline text-primary mr-2"></i>
									<span>
										Sadece <strong>Telefon</strong> alanı zorunludur. Diğer
										alanlar boş bırakılabilir.
									</span>
								</li>
							</ul>
							<app-form-row
								class="i-con-h-a"
								label="Arama Listesi"
								description="CSV, XLS veya XLSX dosyası seçin. 2MB altında olmalı."
							>
								<el-upload
									class="upload-demo"
									accept=".csv,.xls,.xlsx"
									action=""
									drag
									:auto-upload="false"
									:show-file-list="false"
									:on-change="onFileSelected"
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
				</div>
			</div>
		</app-module-body>
		<el-dialog
			title="Kolonları Eşleştirin"
			:visible.sync="mapper.visible"
			width="820px"
			append-to-body
			:close-on-click-modal="false"
			:before-close="closeMapper"
		>
			<div v-if="mapper.rows.length > 0">
				<p class="mb-3 text-muted">
					Toplam <strong>{{ mapper.rows.length }}</strong> satır bulundu.
					Aşağıda dosyanın ilk satırlarını görüyorsunuz. Hangi kolonun hangi
					alana karşılık geldiğini seçin.
					<span class="text-danger">*</span> Telefon zorunludur.
				</p>

				<div class="mapper-preview-wrap mb-3">
					<el-table
						:data="mapperPreview"
						size="small"
						border
						max-height="200"
					>
						<el-table-column
							v-for="(h, idx) in mapper.header"
							:key="idx"
							:label="h || 'Kolon ' + (idx + 1)"
							:prop="String(idx)"
							min-width="120"
						>
							<template slot-scope="scope">
								<span>{{ scope.row[idx] }}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<div class="row">
					<div
						class="col-md-6 mb-3"
						v-for="field in targetFields"
						:key="field.key"
					>
						<label class="d-block mb-1">
							{{ field.label }}
							<span v-if="field.required" class="text-danger">*</span>
						</label>
						<el-select
							v-model="mapper.mapping[field.key]"
							placeholder="— Seçiniz —"
							clearable
							style="width: 100%"
						>
							<el-option
								v-for="(h, idx) in mapper.header"
								:key="idx"
								:label="(h || 'Kolon ' + (idx + 1)) + sampleHint(idx)"
								:value="idx"
							></el-option>
						</el-select>
					</div>
				</div>
				<div class="mt-2">
					<label class="d-block mb-1">Atanacak Kullanıcılar</label>
					<p class="text-muted small mb-2">
						Bu dosyadan oluşturulacak görevler seçilen kullanıcılara eşit
						olarak dağıtılır. Boş bırakılırsa görevler atanmadan oluşturulur.
					</p>
					<app-form-user-select
						:multiple="true"
						v-model="mapper.userIds"
					></app-form-user-select>
				</div>
			</div>

			<span slot="footer">
				<el-button @click="closeMapper">İptal</el-button>
				<el-button
					type="primary"
					:disabled="!canSubmitMapping || mapper.uploading"
					:loading="mapper.uploading"
					@click="submitMapping"
				>
					Yükle
				</el-button>
			</span>
		</el-dialog>

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
import { mapGetters } from "vuex";
import * as XLSX from "xlsx";
import Axios from "axios";

export default {
	data() {
		return {
			errors: null,
			fileUpload: false,
			filesPage: 1,
			filesPageSize: 10,
			mapper: {
				visible: false,
				rows: [],
				header: [],
				mapping: {
					name: "",
					surname: "",
					phone: "",
					email: "",
					gender: "",
					birth_date: "",
					identity_number: "",
				},
				userIds: [],
				sourceFileName: "",
				uploading: false,
			},
			targetFields: [
				{ key: "name", label: "Ad" },
				{ key: "surname", label: "Soyad" },
				{ key: "phone", label: "Telefon", required: true },
				{ key: "email", label: "E-posta" },
				{ key: "gender", label: "Cinsiyet" },
				{ key: "birth_date", label: "Doğum Tarihi" },
				{ key: "identity_number", label: "TC Kimlik No" },
			],
			failedRowsModal: {
				visible: false,
				loading: false,
				rows: [],
				total: 0,
				limit: 100,
			},
			form: {
				files: [],
				allowed_weekdays: [],
			},
			files: [],
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
		paginatedFiles() {
			const start = (this.filesPage - 1) * this.filesPageSize;
			return (this.form.files || []).slice(start, start + this.filesPageSize);
		},
		mapperPreview() {
			return (this.mapper.rows || []).slice(0, 5);
		},
		canSubmitMapping() {
			return (
				this.mapper.mapping.phone !== undefined &&
				this.mapper.mapping.phone !== null &&
				this.mapper.mapping.phone !== ""
			);
		},
	},
	beforeRouteEnter(to, from, next) {
		API.get("operation/calling-lists/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	methods: {
		reloadFiles() {
			this.$api.get(
				"operation/calling-lists/" + this.form.id,
				{},
				(response) => {
					this.form = response.data.data;
					this.filesPage = 1;
				}
			);
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
		decodeCsvBytes(bytes) {
			let buf = bytes;
			if (
				buf.length >= 3 &&
				buf[0] === 0xef &&
				buf[1] === 0xbb &&
				buf[2] === 0xbf
			) {
				buf = buf.slice(3);
			}
			try {
				const utf8 = new TextDecoder("utf-8", { fatal: true });
				return utf8.decode(buf);
			} catch (e) {
				try {
					const tr = new TextDecoder("windows-1254");
					return tr.decode(buf);
				} catch (e2) {
					return new TextDecoder("iso-8859-9").decode(buf);
				}
			}
		},
		onFileSelected(file) {
			if (!file || !file.raw) return;

			const allowed = [".csv", ".xls", ".xlsx"];
			const name = (file.name || "").toLowerCase();
			if (!allowed.some((ext) => name.endsWith(ext))) {
				this.$message.error("Sadece CSV, XLS veya XLSX dosyaları yüklenebilir.");
				return;
			}
			if (file.size > 2 * 1024 * 1024) {
				this.$message.error("Dosya 2MB sınırını aşıyor.");
				return;
			}

			const isCsv = name.endsWith(".csv");

			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = new Uint8Array(e.target.result);
					let wb;
					if (isCsv) {
						const text = this.decodeCsvBytes(data);
						wb = XLSX.read(text, { type: "string" });
					} else {
						wb = XLSX.read(data, { type: "array", cellDates: false });
					}
					const firstSheet = wb.Sheets[wb.SheetNames[0]];
					if (!firstSheet) {
						this.$message.error("Dosyada okunabilir sayfa bulunamadı.");
						return;
					}
					const aoa = XLSX.utils.sheet_to_json(firstSheet, {
						header: 1,
						raw: true,
						defval: "",
						blankrows: false,
					});
					if (aoa.length === 0) {
						this.$message.error("Dosya boş.");
						return;
					}

					const firstRow = aoa[0] || [];
					const looksLikeHeader = this.detectHeader(firstRow);
					const header = looksLikeHeader
						? firstRow.map((v) => (v == null ? "" : String(v)))
						: firstRow.map((_, i) => "Kolon " + (i + 1));
					const rows = looksLikeHeader ? aoa.slice(1) : aoa;

					this.mapper.sourceFileName = file.name || "";
					this.mapper.header = header;
					this.mapper.rows = rows;
					this.mapper.mapping = this.autoMapColumns(header, rows[0] || []);
					this.mapper.visible = true;
					this.fileUpload = false;
				} catch (err) {
					this.$message.error("Dosya okunamadı. Format hatalı olabilir.");
				}
			};
			reader.onerror = () => {
				this.$message.error("Dosya okunamadı.");
			};
			reader.readAsArrayBuffer(file.raw);
		},
		detectHeader(row) {
			if (!row || row.length === 0) return false;
			let phoneLikeIdx = -1;
			for (let i = 0; i < row.length; i++) {
				const cell = row[i];
				if (typeof cell === "number") return false;
				const s = String(cell || "").trim();
				const digits = s.replace(/\D/g, "");
				if (digits.length >= 10) {
					phoneLikeIdx = i;
					break;
				}
			}
			return phoneLikeIdx === -1;
		},
		autoMapColumns(header, sampleRow) {
			const guesses = {
				name: [/^ad$/i, /isim/i, /first.*name/i, /^name$/i],
				surname: [/soyad/i, /last.*name/i, /^surname$/i],
				phone: [/telefon/i, /^tel$/i, /^tel\b/i, /phone/i, /gsm/i, /\bcep\b/i, /numara/i],
				email: [/e.?mail/i, /e.?posta/i],
				gender: [/cinsiyet/i, /gender/i],
				birth_date: [/doğum/i, /dogum/i, /birth/i, /^tarih$/i, /^d\.?tarih/i],
				identity_number: [/tc.?kim/i, /kimlik/i, /tckn/i, /^tc$/i, /identity/i],
			};
			const mapping = {
				name: "",
				surname: "",
				phone: "",
				email: "",
				gender: "",
				birth_date: "",
				identity_number: "",
			};
			Object.keys(guesses).forEach((field) => {
				for (let i = 0; i < header.length; i++) {
					const cell = String(header[i] || "").trim();
					if (cell && guesses[field].some((rx) => rx.test(cell))) {
						mapping[field] = i;
						return;
					}
				}
			});
			if (mapping.phone === "") {
				for (let i = 0; i < (sampleRow || []).length; i++) {
					const v = sampleRow[i];
					const s = typeof v === "number" ? String(Math.round(v)) : String(v || "");
					if (s.replace(/\D/g, "").length >= 10) {
						mapping.phone = i;
						break;
					}
				}
			}
			return mapping;
		},
		sampleHint(idx) {
			const row = this.mapper.rows[0];
			if (!row) return "";
			const v = row[idx];
			if (v === undefined || v === null || v === "") return "";
			const s = typeof v === "number" ? String(v) : String(v);
			const trimmed = s.length > 20 ? s.substring(0, 20) + "…" : s;
			return "  (örn: " + trimmed + ")";
		},
		closeMapper() {
			this.mapper.visible = false;
			this.mapper.rows = [];
			this.mapper.header = [];
			this.mapper.mapping = {
				name: "",
				surname: "",
				phone: "",
				email: "",
				gender: "",
				birth_date: "",
				identity_number: "",
			};
			this.mapper.userIds = [];
			this.mapper.sourceFileName = "";
			this.fileUpload = true;
		},
		submitMapping() {
			if (!this.canSubmitMapping || this.mapper.uploading) return;
			this.mapper.uploading = true;

			let csvText;
			try {
				const csvRows = this.mapper.rows.map((row) => this.normalizeRow(row));
				const filtered = csvRows.filter((r) => r[2] && r[2].length > 0);
				csvText = filtered.map((r) => r.join(";")).join("\n");
			} catch (e) {
				this.mapper.uploading = false;
				this.$message.error("Dosya hazırlanırken hata oluştu.");
				return;
			}

			const blob = new Blob([csvText], {
				type: "text/csv;charset=utf-8",
			});
			const fd = new FormData();
			const baseName = (this.mapper.sourceFileName || "list").replace(
				/\.[^.]+$/,
				""
			);
			fd.append("file", blob, baseName + ".csv");
			(this.mapper.userIds || []).forEach((uid) => {
				fd.append("user_ids[]", uid);
			});

			const url =
				process.env.VUE_APP_API_ENDPOINT +
				this.currentUser.customer.key +
				"/operation/calling-lists/" +
				this.form.id +
				"/files";

			Axios.post(url, fd, {
				headers: {
					Authorization: "Bearer " + this.currentUser.api_token,
					Accept: "application/json",
				},
			})
				.then(() => {
					this.mapper.uploading = false;
					this.mapper.visible = false;
					this.mapper.rows = [];
					this.mapper.header = [];
					this.mapper.mapping = {
						name: "",
						surname: "",
						phone: "",
						email: "",
						gender: "",
						birth_date: "",
						identity_number: "",
					};
					this.mapper.userIds = [];
					this.errors = null;
					this.$message.success("Dosya yüklendi, işleniyor.");
					this.reloadFiles();
				})
				.catch((err) => {
					this.mapper.uploading = false;
					if (err.response && err.response.status === 422) {
						this.errors = err.response.data.errors;
						this.$message.error("Dosya doğrulanamadı.");
					} else {
						this.$message.error("Dosya yüklenemedi.");
					}
				});
		},
		normalizeRow(row) {
			const get = (field) => {
				const idx = this.mapper.mapping[field];
				if (idx === undefined || idx === null || idx === "") return "";
				return row[idx];
			};
			return [
				this.normalizeText(get("name"), 100),
				this.normalizeText(get("surname"), 100),
				this.normalizePhone(get("phone")),
				this.normalizeEmail(get("email")),
				this.normalizeGender(get("gender")),
				this.normalizeBirthDate(get("birth_date")),
				this.normalizeText(get("identity_number"), 64),
			];
		},
		normalizeText(v, maxLen) {
			if (v === undefined || v === null) return "";
			let s = (typeof v === "number" ? String(v) : String(v)).trim();
			if (s.length === 0) return "";
			s = s.replace(/[\r\n;]/g, " ");
			if (/^[=+\-@\t]/.test(s)) s = "'" + s;
			if (s.length > maxLen) s = s.substring(0, maxLen);
			return s;
		},
		normalizePhone(v) {
			if (v === undefined || v === null || v === "") return "";
			let s = typeof v === "number" ? String(Math.round(v)) : String(v);
			s = s.replace(/\D/g, "");
			if (s.length === 13 && s.startsWith("900")) s = s.substring(3);
			if (s.length === 12 && s.startsWith("90")) s = s.substring(2);
			if (s.length === 11 && s.startsWith("0")) s = s.substring(1);
			return s;
		},
		normalizeEmail(v) {
			if (v === undefined || v === null || v === "") return "";
			const s = String(v).trim().toLowerCase();
			if (s.length > 100) return "";
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "";
			return s;
		},
		normalizeGender(v) {
			if (v === undefined || v === null || v === "") return "";
			const s = String(v).trim().toLowerCase();
			if (/^(e|erkek|bay|m|male|man)$/.test(s)) return "male";
			if (/^(k|kadın|kadin|bayan|f|female|woman)$/.test(s)) return "female";
			if (/^(diğer|diger|other|o)$/.test(s)) return "other";
			return "";
		},
		normalizeBirthDate(v) {
			if (v === undefined || v === null || v === "") return "";
			if (typeof v === "number" && v > 0 && v < 2958466) {
				const days = Math.floor(v);
				const ms = days * 86400000;
				const date = new Date(Date.UTC(1899, 11, 30) + ms);
				return this.toIsoDate(date);
			}
			const s = String(v).trim();
			if (s === "") return "";
			let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
			if (m) return this.validIsoDate(m[1], m[2], m[3]);
			m = s.match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})$/);
			if (m) return this.validIsoDate(m[3], m[2], m[1]);
			m = s.match(/^(\d{4})[.\/](\d{1,2})[.\/](\d{1,2})$/);
			if (m) return this.validIsoDate(m[1], m[2], m[3]);
			return "";
		},
		toIsoDate(date) {
			if (isNaN(date.getTime())) return "";
			const y = date.getUTCFullYear();
			const m = String(date.getUTCMonth() + 1).padStart(2, "0");
			const d = String(date.getUTCDate()).padStart(2, "0");
			return y + "-" + m + "-" + d;
		},
		validIsoDate(y, m, d) {
			const Y = parseInt(y, 10);
			const M = parseInt(m, 10);
			const D = parseInt(d, 10);
			if (isNaN(Y) || isNaN(M) || isNaN(D)) return "";
			if (Y < 1900 || Y > 2100) return "";
			if (M < 1 || M > 12) return "";
			if (D < 1 || D > 31) return "";
			const date = new Date(Date.UTC(Y, M - 1, D));
			if (
				date.getUTCFullYear() !== Y ||
				date.getUTCMonth() !== M - 1 ||
				date.getUTCDate() !== D
			)
				return "";
			return (
				Y + "-" + String(M).padStart(2, "0") + "-" + String(D).padStart(2, "0")
			);
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

.list-tips {
	list-style: none;
	padding-left: 0;
}
.list-tips li {
	display: flex;
	align-items: flex-start;
	padding: 6px 10px;
	font-size: 13px;
	line-height: 1.5;
	border-radius: 4px;
}
.list-tips li:hover {
	background: #f7fafc;
}
.list-tips li i {
	font-size: 16px;
	margin-top: 2px;
	flex-shrink: 0;
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
