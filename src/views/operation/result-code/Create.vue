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
					<app-card title="Sonuç Kod Bilgileri">
						<app-form-row label="Tanım">
							<el-input
								autocomplete="false"
								auto-complete="false"
								v-model="form.name"
								prefix-icon="el-icon-tickets"
								size="medium"
							></el-input>
						</app-form-row>
            <app-form-row label="Tür" description="Sonuç durumunu belirterek sonuçlarınızı türlere göre raporlayabilirsiniz.">
							<el-radio-group v-model="form['is_success']" size="medium">
								<el-radio :label="true" border>Başarılı</el-radio>
								<el-radio :label="false" border>Başarısız</el-radio>
								<el-radio :label="null" border>Diğer</el-radio>
							</el-radio-group>
						</app-form-row>
						<app-form-row label="Açıklama">
							<el-input
								v-model="form.description"
								prefix-icon="el-icon-tickets"
								size="medium"
							></el-input>
						</app-form-row>
					</app-card>
				</div>
				<div class="app-module-sidebar">
					<app-card title="Görünürlük">
						<app-form-row label="Durum" description="Pasif durumdaki sonuç kodları temsilciler tarafından görülmez ancak raporlarda görülmeye devam eder.">
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
				is_success: true,
				is_active: true,
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.id) {
			API.get("operation/result-codes/" + to.params.id, {}, (response) => {
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
				"operation/result-codes",
				this.form,
				(response) => {
					this.$router.push("/operation/result-code/" + response.data.data.id);
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
				"operation/result-codes/" + this.form.id,
				this.form,
				(response) => {
					this.$router.push("/operation/result-code/" + this.$route.params.id);
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
