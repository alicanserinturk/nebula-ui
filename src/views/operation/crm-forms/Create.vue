<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					@click="$router.back()"
					class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					<i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> Geri
				</button>
				<button
					@click="previewVisible = true"
					class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					<i class="i-con i-con-eye float-left mr-2"><i></i></i> Önizleme
				</button>
				<button
					@click="save"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a"
				>
					{{ $t("action.save") }}
					<i class="el-icon-loading ml-2" v-if="loading"></i>
					<i v-else class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-warning></app-warning>
			<el-dialog
				custom-class="app-modal"
				:visible.sync="previewVisible"
				:append-to-body="true"
			>
				<div slot="title">
					<h5 class="font-weight-bold mb-0">Önizleme</h5>
				</div>
				<Preview :form="form"></Preview>
				<div class="text-right" slot="footer">
					<button
						@click="previewVisible = false"
						class="btn btn-rounded btn-light mr-2"
					>
						Düzenlemeye Devam Et
					</button>
					<button @click="save" class="btn btn-rounded btn-primary i-con-h-a">
						{{ $t("action.save") }}
						<i class="el-icon-loading ml-2" v-if="loading"></i>
						<i v-else class="i-con i-con-arrow-right float-right ml-2"
							><i></i
						></i>
					</button>
				</div>
			</el-dialog>
			<div class="app-module-frame">
				<div class="app-module-main">
					<!--<div class="p-4">
                <div class="col-4 mx-auto text-center">
                  <app-svg src="/assets/img/vectors/drop-design.svg"></app-svg>
                  <small>Form elemanlarını sürükleyip buraya bırakarak ekleyebilirsiniz.</small>
                </div>
              </div>-->

					<!--<draggable :list="fieldTypes"
                :group="{ name: 'types', pull: 'clone', put: false }"
                :clone="addType">
                
              </draggable>-->
					<div class="app-custom-fields">
						<div
							v-if="form.fields.length === 0"
							class="mx-auto text-center pb-3 pt-5"
						>
							<app-svg
								src="/assets/img/vectors/drop-design.svg"
								class="col-4 mx-auto"
							></app-svg>
							<h6 class="font-weight-bold">Form alanı bulunmuyor</h6>
							<small
								>"Form Alanı Ekle" butonuna tıklayarak yeni alan
								oluşturabilirsiniz.</small
							>
						</div>
						<app-card
							@click.native="activeFieldIndex = index"
							class="app-custom-field"
							:class="{ 'app-custom-field-active': index === activeFieldIndex }"
							:remove-body-padding="true"
							v-for="(item, index) in form.fields"
							:key="index"
						>
							<div class="p-4">
								<div class="row">
									<div class="col">
										<h6 class="font-weight-bold mb-1">
											<ion-icon
												class="mr-1"
												:name="getFieldIcon(item.type).replace('-outline','')"
											></ion-icon>
											<span v-if="item.label && item.label !== ''">{{
												item.label
											}}</span>
											<span class="text-muted" v-else>Başlıksız Alan</span>
										</h6>
										<small class="text-muted" v-if="item.description">{{
											item.description
										}}</small>
									</div>
									<div class="col-auto text-right text-md">
										<ion-icon
											name="trash-outline"
											class="pointer"
											@click="removeField(index)"
										></ion-icon>
									</div>
								</div>
							</div>

							<div
								class="div text-left pb-3 pt-4 px-4 b-t"
								v-if="index === activeFieldIndex"
							>
								<div class="row">
									<div class="col">
										<app-form-row
											label="Tanım"
											description='"İkamet Adresi" veya "Kan Grubu" gibi bir tanım belirleyebilirsiniz.'
										>
											<el-input v-model="item.label"></el-input>
										</app-form-row>
									</div>
									<div class="col">
										<app-form-row
											label="Tür"
											description="Varsayılan olarak alanın hangi veriyle dolu geleceğini belirleyebilirsiniz."
										>
											<el-select
												@input="fixTypeRequireds(index)"
												popper-class="app-field-types-select"
												v-model="item.type"
											>
												<el-option
													:label="fieldType.title"
													:value="fieldType.key"
													v-for="fieldType in fieldTypes"
													:key="fieldType.key"
												>
													<div class="row row-xs">
														<div class="col-auto">
															<ion-icon
																:name="fieldType.icon + '-outline'"
															></ion-icon>
														</div>
														<div class="col-auto">{{ fieldType.title }}</div>
													</div>
													<small
														v-if="
															fieldType.description &&
																fieldType.description !== ''
														"
														class="d-block mt-0 mb-2 text-muted"
														style="line-height:1"
														>{{ fieldType.description }}</small
													>
												</el-option>
											</el-select>
										</app-form-row>
									</div>
								</div>
								<div class="mb-2">
									<app-form-row
										label="Seçenekler"
										v-if="item.type === 'select'"
									>
										<div class="mb-3" v-for="(option, oIndex) in item.options" :key="oIndex">
											<div class="row row-sm">
												<div class="col">
													<el-input
														v-model="option.value"
														:placeholder="'Seçenek ' + (oIndex + 1)"
													></el-input>
												</div>
												<div class="col-auto pt-2">
													<ion-icon
														name="trash-outline"
														class="pointer"
														@click="removeOption(index, oIndex)"
													></ion-icon>
												</div>
											</div>
										</div>
										<div class="pt-0 pb-1">
											<a
												class="text-primary font-weight-500"
												@click="addOption(index)"
											>
												<ion-icon name="add-outline" class="mr-1"></ion-icon>
												Senenek Ekle
											</a>
										</div>
									</app-form-row>
								</div>
								<app-form-row
									label="Açıklama"
									description="İlgili alan doldurulurken müşteri temsilcisini yönlendirecek bir açıklama girebilirsiniz."
								>
									<el-input v-model="item.description"></el-input>
								</app-form-row>
							</div>
						</app-card>
					</div>
					<div class="text-center pb-5" style="position:sticky; bottom:0;">
						<el-popover
							placement="top"
							width="350"
							trigger="click"
							v-model="addFieldPopoverVisible"
						>
							<div class="pt-3 px-0 ">
								<div class="row row-sm">
									<div
										class="col-4 text-center pointer mb-4"
										@click="addField(item.key)"
										v-for="(item, index) in fieldTypes"
										:key="'type-' + index"
									>
										<ion-icon
											style="font-size:24px"
											class="mb-1"
											:name="item.icon + '-outline'"
										></ion-icon>
										<small class="d-block mb-1">{{ item.title }}</small>
									</div>
								</div>
							</div>
							<button
								slot="reference"
								class="btn btn-white btn-rounded text-primary"
							>
								<ion-icon name="add-outline" class="mr-1"></ion-icon> Form Alanı
								Ekle
							</button>
						</el-popover>
					</div>
				</div>
				<div class="app-module-sidebar">
					<app-card title="Form Bilgileri">
						<app-form-row label="Alan Adı">
							<el-input
								autocomplete="false"
								auto-complete="false"
								v-model="form.name"
								prefix-icon="el-icon-tickets"
								size="medium"
							></el-input>
						</app-form-row>
						<app-form-row
							label="Numara"
							description="Form alanlarının hangi numaradan giden veya gelen çağrılarda görünür olacağını belirleyin."
						>
							<app-select
								v-model="form.number"
								source="settings/numbers"
								:label="['name']"
							>
								<template slot-scope="props">{{ props.row.name }}</template>
							</app-select>
						</app-form-row>
						<app-form-row
							label="Açıklama"
							description="Açıklamalar temsilciler tarafından görülebilir."
						>
							<el-input
								autocomplete="false"
								auto-complete="false"
								v-model="form.description"
								type="textarea"
								size="medium"
							></el-input>
						</app-form-row>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<style></style>
