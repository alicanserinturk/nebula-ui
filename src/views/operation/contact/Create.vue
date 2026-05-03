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
					@click="save"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a"
				>
					{{ $t("action.save") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-information :errors="errors"></app-information>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card title="Müşteri Bilgileri">
						<div class="row row-sm">
							<div class="col-md-6">
								<app-form-row label="Ad">
									<el-input
										type="text"
										size="medium"
										v-model="form.name"
									></el-input>
								</app-form-row>
							</div>
							<div class="col-md-6">
								<app-form-row label="Soyad">
									<el-input
										type="text"
										size="medium"
										v-model="form.surname"
									></el-input>
								</app-form-row>
							</div>
						</div>
						<app-form-row label="Cinsiyet">
							<el-radio-group size="medium" v-model="form.gender">
								<el-radio border label="male">
									<i class="el-icon-male"></i> Erkek
								</el-radio>
								<el-radio border label="female">
									<i class="el-icon-female"></i> Kadın
								</el-radio>
								<el-radio border label="other">
									Diğer
								</el-radio>
							</el-radio-group>
						</app-form-row>
						<app-form-row
							label="Telefon Numarası"
							:description="
								form.id
									? 'Telefon numarasının güncelleyebilmek için sistem yöneticinize danışın.'
									: ''
							"
						>
							<el-input
								:disabled="form.id"
								type="text"
								prefix-icon="el-icon-phone"
								size="medium"
								v-model="form.number"
							></el-input>
						</app-form-row>
						<app-form-row label="E-posta Adresi">
							<el-input
								type="text"
								prefix-icon="el-icon-message"
								size="medium"
								v-model="form.email"
							></el-input>
						</app-form-row>
						<app-form-row label="Adres">
							<el-input
								type="textarea"
								:rows="4"
								size="medium"
								v-model="form.address"
							></el-input>
						</app-form-row>
					</app-card>
				</div>
				<div class="app-module-sidebar">
					<app-card title="Kişisel Bilgiler">
						<app-form-row label="Kimlik Numarası">
							<el-input
								type="text"
								size="medium"
								v-model="form.identity_number"
							></el-input>
						</app-form-row>
						<app-form-row label="Doğum Tarihi">
							<el-date-picker
								format="dd MMM yyyy"
								value-format="yyyy-MM-dd"
								v-model="form.birth_day"
								type="date"
								placeholder="Doğum Tarihi Seçin"
							>
							</el-date-picker>
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

export default {
	data() {
		return {
			errors: null,
			form: {
				name: null,
				surname: null,
				birth_day: null,
				email: null,
				number: null,
				gender: null,
				identity_number: "",
				is_risky: false,
				is_block: false,
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.id) {
			API.get("operation/contacts/" + to.params.id, {}, (response) => {
				next((wm) => {
					wm.form = response.data.data;
				});
			});
		} else {
			next();
		}
	},
	methods: {
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
				"operation/contacts",
				this.form,
				(response) => {
					this.$router.push("/operation/contact/" + response.data.data.id);
					this.loading = false;
					this.errors = null;
				},
				(code, errors) => {
					this.loading = false;
					this.errors = errors;
				}
			);
		},
		update() {
			this.loading = true;
			this.$api.put(
				"operation/contacts/" + this.form.id,
				this.form,
				(response) => {
					this.$router.push("/operation/contact/" + this.$route.params.id);
					this.loading = false;
					this.errors = null;
				},
				(code, errors) => {
					this.loading = false;
					this.errors = errors;
				}
			);
		},
	},
};
</script>
