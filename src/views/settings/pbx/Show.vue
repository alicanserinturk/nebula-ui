<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<app-log
					owner-type="pbx"
					:labels="['name']"
					:owner-id="form.id"
				></app-log>
				<button
					v-if="$api.has('pbx_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a ml-2"
				>
					Düzenle
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				<button
					v-if="$api.has('pbx_create')"
					@click="$router.push('/settings/pbx/create')"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a ml-2"
				>
					{{ $t("menu.modules.pbx_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card :more="true">
						<template slot="header">
							<h5 class="mb-0 font-weight-500">{{ form.name }}</h5>
							<small class="text-muted"
								><app-date-text :text="form.created_at"></app-date-text> önce
								oluşturuldu</small
							>
						</template>
						<template>
							<app-label label="Toplam Bakiye" v-if="form.credit">
								<div class="mb-0">
									<span class="h3">{{
										form.credit.credit_limit.toFixed(2)
									}}</span>
									<sup class="text-muted"
										><span v-if="form.credit.base_currency === 'TRY'">₺</span
										><span v-else>{{ form.credit.base_currency }}</span></sup
									>
									<div class="text-muted mt-2 text-sm">
										Kullanılanılabilir Bakiye
									</div>
									<div>
										<span class="text-success"
											>{{
												(
													form.credit.credit_limit + form.credit.balance
												).toFixed(2)
											}}
											<span v-if="form.credit.base_currency === 'TRY'">₺</span
											><span v-else>{{ form.credit.base_currency }}</span></span
										>
									</div>
								</div>
							</app-label>
							<app-label label="Toplam Bakiye" v-else>
								Bakiye bilgisi görüntülenemiyor, lütfen sistem yöneticinize
								danışın.
							</app-label>
						</template>

						<app-label icon="el-icon-coin" label="Sunucu">{{
							form.host
						}}</app-label>
						<template slot="more">
							<app-label icon="el-icon-user" label="Kullanıcı Adı">{{
								form.username
							}}</app-label>
							<app-label icon="el-icon-lock" label="Şifre">
								<span v-if="showHostSecret">{{ form.secret }}</span>
								<span v-else>****</span>
								<el-button
									v-if="!showHostSecret"
									class="ml-1"
									type="text"
									size="mini"
									@click="showHostSecret = true"
								>
									Şifreyi Göster
								</el-button>
								<el-button
									v-else
									class="ml-1"
									type="text"
									size="mini"
									@click="showHostSecret = false"
									>Şifreyi Gizle
								</el-button>
							</app-label>

							<!--<app-label icon="el-icon-user" label="Switch Kullanıcı Adı">{{ form.sippy_username }}</app-label>
              <app-label icon="el-icon-lock" label="Switch Şifresi">
                <span v-if="showSippyPassword">{{ form.sippy_password }}</span>
                <span v-else>****</span>
                <el-button v-if="!showSippyPassword" class="ml-1" type="text" size="mini" @click="showSippyPassword = true">
                  Şifreyi Göster
                </el-button>
                <el-button v-else class="ml-1" type="text" size="mini" @click="showSippyPassword = false">Şifreyi
                  Gizle
                </el-button>
              </app-label>-->
						</template>
					</app-card>
					<app-card :remove-body-padding="true">
						<div slot="header">
							Numaralar
							<div class="float-right pointer">
								<button
									@click="
										$router.push(
											'/settings/number/create?pbx_id=' + form.id + '&back=true'
										)
									"
									class="mr-2 btn btn-sm btn-rounded btn-primary i-con-h-a "
								>
									Santrale Numara Ekle <i class="i-con i-con-plus"></i>
								</button>
							</div>
						</div>
						<div class="p-3 text-center" v-if="form.numbers.length === 0">
							<small>Santrale kayıtlı herhangi bir numara bulunamadı</small>
						</div>
						<div class="px-4 py-3 b-b" v-for="item in form.numbers">
							<app-label icon="el-icon-coin" :label="item.name">{{
								item.number
							}}</app-label>
							<app-label label="Açıklama">{{ item.description }}</app-label>
							<app-label label="Gelen Arama Planı">{{
								item.dialplan.name
							}}</app-label>
							<app-label label="Giden Arama Kullanıcıları">
								<template v-if="item.users.length > 0">
									<app-avatar :items="item.users"></app-avatar>
								</template>
								<span v-else class="badge badge-white badge-sm mr-2"
									>Yetkili kullanıcı Yok</span
								>
							</app-label>
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
			showHostSecret: false,
			showSippyPassword: false,
			modalVisible: false,
			form: {
				name: null,
				numbers: [],
			},
			users: [],
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("settings/pbx/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	created() {},
	methods: {},
};
</script>
<style>
.el-collapse-item__header {
	padding: 1rem 1.5rem;
}

.card .el-icon-arrow-right {
	margin-right: 0;
}
</style>
