<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					@click="$router.back()"
					class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					<i class="i-con i-con-arrow-left float-left mr-2"><i></i></i>
					{{ $t("action.back") }}
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
					<app-card :title="$t('view.user.user_detail')">
						<app-form-row
							v-if="$store.getters.currentUser.is_super_user && !$route.params.id"
							label="Müşteri"
							description="Kullanıcının hangi müşteriye ait olacağını seçin."
						>
							<el-select
								v-model="form.customer_id"
								filterable
								size="medium"
								style="width:100%"
								placeholder="Müşteri seçin"
							>
								<el-option
									v-for="item in customers"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								></el-option>
							</el-select>
						</app-form-row>
						<div class="row">
							<div class="col-md-6">
								<app-form-row :label="$t('view.user.field_name')">
									<el-input
										v-model="form.name"
										prefix-icon="el-icon-user"
										size="medium"
									></el-input>
								</app-form-row>
							</div>
							<div class="col-md-6">
								<app-form-row :label="$t('view.user.field_surname')">
									<el-input v-model="form.surname" size="medium"></el-input>
								</app-form-row>
							</div>
						</div>
						<app-form-row
							:label="$t('view.user.field_email')"
							description="Aktif olarak kullanılan bir e-posta adresi belirleyin."
						>
							<el-input
								v-model="form.email"
								prefix-icon="el-icon-message"
								size="medium"
							></el-input>
						</app-form-row>
					</app-card>
					<app-card title="Yetki" v-if="!$route.params.id">
						<app-form-row
							description="Kullanıcı yetki grubu yalnızca ön tanımlı yetkileri atamanız için kolaylık sağlar. Dilediğiniz zaman yetkileri tekrar değiştirebilirsiniz."
						>
							<div class="d-inline-block">
								<div class="d-block mb-2" v-for="(group, key) in userGroups">
									<el-radio
										v-model="userGroup"
										:value="key"
										:label="key"
										@input="setPermits"
									>
										<span style="font-weight: 500 !important"
											><ion-icon
												style="font-size: 14px"
												class="mr-1"
												:name="group.icon"
											></ion-icon>
											{{ group.name }}</span
										>
										<span
											class="d-block text-muted pl-4 mt-1"
											style="font-weight: 400 !important"
											>{{ group.description }}</span
										>
									</el-radio>
								</div>
							</div>
						</app-form-row>
					</app-card>
				</div>
				<div class="app-module-sidebar">
					<app-card :title="$t('view.user.session')">
						<div v-if="passwordRequired">
							<app-form-row :label="$t('view.user.field_password')">
								<el-input
									v-model="form.password"
									show-password
									type="password"
									prefix-icon="el-icon-lock"
									size="medium"
								></el-input>
							</app-form-row>
							<app-form-row
								:label="$t('view.user.field_password_again')"
								description="Güçlü bir şifre belirleyebilmek için büyük, küçük harf ve rakamları aynı anda kullananın."
							>
								<el-input
									v-model="form.password_repeat"
									show-password
									type="password"
									prefix-icon="el-icon-lock"
									size="medium"
								></el-input>
							</app-form-row>
						</div>
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
			loading: false,
			passwordRequired: false,
			customers: [],
			allPermits: [],
			form: {
				customer_id: null,
				name: "",
				surname: "",
				email: "",
				password: "",
				password_repeat: "",
				permits: [],
			},
			userGroup: "agent",
			userGroups: {
				agent: {
					icon: "person-outline",
					name: "Müşteri Temsilcisi",
					description:
						"Pano, duyurular, temsilci ve telefon modüllerini içerir.",
					permit_keys: [
						"dashboard",
						"announcement",
						"agent_call_history",
						"call_task",
						"soft_phone",
						"contact_show",
					],
				},
				yonetici: {
					icon: "analytics-outline",
					name: "Yönetici",
					description:
						"Çağrı merkezi operasyonunu yönetir. Raporlar ve operasyon modüllerine erişebilir.",
					permit_keys: [
						"agent_call_history", "call_task", "soft_phone",
						"dashboard", "real_time", "announcement",
						"inbound_report", "outbound_report", "call_recording_report",
						"agent_performance", "missed_calls", "crm_form_report",
						"all_calls_report", "result_code_report",
						"customer_list",
						"contact_list", "contact_create", "contact_edit", "contact_show",
						"user_list",
						"announcement_list", "announcement_create", "announcement_edit", "announcement_delete",
						"permit_list",
						"pbx_list",
						"number_list",
						"queue_list",
						"dialplan_list",
						"pending_session",
						"call_list_create", "call_list_list", "call_list_edit", "call_list_delete",
						"blacklist_create", "blacklist_list", "blacklist_edit", "blacklist_delete",
						"crm_form_create", "crm_form_list", "crm_form_edit", "crm_form_delete", "crm_form_show",
						"result_code_list", "result_code_create", "result_code_edit", "result_code_show", "result_code_delete",
						"call_endpoint_create", "call_endpoint_list", "call_endpoint_edit", "call_endpoint_delete",
					],
				},
				admin: {
					icon: "shield-checkmark-outline",
					name: "Admin",
					description:
						"Tüm yetkilere sahiptir.",
					permit_keys: {
						exclude: [
							"customer_list",
							"customer_create",
							"customer_edit",
							"customer_delete",
						],
					},
				},
				custom: {
					icon: "construct-outline",
					name: "Özel",
					description:
						"Yetkileri kullanıcıya özel olarak seçeceksiniz.",
					permit_keys: [],
				},
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.id) {
			API.get("settings/users/" + to.params.id, {}, (response) => {
				next((wm) => {
					wm.form = response.data.data;
				});
			});
		} else {
			next();
		}
	},
	created() {
		this.passwordRequired = !this.$route.params.id;

		if (this.$store.getters.currentUser.is_super_user && !this.$route.params.id) {
			this.$api.get("settings/customers", { per_page: 500 }, (response) => {
				this.customers = response.data.data;
			});
		}

		if (!this.$route.params.id) {
			this.$api.get("settings/permits", {}, (response) => {
				this.allPermits = response.data.data;
				this.setPermits(this.userGroup);
			});
		}
	},
	methods: {
		setPermits(userGroup) {
			const spec = this.userGroups[userGroup].permit_keys;
			let selected;

			if (Array.isArray(spec)) {
				selected = this.allPermits.filter((p) => spec.includes(p.key));
			} else if (spec && Array.isArray(spec.exclude)) {
				selected = this.allPermits.filter((p) => !spec.exclude.includes(p.key));
			} else {
				selected = [];
			}

			this.form.permits = selected.map((p) => p.id);
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
				"settings/users",
				this.form,
				(response) => {
					this.$api.put(
						"settings/users/" + response.data.data.id + "/permits",
						{ permits: this.form.permits },
						() => {
							this.$router.push("/settings/user/" + response.data.data.id);
							this.loading = false;
						},
						() => {
							this.loading = false;
						}
					);
				},
				() => {
					this.loading = false;
				}
			);
		},
		update() {
			let cache = this.form;
			if (!this.passwordRequired) {
				delete cache.password;
				delete cache.password_required;
			}
			delete cache.customer_id;
			this.loading = true;
			this.$api.put(
				"settings/users/" + this.form.id,
				cache,
				(response) => {
					this.$router.push("/settings/user/" + response.data.data.id);
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
