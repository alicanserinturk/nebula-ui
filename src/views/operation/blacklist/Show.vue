<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					v-if="$api.has('blacklist_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					Düzenle
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				 <button  v-if="$api.has('blacklist_create')" @click="$router.push('/operation/blacklist/create')" class="btn btn-sm ml-2 btn-rounded btn-primary i-con-h-a">
					{{ $t('menu.modules.blacklist_create.title') }}
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
								{{ form.number }}
								
							</h5>
							<small
								><strong>{{ form.user.name }} {{ form.user.surname }}</strong
								>,
								<strong
									><app-date-text :text="form.created_at"></app-date-text
								></strong>
								engelleme talebil oluşturdu.</span></small
							>
						</div>
						<app-label icon="el-icon-sort" label="Arama Yönü"
							><span v-if="form.direction === 'in'">Gelen Aramalar</span
							><span v-else-if="form.direction === 'out'">Giden Aramalar</span
							><span v-else>Tüm Aramalar</span></app-label
						>
						<app-label label="Onay Durumu">
                            <span
									v-if="!form.is_confirmed"
									class="badge badge-pill badge-light"
									>Onay Bekliyor</span
								>
								<span
									v-else
									class="badge badge-pill badge-success text-white"
									>Onaylandı</span
								>
                        </app-label>
						<app-label label="Yorum">{{
							form.comment
						}}</app-label>
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
		API.get("operation/blacklist/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	created() {},
	methods: {},
};
</script>
