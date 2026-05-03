<template>
	<div class="d-inline-block">
		<el-dialog
			:destroy-on-close="true"
			@close="clear"
			:visible.sync="visible"
			:append-to-body="true"
			:custom-class="
				selected
					? 'app-modal app-modal-media app-modal-media-large'
					: 'app-modal app-modal-media'
			"
		>
			<template slot="title">
				<div class="row">
					<div class="col">
						<h5 class="mb-0 py-3 font-weight-bold">
							<ion-icon class="mr-1" name="albums-outline"></ion-icon> Medya
							Kütüphanesi
						</h5>
					</div>
					<div class="col-auto pt-2" v-if="activeTab === 'list'">
						<el-input
							v-model="searchKey"
							@input="search"
							size="small"
							placeholder="Ara"
							prefix-icon="el-icon-search"
						></el-input>
					</div>
					<div class="col-auto pt-2 pr-5">
						<button
							v-if="activeTab === 'list'"
							class="btn btn-outline btn-light btn-rounded btn-sm mr-3"
							@click="activeTab = 'upload'"
						>
							<ion-icon name="cloud-upload-outline" class="mr-1"></ion-icon>
							Dosya Yükle
						</button>
						<button
							v-else
							class="btn btn-outline btn-light btn-rounded btn-sm  mr-3"
							@click="activeTab = 'list'"
						>
							<ion-icon name="arrow-back-outline" class="mr-1"></ion-icon>
							Kütüphaneye Geri Dön
						</button>
					</div>
				</div>
			</template>
			<div class="p-5" v-if="activeTab === 'upload'">
				<app-information type="simple" :errors="errors.create"></app-information>

				<!-- Adım 1: Dosya seçimi -->
				<el-upload
					v-if="!uploadForm.file"
					class="app-media-upload"
					drag
					action="#"
					:auto-upload="false"
					:on-change="handleFileChange"
					:show-file-list="false"
					accept=".wav"
				>
					<app-svg src="/assets/img/vectors/files.svg"></app-svg>
					<h5 class="font-weight-bold mt-1">Dosya Yükle</h5>
					<small class="pb-5 d-block">
						Dosya yüklemek için <a href="javascript:">tıklayabilir</a> veya
						dosyayı sürükleyip bırakabilirsiniz.
					</small>
				</el-upload>

				<!-- Adım 2: İsim girişi ve onay -->
				<div v-else class="text-center">
					<ion-icon
						name="musical-note-outline"
						style="font-size: 52px; color: #409eff"
					></ion-icon>
					<p class="mt-2 mb-4 text-muted">{{ uploadForm.file.name }}</p>

					<app-form-row label="Ses Dosyası Adı">
						<el-input
							v-model="uploadForm.name"
							size="medium"
							placeholder="Ses dosyasına bir isim verin"
							:autofocus="true"
						></el-input>
					</app-form-row>

					<div class="row mt-4">
						<div class="col">
							<button
								class="btn btn-light btn-sm btn-rounded w-100"
								@click="clearUpload"
							>
								Vazgeç
							</button>
						</div>
						<div class="col">
							<button
								class="btn btn-primary btn-sm btn-rounded w-100"
								@click="uploadFile"
								:disabled="!uploadForm.name || uploading"
							>
								<span v-if="uploading">Yükleniyor...</span>
								<span v-else>Yükle</span>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="row no-gutters" v-else>
				<div class="col col-100">
					<div class="p-4">
						<div class="text-center" v-if="medias.length === 0 && !loading">
							<small>Herhangi bir kayıt bulunamadı.</small>
						</div>
						<div class="row" v-else>
							<!--<div class="col-3 mb-4">
								<div class="app-media text-center pointer">
									<div style="margin-top:-10%;margin-bottom:10%;">
										<app-svg src="/assets/img/vectors/folder.svg"></app-svg>
									</div>
									<h6
										class="font-weight-bold mt-2 mb-0 badge text-sm badge-pill"
									>
										Kullanılmayan Medyalar
									</h6>
								</div>
							</div>-->
							<div class="col-3 px-4 py-3" v-for="media in medias">
								<div
									class="app-media text-center pointer"
									@click="select(media)"
									:class="{ active: selected === media }"
								>
									<div
										class="app-media-icon r-3x d-block bg-light border"
										:class="{ ' border-primary': selected === media }"
									>
										<div
											class="app-media-overlay text-center"
											style="padding-top:calc(50% - 30px)"
										>
											<ion-icon
												class="text-2x text-light"
												name="musical-note-outline"
											></ion-icon>
											<ion-icon
												class="text-2x text-primary"
												style="margin-left:-42px; opacity:0.8"
												name="musical-note-outline"
											></ion-icon>
											<h5 class="font-weight-bold mt-1 text-black-50">WAV</h5>
										</div>
									</div>
									<h6
										class="font-weight-bold mt-3 mb-1 badge badge-md text-sm badge-pill"
										:class="{ 'badge-primary': selected === media }"
									>
										{{ media.name }}
									</h6>
									<small class="text-muted d-block"
										><app-date-text :text="media.created_at"></app-date-text
									></small>
								</div>
							</div>
						</div>
						<div class="text-center mt-3" v-if="lastPage !== page || loading">
							<button
								class="btn btn-light btn-sm btn-rounded"
								@click="getMedias()"
								:disabled="loading"
							>
								<span v-if="loading">Yükleniyor...</span
								><span v-else>Daha Fazla Yükle</span>
							</button>
						</div>
					</div>
				</div>
				<div v-if="selected" class="col-4 col-100 b-l p-4 pt-4 pb-5">
					<div class="b-b pb-4 mt-2">
						<div class=" shadow-sm r-3x p-3 d-block mb-4">
							<app-audio
								:src="selected.file"
							></app-audio>
						</div>

						<h6 class="font-weight-bold mt-3">{{ selected.name }}</h6>
						<small class="text-muted d-block"
							><app-date-text :text="selected.created_at"></app-date-text>
							yüklendi</small
						>
					</div>
					<div class="py-4">
						<small class="font-weight-bold mb-2 d-block"
							>Dosya Açıklaması</small
						>
						<small v-if="selected.description" class="text-muted">{{
							selected.description
						}}</small>
						<div v-else>
							<small class="text-muted">Dosya açıklaması bulunmuyor.</small>
							<button
								class="btn btn-sm btn-rounded w-100 mt-3 btn-outline-primary"
								@click="editMediaPopperVisible = true"
							>
								Dosya Açıklaması Belirle
							</button>
						</div>
					</div>
					<div class="app-action-bottom pt-4 pb-3 px-3 b-t bg-white">
						<app-information
							class="mb-3"
							type="simple"
							:errors="errors.remove"
						></app-information>
						<div class="row row-xs">
							<div class="col text-center">
								<button
									@click="deleteMedia(selected.id)"
									class="btn btn-md btn-raised btn-wave btn-icon mb-2 r-3x i-con-h-a btn-outline-danger"
								>
									<span
										><span
											><ion-icon
												class="text-md"
												name="trash-outline"
											></ion-icon></span
									></span>
								</button>
								<small class="d-block text-danger">Sil</small>
							</div>
							<div class="col text-center">
								<a
									:href="selected.file"
									class="btn btn-md btn-raised btn-wave btn-icon mb-2 r-3x i-con-h-a btn-outline-primary"
									download
								>
									<span
										><span
											><ion-icon
												class="text-md "
												name="download-outline"
											></ion-icon></span
									></span>
								</a>
								<small class="d-block text-primary">İndir</small>
							</div>
							<div class="col  text-center">
								<el-popover
									placement="top"
									width="290"
									popper-class="app-popper"
									trigger="manual"
									v-model="editMediaPopperVisible"
								>
									<div>
										<app-information
											class=""
											type="simple"
											:errors="errors.update"
										></app-information>
										<div class="app-popper-body">
											<app-form-row label="Dosya Adı">
												<el-input size="medium" v-model="form.name"></el-input>
											</app-form-row>
											<app-form-row label="Dosya Açıklaması">
												<el-input
													type="textarea"
													:rows="3"
													size="medium"
													v-model="form.description"
												></el-input>
											</app-form-row>
										</div>
										<div class="app-popper-footer b-t">
											<div class="row row-sm">
												<div class="col">
													<button
														class="btn btn-default btn-sm btn-rounded col-md-12"
														@click="editMediaPopperVisible = false"
													>
														Vazgeç
													</button>
												</div>
												<div class="col">
													<button
														@click="update"
														class="btn btn-primary btn-sm btn-rounded col-md-12"
													>
														Kaydet
													</button>
												</div>
											</div>
										</div>
									</div>
									<div slot="reference">
										<button
											@click="editMediaPopperVisible = true"
											class="btn btn-md btn-raised btn-wave btn-icon mb-2 r-3x i-con-h-a btn-outline-primary"
										>
											<span
												><ion-icon
													class="text-md"
													name="create-outline"
												></ion-icon
											></span>
										</button>
										<small class="d-block text-primary">Düzenle</small>
									</div>
								</el-popover>
							</div>
							<div class="col text-center">
								<button
									@click="add()"
									class="btn btn-md btn-raised btn-wave btn-icon mb-2 r-3x i-con-h-a btn-outline-primary"
								>
									<span
										><ion-icon
											class="text-md"
											name="checkmark-outline"
										></ion-icon
									></span>
								</button>
								<small class="d-block text-primary">Seç</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
		<div class="d-inline-block" v-if="!value || !value.id" @click="show">
			<slot></slot>
		</div>
		<div class="d-inline-block" v-else>
			<div class="btn-light btn btn-rounded text-primary w-md pt-2 pb-0">
				<div class="row row-xs">
					<div class="col">
						<app-audio
							type="simple"
							:src="value.file"
						></app-audio>
					</div>
					<div class="col-auto">
						<span @click="remove">
							<ion-icon name="close-circle-outline"></ion-icon> Kaldır
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	props: {
		value: {
			required: true,
			default: { id: null },
		},
	},
	data() {
		return {
			searchKey: "",
			searchTimeout: null,
			loading: false,
			errors: {
				update: [],
				get: [],
				create: [],
				remove: [],
			},
			visible: false,
			selected: false,
			activeTab: "list",
			medias: [],
			form: {
				name: "",
				description: "",
			},
			uploadForm: {
				file: null,
				name: "",
			},
			uploading: false,
			editMediaPopperVisible: false,
			page: 0,
			lastPage: 1,
		};
	},
	computed: {
		...mapGetters(["currentUser", "socket"]),
		apiEndpoint: () => {
			return process.env.VUE_APP_API_ENDPOINT;
		},
	},
	methods: {
		search() {
			clearTimeout(this.searchTimeout);
			this.searchTimeout = setTimeout(() => {
				this.clear();
				this.getMedias();
			}, 500);
		},
		show() {
			this.visible = true;
			this.getMedias();
		},
		select(id) {
			this.selected = id;
			this.form = { ...id };
		},
		add() {
			this.$emit("input", this.selected);
			this.visible = false;
			this.clear();
		},
		clear() {
			this.medias = [];
			this.selected = false;
			this.activeTab = "list";
			this.loading = false;
			this.page = 0;
			this.lastPage = 1;
			this.clearUpload();
		},
		clearUpload() {
			this.uploadForm = { file: null, name: "" };
			this.uploading = false;
			this.errors.create = [];
		},
		handleFileChange(file) {
			this.uploadForm.file = file.raw;
			this.uploadForm.name = file.name.replace(/\.[^/.]+$/, "");
		},
		uploadFile() {
			if (!this.uploadForm.name || !this.uploadForm.file) return;

			this.uploading = true;
			const formData = new FormData();
			formData.append("file", this.uploadForm.file);
			formData.append("name", this.uploadForm.name);

			fetch(
				this.apiEndpoint +
					this.currentUser.customer.key +
					"/settings/dialplans/sounds",
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + this.currentUser.api_token,
						Accept: "application/json",
					},
					body: formData,
				}
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.errors) {
						this.errors.create = data.errors;
						this.uploading = false;
						return;
					}
					this.clearUpload();
					this.activeTab = "list";
					this.getMedias(true);
				})
				.catch(() => {
					this.errors.create = [{ message: "Yükleme başarısız oldu." }];
					this.uploading = false;
				});
		},
		getMedias(equal = false) {
			this.loading = true;
			this.$api.get(
				"settings/dialplans/sounds",
				{ per_page: 16, page: equal ? 1 : this.page++, q: this.searchKey },
				(response) => {
					this.loading = false;
					if (equal) this.medias = response.data.data;
					else this.medias = this.medias.concat(response.data.data);
					this.lastPage = response.data.meta.last_page;
				},
				(code, errors) => {
					this.errors.get = errors;
					this.loading = false;
				}
			);
		},
		update() {
			this.$api.put(
				"settings/dialplans/sounds/" + this.form.id,
				this.form,
				(response) => {
					this.editMediaPopperVisible = false;
					this.selected = this.form;
				},
				(code, errors) => {
					this.errors.update = errors;
				}
			);
		},
		remove() {
			this.$emit("input", { id: null });
		},
		deleteMedia(id) {
			this.$confirm("Silmek istediğinize emin misiniz?", {
				confirmButtonText: "Sil",
				cancelButtonText: "Vazgeç",
				type: "warning",
			})
				.then(() => {
					this.$api.delete(
						"settings/dialplans/sounds/" + id,
						{},
						(response) => {
							this.$message.success("Dosya silindi");
							let removeIndex = false;
							removeIndex = this.medias.findIndex((item) => item.id === id);
							if (removeIndex !== -1) {
								this.medias.splice(removeIndex, 1);
							}
							this.errors.remove = [];
						},
						(code, errors) => {
							this.errors.remove = errors;
						}
					);
				})
				.catch(() => {});
		},
	},
};
</script>
<style lang="scss">
.app-toolbar {
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9;
}
.app-media {
	transition: 0.2s;
	.app-media-action {
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		display: none;
		transition: 0.2s;
	}

	&:hover .app-media-action {
		display: block;
	}
	&:hover .app-media-icon {
		box-shadow: 0 5px 30px -12px rgba(0, 0, 0, 0.3);
		transform: scale(1.1);
	}
	&.active .app-media-icon {
		transform: scale(1.1);
	}
	.app-media-icon {
		transform: scale(1);
		box-shadow: 0 5px 20px -7px rgba(0, 0, 0, 0.1);
		padding-top: 100% !important;
		transition: 0.2s;
	}
	.app-media-overlay {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
	h6 {
		overflow: hidden !important;
		white-space: nowrap !important;
		text-overflow: ellipsis !important;
		display: inherit !important;
	}
}

.app-modal-media .el-dialog__header {
	border-bottom: 1px solid rgba(135, 150, 165, 0.1);
}
.app-modal-media {
	transition: 0.2s;
	width: 80%;
	max-width: 700px;
}

.app-modal-media-large {
	width: 80%;
	max-width: 1050px;
}

.app-modal-media .el-dialog__header {
	padding: 10px 15px 10px 15px;
}

.app-modal-media .el-dialog__body {
	height: calc(90vh - 73px) !important;
	padding: 0 !important;
}
.col-100 {
	height: calc(90vh - 75px) !important;
	overflow-y: auto;
	transition: 0.2s;
	display: inline-block;
	position: relative;
}
.app-action-bottom {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
}

.app-media-upload {
	.el-upload {
		width: 100%;
	}
	.el-upload-dragger {
		position: absolute;
		top: 10px;
		left: 10px;
		bottom: 10px;
		right: 10px;
		height: auto;
		width: auto;
		padding-top: calc(70px);
		svg {
			width: 200px;
		}
	}
}
</style>
