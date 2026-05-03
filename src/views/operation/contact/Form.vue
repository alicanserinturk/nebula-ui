<template>
	<el-popover
		placement="top"
		width="400"
		popper-class="app-popper"
		v-model="visible"
		trigger="click"
		@show="get()"
		@hide="cancel()"
	>
		<div class="d-inline-block" slot="reference">
			<slot></slot>
		</div>
		<template>
			<div class="px-4 py-4 b-b">
				<h6 class="font-weight-500 mb-0">
					Müşteri Bilgileri
					<span class="float-right" v-if="loading"
						><i class="el-icon-loading"></i
					></span>
				</h6>
			</div>
			<app-information type="simple" :errors="errors"></app-information>
			<div
				class="px-4 py-3"
				style="height:400px; overflow:auto; max-height:calc(100vh - 140px)"
			>
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
			</div>
			<div class="app-popper-footer b-t">
				<div class="row row-sm">
					<div class="col">
						<button
							class="btn btn-default btn-sm btn-rounded col-md-12"
							@click="cancel"
						>
							Vazgeç
						</button>
					</div>
					<div class="col">
						<button
							:disabled="loading"
							class="btn btn-primary btn-sm btn-rounded col-md-12"
							@click="save"
						>
							Kaydet
						</button>
					</div>
				</div>
			</div>
		</template>
	</el-popover>
</template>
<style></style>
<script>
export default {
	props: {
		contactId: {
			required: true,
		},
		contactDetail: {
			default: null,
		},
	},
	data() {
		return {
			errors: [],
			visible: false,
			loading: false,
			form: {
				id: null,
				name: null,
				surname: null,
				birth_day: null,
				email: null,
				number: null,
				gender: null,
				identity_number: null,
				is_risky: false,
				is_block: false,
			},
		};
	},
	methods: {
		get() {
			if (this.contactDetail) {
				this.form = { ...this.contactDetail };
				return;
			}

			this.loading = true;
			this.$api.get(
				"operation/contacts/" + this.contactId,
				{},
				(response) => {
					this.form = response.data.data;
					this.loading = false;
				},
				(code, errors) => {
					this.errors = errors;
					this.loading = false;
				}
			);
		},
		cancel() {
			this.visible = false;
			this.errors = [];
			this.form = {};
			this.loading = false;
		},
		save() {
			this.loading = true;

			const payload = {
				name: this.form.name,
				surname: this.form.surname,
				email: this.form.email,
				identity_number: this.form.identity_number,
				gender: this.form.gender,
				birth_day: this.form.birth_day,
				address: this.form.address,
			};

			this.$api.put(
				"operation/contacts/" + this.contactId,
				payload,
				(response) => {
					this.cancel();
				},
				(code, errors) => {
					this.errors = errors;
					this.loading = false;
				}
			);
		},
	},
};
</script>
