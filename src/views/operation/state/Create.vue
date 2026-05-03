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
					<i class="el-icon-loading ml-2" v-if="loading"></i>
					<i v-else class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-warning></app-warning>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card title="Hat Durumu">
						<app-form-row label="Tanım">
							<el-input
								autocomplete="false"
								auto-complete="false"
								v-model="form.name"
								prefix-icon="el-icon-tickets"
								size="medium"
							></el-input>
						</app-form-row>
						<app-form-row
							label="Çalışma Süresine Dahil Et"
							description="Hat durumlarında özel sayılabilecek ve çalışma süresi olarak hesaplanmayacak alanlar için bu alanı aktif edebilirsiniz."
						>
							<el-switch v-model="form.included"></el-switch>
						</app-form-row>
						<app-form-row
							label="Dahil Edilecek Maksimum Süre"
							description="Kullanıcının hat durumunda geçirdiği sürenin en fazla ne kadarının çalışma süresine ekleneceğini temsil eder."
						>
							<el-input size="medium" v-model="form.max_included_time" prefix-icon="el-icon-refresh-right">
								<span class="el-input__icon mr-2" slot="suffix">Dakika</span>
							</el-input>
						</app-form-row>
					</app-card>
				</div>
				<div class="app-module-sidebar">
					<app-card title="Görünürlük">
						<app-form-row
							label="Durum"
							description="Pasif durumdaki hat durumları temsilciler tarafından görülmez ve kullanılamaz ancak raporlarda görülmeye devam eder."
						>
							<el-radio-group v-model="form['is_active']" size="medium">
								<el-radio :label="true" border>Aktif</el-radio>
								<el-radio :label="false" border>Pasif</el-radio>
							</el-radio-group>
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

export default {
	data() {
		return {
			loading: false,
			form: {
				name: "",
				description: "",
				included: true,
				max_included_time: 30,
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.id) {
			API.get("operation/states/" + to.params.id, {}, (response) => {
				next((wm) => {
					wm.form = {
						...response.data.data,
						expirations: response.data.data === null,
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
				"operation/states",
				this.form,
				(response) => {
					this.$router.push("/operation/state/" + response.data.data.id);
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
				"operation/states/" + this.form.id,
				this.form,
				(response) => {
					this.$router.push("/operation/state/" + this.$route.params.id);
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