<script>
import API from "../../../utils/API";
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import Preview from "./Preview";

export default {
	components: {
		draggable,
		Preview,
	},
	data() {
		return {
			previewVisible: false,
			loading: false,
			addFieldPopoverVisible: false,
			activeFieldIndex: 0,
			form: {
				name: null,
				description: null,
				number: {},
				fields: [
					{
						label: "",
						description: "",
						type: "select",
						options: [
							{
								value: "Seçenek 1",
								default_value: false,
							},
						],
					},
				],
			},
			fieldTypes: [
				{ key: "text", title: "Metin", description: "", icon: "text" },
				{
					key: "paragraph",
					title: "Paragraf",
					description: "Adres, açıklama ve uzun notlar için daha kullanışlıdır",
					icon: "document-text",
				},
				{
					key: "number",
					title: "Sayı",
					description: "Yalnızca numara girişleri için kullanılabilir",
					icon: "apps",
				},
				{
					key: "select",
					title: "Çoktan Seçmeli",
					description:
						"Sizin belirleyeceğiniz cevaplar arasından seçim yapılmasını sağlayabilirsiniz",
					icon: "albums",
				},
				{
					key: "checkbox",
					title: "Onay Kutucuğu",
					description: "",
					icon: "checkbox",
				},
				{ key: "rate", title: "Puan", description: "", icon: "star" },
				{
					key: "date",
					title: "Tarih",
					description: "",
					icon: "calendar-number",
				},
				{
					key: "datetime",
					title: "Tarih ve Saat",
					description: "",
					icon: "calendar",
				},
				{ key: "time", title: "Saat", description: "", icon: "time" },
			],
		};
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.id) {
			API.get("operation/crm/forms/" + to.params.id, {}, (response) => {
				next((wm) => {
					wm.form = {
						...response.data,
					};
				});
			});
		} else {
			next();
		}
	},
	computed: {
		...mapGetters(["currentUser"]),
	},
	created() {},
	methods: {
		fixTypeRequireds(index) {
			if (this.form.fields[index].type != "select") {
				this.form.fields[index].options = null;
			} else {
				this.form.fields[index].options = [
					{
						value: "Seçenek 1",
						default_value: false,
					},
				];
			}
		},
		addOption(fieldIndex) {
			this.form.fields[fieldIndex].options.push({
				value: "",
				default_value: false,
			});
		},
		removeOption(fieldIndex, optionIndex) {
			this.form.fields[fieldIndex].options.splice(optionIndex, 1);
		},
		addField(type) {
			this.form.fields.push({
				label: "",
				description: "",
				type: type,
				options:
					type == "select"
						? [
								{
									value: "",
									default_value: false,
								},
						  ]
						: null,
			});
			this.activeFieldIndex = this.form.fields.length - 1;
			this.addFieldPopoverVisible = false;
			this.$nextTick(() => {
				window.scrollTo(0, document.body.scrollHeight);
			});
		},
		removeField(index) {
			this.form.fields.splice(index, 1);
		},
		addType(data) {
			return {
				type: data.key,
				label: "",
				default_valute: "",
				description: "",
				options: [],
			};
		},
		getFieldIcon(type) {
			let icon;
			this.fieldTypes.forEach((item) => {
				if (item.key === type) {
					icon = item.icon;
				}
			});
			return icon + "-outline";
		},
		save() {
			if (this.$route.params.id) {
				this.update();
			} else {
				this.store();
			}
		},
		store() {
			this.loading = true;
			this.$api.post(
				"operation/crm/forms",
				this.form,
				(response) => {
					this.$router.push("/operation/crm-forms/" + response.data.data.id);
					this.loading = false;
				},
				() => {
					this.loading = false;
				}
			);
		},
		update() {
			this.loading = true;
			this.$api.put(
				"operation/crm/forms/" + this.form.id,
				this.form,
				(response) => {
					this.$router.push("/operation/crm-forms/" + this.$route.params.id);
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
<style lang="scss">
html {
	scroll-behavior: smooth;
}
.app-field-types-select {
	width: 200px;
}
.app-field-types-select .el-select-dropdown__item {
	height: auto;
}
.app-custom-field .card {
	cursor: pointer;
	transition: all 0.3s;
	&:hover {
		box-shadow: 0 0 22px -5px rgba(0, 0, 0, 0.1) !important;
		border: 2 solid transparent !important;
	}
}
.app-custom-field-active .card {
	cursor: default !important;
	box-shadow: 0 0 22px -5px rgba(0, 0, 0, 0.1) !important;
	border-left: 2px solid var(--primary-color) !important;
	border-right: 1px solid transparent !important;
	border-top: 1px solid transparent !important;
	border-bottom: 1px solid transparent !important;
	&:hover {
		box-shadow: 0 0 22px -5px rgba(0, 0, 0, 0.1) !important;
		border-left: 2px solid var(--primary-color) !important;
	}
}
</style>
