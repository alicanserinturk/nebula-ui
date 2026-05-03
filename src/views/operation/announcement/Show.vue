<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					v-if="$api.has('announcement_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					Düzenle
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				<button
					v-if="$api.has('announcement_create')"
					@click="$router.push('/operation/announcement/create')"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a ml-2"
				>
					{{ $t("menu.modules.announcement_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-warning></app-warning>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card>
						<div slot="header">
							<h5 class="mb-0">
								{{ form.title }}
								<span class="float-right">
									<small
										><app-date-text :text="form.created_at"></app-date-text>
										oluşturuldu.</small
									>
								</span>
							</h5>
						</div>
						<app-label icon="el-icon-view" label="Görünürlük">
							<span v-if="form.is_global"
								>Tüm müşterilerin kullanıcıları tarafından görülebilir.</span
							><span v-else
								>Yalnızca kendi kullanıcılarınız tarafından görülebilir.</span
							>
						</app-label>
						<app-label icon="el-icon-alarm-clock" label="En Üste Sabitle">
							<span v-if="form.is_pinned">Sabitlendi</span
							><span v-else>Sabitlenmedi</span></app-label
						>
						<app-label icon="el-icon-alarm-clock" label="Geçerlilik Tarihi">
							<app-date-text :text="form.expiration_date"></app-date-text>
						</app-label>
					</app-card>
					<app-card title="Açıklama">
						<div class="mb-3" v-html="form.description"></div>
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
			form: {},
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("operation/announcements/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	created() {},
	methods: {},
};
</script>
