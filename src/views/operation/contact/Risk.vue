<template>
	<div class="b-b px-4 pt-4" :class="{ 'bg-warning--lt': form.is_risky }">
		<el-popover
			v-if="!form.is_risky"
			placement="bottom"
			width="290"
			popper-class="app-popper"
			v-model="visible"
			trigger="click"
		>
			<div class="app-popper-body">
				<app-information :errors="errors"></app-information>
				<template v-if="form.is_risky">
					Müşteri riskli olarak bildirildi.
				</template>
				<template v-else>
					<app-form-row
						label="Açıklama"
						description="Müşterinin neden riskli olduğunu detaylı olarak belirtin."
					>
						<el-input
                            type="textarea"
							rows="3"
							v-model="form.risk_comment"
						></el-input>
					</app-form-row>
				</template>
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
							@click="add"
						>
							Bildir
						</button>
					</div>
				</div>
			</div>
			<template slot="reference">
				<app-form-row
					description="Riskli olarak bildirdiğiniz müşteriler için yorum ekleyebilir ve diğer temsilcilerin görmesini sağlayabilirsiniz."
				>
					<button
						class="btn btn-default btn-sm btn-rounded col-md-12"
					>
						Riskli Olarak Bildir
						<ion-icon
							name="alert-circle-outline"
							class="float-right"
							style="font-size: 17px;"
						></ion-icon>
					</button>
				</app-form-row>
			</template>
		</el-popover>
		<template v-else>
			<app-form-row
				:description="'Müşteri riskli olarak bildirildi: - ' + form.risk_comment"
			>
				<button
					v-if="form.is_risky"
					@click="remove"
					class="btn btn-warning btn-sm btn-rounded col-md-12"
				>
					Risk Bildirimini Kaldır
				</button>
			</app-form-row>
		</template>
	</div>
</template>
<script>
export default {
	props: {
		contactId: {
			required: true,
		},
		contactDetail: {
			required: false,
			default: false,
		},
		riskComment: {
			required: false,
			default: null,
		},
	},
	data() {
		return {
			visible: false,
			loading: false,
			errors: [],
			form: {
				id: null,
				is_risky: false,
				risk_comment: null,
			},
		};
	},
	created() {
		this.form = this.contactDetail;
	},
	methods: {
		add() {
			this.loading = true;
			this.$api.put(
				"operation/contacts/" + this.contactId,
				{
					is_risky: true,
					risk_comment: this.form.risk_comment,
				},
				() => {
					this.form = {
						is_risky: true,
						risk_comment: this.form.risk_comment,
					};
					this.$message.success("Müşteri riskli olarak bildirildi");
					this.visible = false;
					this.loading = false;
					this.$emit("changed", { ...this.form });
				}
			);
		},
		remove() {
			this.loading = true;
			this.$api.put(
				"operation/contacts/" + this.contactId,
				{
					is_risky: false,
					risk_comment: "",
				},
				() => {
					this.form = {
						is_risky: false,
						risk_comment: null,
					};
					this.$message.success("Müşteri için riskli bildirimi kaldırıldı");
					this.visible = false;
					this.loading = false;
					this.$emit("changed", { ...this.form });
				}
			);
		},
		cancel() {
			this.visible = false;
		},
	},
};
</script>
<style>
.app-popper {
	padding: 0;
}
.app-popper-body {
	padding: 20px 20px 5px 20px;
}
.app-popper-footer {
	padding: 15px 20px;
}
</style>
