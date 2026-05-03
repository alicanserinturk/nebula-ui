<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<app-log
					owner-type="users"
					:owner-id="form.id"
					:labels="['name', 'surname', 'email']"
				></app-log>
				<button
					v-if="$api.has('user_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a ml-2"
				>
					Düzenle
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				<button
					v-if="$api.has('user_create')"
					@click="$router.push('/settings/user/create')"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a ml-2"
				>
					{{ $t("menu.modules.user_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card>
						<template slot="header">
							<h5 class="mb-0 font-weight-500">
								{{ form.name }} {{ form.surname }}
							</h5>
							<small class="text-muted"
								><app-date-text :text="form.created_at"></app-date-text> önce
								oluşturuldu</small
							>
						</template>
						<app-label icon="el-icon-message" label="E-posta Adresi">{{
							form.email
						}}</app-label>
						<app-label icon="el-icon-phone-outline" label="Sip">{{
							form.sip
						}}</app-label>
						<app-label icon="el-icon-lock" label="Sip Şifresi">
							<span v-if="showPassword">{{ form.sip_password }}</span>
							<span v-else>****</span>
							<el-button
								v-if="!showPassword"
								class="ml-1"
								type="text"
								size="mini"
								@click="showPassword = true"
								>Şifreyi Göster
							</el-button>
							<el-button
								v-else
								class="ml-1"
								type="text"
								size="mini"
								@click="showPassword = false"
								>Şifreyi Gizle
							</el-button>
						</app-label>
					</app-card>
					<app-card v-if="$api.has('permit_list')">
						<template slot="header">
							<div class="d-inline-block pt-1"><strong>Yetki</strong></div>
							<div
								v-if="$api.has('permit_add')"
								class="d-inline-block float-right"
							>
								<app-selector
									v-model="permits"
									endpoint="settings/permits"
									:action-endpoint="'settings/users/' + form.id + '/permits'"
									action-field="permits"
									name="Yetkileri Yönet"
								>
									<template slot-scope="{ row }">
										{{ $t("menu.modules." + row.key + ".title") }}
										<small class="d-block text-muted">{{
											$t("menu.modules." + row.key + ".description")
										}}</small>
									</template>
								</app-selector>
							</div>
						</template>
						<div v-if="permits.length === 0" class="text-center p-3">
							<small>Kullanıcının herhangi bir yetkisi bulunmuyor.</small>
						</div>
						<div v-else>
							<div class="mb-3" :key="item.key" v-for="(item, key) in permits">
								{{ $t("menu.modules." + item.key + ".title") }}
								<small class="d-block text-muted">{{
									$t("menu.modules." + item.key + ".description")
								}}</small>
							</div>
						</div>
					</app-card>

					<el-dialog
						:append-to-body="true"
						custom-class="app-modal"
						title="Şifre Değiştirme"
						:visible.sync="passwordResetModalVisible"
					>
						<app-warning></app-warning>
						<div class="row">
							<div class="col-md-6">
								<app-form-row label="Yeni Şifre">
									<app-form-password-input
										v-model="form.password"
									></app-form-password-input>
								</app-form-row>
							</div>
							<div class="col-md-6">
								<app-form-row label="Yeni Şifreyi Onaylayın">
									<el-input
										prefix-icon="el-icon-lock"
										v-model="form.password_repeat"
										size="medium"
										type="password"
										show-password
									></el-input>
								</app-form-row>
							</div>
						</div>
						<div slot="footer" class="dialog-footer">
							<el-button
								@click="passwordResetModalVisible = false"
								size="small"
								type="text"
							>
								Vazgeç
							</el-button>
							<el-button
								type="primary"
								size="small"
								@click="changePassword"
								:disabled="!form.password_repeat || !form.password"
								>Değiştir</el-button
							>
						</div>
					</el-dialog>
				</div>
				<div class="app-module-sidebar">
					<app-card>
						<div class="mb-4">
							<div class="d-flex align-items-center justify-content-around">
								<a href="#" class="btn btn-icon i-con-h-a">
									<span
										><i class="i-con i-con-mail text-muted"><i></i></i>
									</span>
								</a>
								<span class="w-64 avatar circle bg-light">
									<span
										v-if="form.is_online"
										class="avatar-status w-12 on b-white avatar-right"
									></span>
									{{ form.name[0] }}{{ form.surname[0] }}
								</span>
								<a href="#" class="btn btn-icon i-con-h-a">
									<span
										><i class="i-con i-con-phone text-muted"><i></i></i
									></span>
								</a>
							</div>
							<div class="text-center mt-3">
								<a href="#" class="h6 font-weight-bold"
									>{{ form.name }} {{ form.surname }}</a
								>
								<span class="d-block text-muted mt-1">{{ form.email }}</span>
							</div>
						</div>
						<button
							v-if="$api.has('pending_session')"
							@click="pendingSession"
							:disabled="!form.is_online"
							class="btn w-100 btn-rounded btn-light text-align-auto i-con-h-a"
						>
							<i class="i-con i-con-shutdown float-right"><i></i></i> Aktif
							Oturumu Sonlandır
						</button>
						<small
							v-if="!form.is_online && $api.has('pending_session')"
							class="mt-2 d-block text-muted"
							>Şu anda aktif oturum bulunmuyor</small
						>

						<button
							v-if="$api.has('user_edit')"
							@click="passwordResetModalVisible = true"
							class="btn mt-3 w-100 btn-rounded btn-light text-align-auto i-con-h-a"
						>
							<i class="i-con i-con-lock float-right"></i> Şifre Değiştir
						</button>
						<template v-if="$api.has('user_edit')">
							<button
								@click="block()"
								v-if="form.is_active"
								class="mt-3 btn w-100 btn-rounded btn-light text-align-auto i-con-h-a mb-1"
							>
								<i class="i-con i-con-eye float-right"><i></i></i> Engelle
							</button>
							<button
								@click="updateStatus(true)"
								v-else
								class="mt-3 btn w-100 btn-rounded btn-primary text-align-auto i-con-h-a mb-1"
							>
								<i class="i-con i-con-eye float-right"><i></i></i> Engeli Kaldır
							</button>
							<small class="d-block mt-2 text-muted"
								>Engellen kullanıcıların aktif oturumları sonladırılır ve sistem
								üzerinde tekrar oturum açmaları engellenir.</small
							>
						</template>
					</app-card>
					<app-card title="İşlem Geçmişi" :remove-body-padding="true">
						<div class="p-3 text-center" v-if="form.access_logs.length === 0">
							<small>İşlem geçmişi bulunmuyor.</small>
						</div>
						<div
							v-else
							class="timeline px-3 py-1 timeline-theme animates animates-fadeInUp"
						>
							<div
								class="tl-item"
								v-for="(item, key) in form.access_logs"
								v-if="key < 6"
							>
								<div class="tl-dot"></div>
								<div class="tl-content">
									<div class="">{{ accessLogTypes[item.type].title }}</div>
									<div class="tl-date text-muted mt-1">
										<app-date-text :text="item.created_at"></app-date-text>
									</div>
								</div>
							</div>
						</div>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<script>
import API from "../../../utils/API";

export default {
	data() {
		return {
			passwordResetModalVisible: false,
			showPassword: false,
			form: {
				name: "",
				surname: "",
				permits: [],
				password: "",
				password_repeat: "",
				access_logs: [],
			},
			permits: [],
			accessLogTypes: {
				session_conflict: {
					title: "Aktif oturum hatası.",
				},
				login_success: { title: "Giriş yaptı." },
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("settings/users/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
				wm.form.access_logs = response.data.data.access_logs.slice().reverse();
				wm.getUserPermits();
			});
		});
	},
	methods: {
		getUserPermits() {
			if (this.$api.has("permit_list")) {
				this.$api.get(
					"settings/users/" + this.$route.params.id + "/permits",
					{},
					(response) => {
						this.permits = response.data.data;
					}
				);
			}
		},
		updateStatus(status) {
			this.$api.put(
				"settings/users/" + this.form.id,
				{ is_active: status },
				() => {
					this.form.is_online = status;
					this.form.is_active = status;
				}
			);
		},
		block() {
			this.$api.put(
				"settings/users/" + this.form.id,
				{ is_active: false },
				() => {
					this.form.is_online = false;
					this.form.is_active = false;
					this.$message.success("Kullanıcı pasife alındı.");
				}
			);
		},
		pendingSession() {
			this.$api.patch(
				"settings/users/" + this.form.id + "/pending-session",
				{},
				() => {
					this.form.is_online = false;
					this.$message.success("Aktif oturum sonlandırıldı.");
				}
			);
		},
		changePassword() {
			this.$api.put(
				"settings/users/" + this.form.id,
				{
					password: this.form.password,
					password_repeat: this.form.password_repeat,
				},
				() => {
					this.$message.success("Şifre değiştirildi.");
					this.passwordResetModalVisible = false;
				}
			);
		},
	},
};
</script>
