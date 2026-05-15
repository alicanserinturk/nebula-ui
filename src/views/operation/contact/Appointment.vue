<template>
	<div>
		<app-information type="simple" :errors="errors.default"></app-information>
		<div v-if="items.length > 0">
			<div
				class="row row-sm b-b px-4 py-3"
				:key="item.id"
				v-for="item in items"
			>
				<div class="col-auto pt-1">
					<ion-icon name="calendar-clear-outline"></ion-icon>
				</div>
				<div class="col">
					<small v-if="item.source">
						<strong>{{ item.source.name }}</strong> üzerinden
						<strong><app-date-text :text="item.date"></app-date-text></strong>
						aranmak için randevu oluşturuldu.
					</small>
					<small v-else>
						<strong><app-date-text :text="item.date"></app-date-text></strong>
						tarihine randevu oluşturuldu.
					</small>
				</div>
				<div class="col-auto pt-1">
					<ion-icon
						slot="reference"
						class="pointer"
						name="create-outline"
						@click="edit(item)"
					></ion-icon>
					<ion-icon
						slot="reference"
						class="pointer ml-1"
						name="trash-outline"
						@click="remove(item)"
					></ion-icon>
				</div>
			</div>
		</div>
		<div v-else class="mb-0 text-center b-b p-3">
			<small class="text-muted">Herhangi bir randevu bulunmuyor.</small>
		</div>
		<div class="px-4 pt-3 pb-1 bg-white b-t" style="position: sticky; bottom:0;">
			<el-popover
				placement="top"
				width="290"
				popper-class="app-popper"
				v-model="visible"
				trigger="manual"
			>
				<div>
					<app-information
						type="simple"
						:errors="errors.save"
					></app-information>
					<div class="app-popper-body">
						<app-form-row
							label="Atanan Kullanıcı"
							description="Boş bırakılırsa havuza düşer; kendinizi ya da bir arkadaşınızı seçebilirsiniz."
						>
							<UserSelect
								v-if="visible"
								v-model="form.assigned_user_id"
							></UserSelect>
						</app-form-row>
						<app-form-row label="Randevu Tarihi">
							<el-date-picker
								size=""
								v-model="form.date"
								type="datetime"
								placeholder="Arama Tarihi Seçin"
							>
							</el-date-picker>
						</app-form-row>
					</div>
					<div class="app-popper-footer b-t">
						<div class="row row-sm">
							<div class="col">
								<button
									class="btn btn-default btn-sm btn-rounded col-md-12"
									@click="cancel"
								>
									Vazgeç
								</button>
							</div>
							<div class="col">
								<button
									v-if="form.id"
									class="btn btn-primary btn-sm btn-rounded col-md-12"
									@click="update"
								>
									Kaydet
								</button>
								<button
									v-else
									class="btn btn-primary btn-sm btn-rounded col-md-12"
									@click="save"
								>
									Oluştur
								</button>
							</div>
						</div>
					</div>
				</div>
				<div slot="reference">
					<button class="btn btn-default btn-primary btn-sm btn-rounded col-md-12" @click="visible = true">
						Yeni Randevu Oluştur
						<ion-icon
							name="add-outline"
							class="float-right"
							style="font-size: 17px;"
						></ion-icon>
					</button>
				</div>
			</el-popover>
		</div>
	</div>
</template>
<script>
import UserSelect from "../../../components/form/UserSelect";
import moment from "moment";

export default {
	components: {
		UserSelect,
	},
	props: {
		contactId: {
			required: true,
		},
		initial: {
			required: false,
			default: null,
		},
		// Click-to-call zincirinde socket → SipClient → Phone'dan gelir.
		// Yeni randevu PATCH body'sine eklenir; backend task'ın source bilgilerini
		// (source_type/source_id/source_part_id) yeni scheduled task'a devralır.
		taskId: {
			required: false,
			default: null,
		},
	},
	data() {
		return {
			visible: false,
			errors: {
				default: [],
				save: [],
			},
			form: {
				id: null,
				assigned_user_id: null,
				date: null,
			},
			items: [],
		};
	},
	created() {
		// İlk render'da crm/init payload'undan gelen listeyi kullan, ekstra
		// request atmıyoruz. CRUD sonrası get() ile tazeleniyor.
		if (Array.isArray(this.initial)) {
			this.items = this.initial.slice();
		} else {
			this.get();
		}
	},
	methods: {
		get() {
			this.$api.get(
				"operation/contacts/" + this.contactId + "/appointments",
				{},
				(response) => {
					this.items = response.data.data;
				},(code, errors) => {
					this.errors.default = errors
				}
			);
		},
		save() {
			this.$api.patch(
				"operation/contacts/" + this.contactId + "/appointments",
				{
					assigned_user_id: this.form.assigned_user_id,
					date: moment(this.form.date).format(),
					task_id: this.taskId,
				},
				(response) => {
					this.$message.success("Randevu oluşturuldu");
					this.get();
					this.visible = false;
					this.form = {
						id: null,
						assigned_user_id: null,
						date: null,
					};
				},
				(code, errors) => {
					this.errors.save = errors;
				}
			);
		},
		remove(item) {

			this.$api.delete(
				"operation/contacts/" + this.contactId + "/appointments/" + item.id,
				{},
				(response) => {
					this.$message.success("Randevu Silindi");
					this.get();
					this.visible = false;
				},
				(code, errors) => {
					this.errors.default = errors
				}
			);
		},
		cancel() {
			this.visible = false;
			this.form = {
				id: null,
				assigned_user_id: null,
				date: null,
			};
		},
		update() {
			this.$api.put(
				"operation/contacts/" + this.contactId + "/appointments/" + this.form.id,
				{
					date: moment(this.form.date).format(),
					assigned_user_id: this.form.assigned_user_id,
				},
				(response) => {
					this.$message.success("Randevu düzenlendi");
					this.get();
					this.visible = false;
				},
				(code, errors) => {
					this.errors.save = errors;
				}
			);
		},
		edit(item) {
			this.form = {
				id: item.id,
				date: item.date,
				assigned_user_id: item.assigned_user_id ?? null,
			};
			this.visible = true;
		},
	},
};
</script>
<style>
.app-popper {
	padding: 0;
	overflow: hidden;
}
.app-popper-body {
	padding: 20px 20px 5px 20px;
}
.app-popper-footer {
	padding: 15px 20px;
}
</style>
