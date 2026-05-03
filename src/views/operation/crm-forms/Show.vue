<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					v-if="$api.has('crm_form_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					Düzenle
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				<button v-if="$api.has('crm_form_create')" @click="$router.push('/operation/crm-forms/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a ml-2">
                    {{$t('menu.modules.crm_form_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
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
								{{ form.name }}
								<span class="float-right">
									<small
										><app-date-text :text="form.created_at"></app-date-text>
										oluşturuldu.</small
									>
								</span>
							</h5>
						</div>
						<app-label icon="el-icon-view" label="Numara">
							<span class="d-block">{{form.number.name}}</span>
						</app-label>
					</app-card>
					<app-card title="Görünüm">
						<Preview :form="form"></Preview>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<style></style>
<script>
import API from "../../../utils/API";
import Preview from "./Preview";

export default {
  components:{
    Preview,
  },
	data() {
		return {
			form: {
        number:{},
        fields:[],
      },
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("operation/crm/forms/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data;
			});
		});
	},
	created() {},
	methods: {},
};
</script>
