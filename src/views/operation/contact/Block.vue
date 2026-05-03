<template>
	<div class="px-4 py-3">
		<div v-if="form.id">
			<div class="row row-sm b-b pb-3">
				<div class="col-auto pt-1">
					<ion-icon name="eye-off-outline"></ion-icon>
				</div>
				<div class="col">
					<small
						><strong>{{ form.user.name }} {{ form.user.surname }}</strong
						>,
						<strong
							><app-date-text :text="form.created_at"></app-date-text
						></strong>
						engelleme talebi oluşturdu.</small
					>
				</div>
				<!--<div class="col-auto pt-1">
					<ion-icon
						slot="reference"
						class="pointer"
						name="create-outline"
						@click="edit(form)"
					></ion-icon>
				</div>-->
			</div>
			<div class="row row-sm pt-3 pb-3 b-b" v-if="form.comment">
				<div class="col-auto pt-1">
					<ion-icon name="chatbox-outline"></ion-icon>
				</div>
				<div class="col">
					<small><strong>{{form.comment}}</strong> yorumunda bulundu.</small>
				</div>
			</div>
			<div class="row row-sm pt-3 pb-3" v-if="form.is_confirmed">
				<div class="col-auto pt-1">
					<ion-icon name="checkmark-circle-outline"></ion-icon>
				</div>
				<div class="col">
					<small
						><strong
							>{{ form.confirmed_user.name }}
							{{ form.confirmed_user.surname }}</strong
						>,
						<strong
							><app-date-text :text="form.updated_at"></app-date-text
						></strong>
						onayladı.</small
					>
				</div>
			</div>
			
			<div>
				<button
					class="btn btn-default btn-danger btn-sm btn-rounded col-md-12"
					@click="remove(form.id)"
				>
					Engellemeyi Kaldır
					<ion-icon
						name="close-circle-outline"
						class="float-right"
						style="font-size: 17px;"
					></ion-icon>
				</button>
			</div>
		</div>
		<div class="pt-3" v-else>
			<el-popover
				placement="bottom"
				width="290"
				popper-class="app-popper"
				v-model="visible"
				trigger="manual"
				@hide="cancel"
			>
				<div>
					<app-information
						type="simple"
						:errors="errors.save"
					></app-information>
					<div class="app-popper-body">
						<app-form-row
							label="Yorum"
							description="Müşterinin neden karalisteye alınması gerektiğini detaylı olarak belirtin."
						>
							<el-input
								type="textarea"
								v-model="form.comment"
								size="medium"
							></el-input>
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
					<app-form-row
						description="Müşteriyi gelen veya giden aramalar için engelleyebilirsiniz."
					>
						<button
							class="btn btn-default btn-default btn-sm btn-rounded col-md-12"
							@click="visible = true"
						>
							Engelleme Talebi Oluştur
							<ion-icon
								name="eye-off-outline"
								class="float-right"
								style="font-size: 17px;"
							></ion-icon>
						</button>
					</app-form-row>
				</div>
			</el-popover>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		id: {
			required: true,
		},
		contactId: {
			required: true,
		},
	},
	data() {
		return {
			visible: false,
			errors: {
				get: [],
				save: [],
			},
			form: {
				id: null,
				number: null,
				direction: null,
				comment: null,
			},
		};
	},
	created() {
		if (this.id) {
			this.get(this.id);
		}
	},
	methods: {
		get(id) {
			this.$api.get("operation/blacklist/" + id, {}, (response) => {
				this.form = response.data.data;
			});
		},
		save() {
			this.$api.patch(
				"operation/contacts/" + this.contactId + "/block",
				this.form,
				(response) => {
					this.$message.success("Engelleme talebi oluşturuldu");
					// Backend artık full BlacklistResource döndürüyor — ikinci fetch gereksiz.
					this.form = response.data.data;
					this.visible = false;
					this.$emit("changed", this.form);
				},
				(code, errors) => {
					this.errors.save = errors;
				}
			);
		},
		remove() {
			this.$api.delete(
				"operation/blacklist/" + this.form.id,
				{},
				() => {
					this.$message.success("Engelleme kaldırıldı");
					this.form = {
						id: null,
						number: null,
						direction: null,
						comment: null,
					};
					this.visible = false;
					this.$emit("changed", null);
				},
				() => {
					this.$message.error(
						"Engelleme kaydı silinirken bir hatayla karşılaşıldı"
					);
				}
			);
		},
		cancel() {
			this.visible = false;
			this.form = {
				id: null,
				number: null,
				direction: null,
				comment: null,
			};
			this.errors = {
				get: [],
				save: [],
			}
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
