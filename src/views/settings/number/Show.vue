<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<app-log
					owner-type="numbers"
					:owner-id="form.id"
					:labels="['number', 'description', 'name']"
				></app-log>
				<button
					v-if="$api.has('number_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded ml-2 btn-light i-con-h-a"
				>
					Düzenle
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
                <button
					v-if="$api.has('number_create')"
					@click="$router.push('/settings/number/create')"
					class="btn btn-sm btn-rounded btn-primary ml-2 i-con-h-a"
				>
					{{ $t("menu.modules.number_create.title") }}
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
							<h5 class="mb-0 font-weight-500">{{ form.number }}</h5>
							<small class="text-muted">{{ form.name }} &#183; </small>
							<small class="text-muted"
								><app-date-text :text="form.created_at"></app-date-text> önce
								oluşturuldu</small
							>
						</div>
						<app-label icon="el-icon-coin" label="Numara Tanımı">{{
							form.name
						}}</app-label>
						<app-label label="Açıklama">{{ form.description }}</app-label>
						<app-label label="Gelen Arama Planı">{{
							form.dialplan.name
						}}</app-label>
						<app-label label="Giden Arama Kullanıcıları">
							<template v-if="form.users">
								<app-avatar :items="form.users"></app-avatar>
							</template>
							<span v-else class="badge badge-white badge-sm mr-2"
								>Yetkili kullanıcı Yok</span
							>
						</app-label>
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
			form: {
				name: null,
				created_at: null,
				number: null,
				dialplan: {},
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("settings/numbers/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	created() {},
	methods: {},
};
</script>
