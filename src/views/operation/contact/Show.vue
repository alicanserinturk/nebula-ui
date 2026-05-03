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
					v-if="$api.has('call_list_create')"
					@click="$router.push('/operation/contact/create')"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a ml-2"
				>
					{{ $t("menu.modules.contact_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
				<button
					v-if="form.id"
					@click="crmModalVisible = true"
					class="btn btn-sm btn-rounded btn-success i-con-h-a ml-2"
				>
					Görüşme Kaydı Ekle
					<i class="i-con i-con-plus float-right ml-2"><i></i></i>
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
								<span v-if="form.name || form.surname">
									{{ form.name }} {{ form.surname }}
								</span>
								<span v-else>İsimsiz Müşteri</span>
							</h5>
							<small class="text-muted"
								><app-date-text :text="form.created_at"></app-date-text>
								oluşturuldu.</small
							>
						</div>
						<app-label icon="el-icon-phone-outline" label="Telefon Numarası">
							{{ form.number }}
						</app-label>
						<app-label icon="el-icon-message" label="E-posta Adresi">
							{{ form.email }}
						</app-label>
						<app-label
							v-if="form.gender === 'male'"
							icon="el-icon-male"
							label="Cinsiyet"
						>
							Erkek
						</app-label>
						<app-label
							v-else-if="form.gender === 'female'"
							icon="el-icon-female"
							label="Cinsiyet"
						>
							Kadın
						</app-label>
						<app-label v-else icon="el-icon-connection" label="Cinsiyet">
							Belirtilmedi
						</app-label>
						<app-label icon="el-icon-date" label="Doğum Tarihi">
							{{ form.birth_day }}
						</app-label>
						<app-label icon="el-icon-tickets" label="Kimlik Numarası">
							{{ form.identity_number }}
						</app-label>
					</app-card>
					<app-card title="Geçmiş" v-if="form.id">
						<History :contact-id="form.id"></History>
					</app-card>
				</div>
				<div class="app-module-sidebar" v-if="form.id">
					<app-card :remove-body-padding="true">
						<Risk :contact-id="form.id" :contact-detail="form"></Risk>
						<div class="b-b">
							<Block
								:id="form.blacklist ? form.blacklist.id : null"
								:contact-id="form.id"
							></Block>
						</div>
					</app-card>
					<app-card title="Randevular" :remove-body-padding="true">
						<Appointment :contact-id="form.id"></Appointment>
					</app-card>
				</div>
			</div>
		</app-module-body>
		
		<Crm 
			v-if="form.id" 
			:visible.sync="crmModalVisible" 
			:contact="form" 
			@saved="handleNoteSaved"
		></Crm>
	</app-module>
</template>
<style></style>
<script>
import API from "../../../utils/API";
import Block from "./Block";
import Appointment from "./Appointment";
import Risk from "./Risk";
import History from "./History";
import Phone from "../../agent/Phone";
import Crm from "../../../components/app/Crm";

export default {
	components: {
		Block,
		Appointment,
		Risk,
		History,
		Phone,
		Crm,
	},
	data() {
		return {
			form: {},
			crmModalVisible: false,
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("operation/contacts/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	created() {},
	methods: {
		handleNoteSaved() {
			this.crmModalVisible = false;
			// Maybe refresh history?
		}
	},
};
</script>
