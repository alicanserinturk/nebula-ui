<template>
	<div class="app-crm-phone">
		<div class="text-center p-3" v-if="loading.getCrm">
			<i class="el-icon-loading"></i>
		</div>
		<transition name="el-fade-in-linear">
			<div class="pt-3" v-if="!loading.getCrm">
				<div class="app-crm-form-body">
					<el-tabs v-model="activeForm" type="card">
						<el-tab-pane label="Görüşme Değerlendirme" name="crm">
							<div class="px-4 pt-2">
								<app-form-row
									label="Sonuç Kodu"
									description="Görüşmeyi nitelendiren sonuç kodunu seçmeniz, müşteri yönetimi kalite puanınızı arttıracaktır."
									required
								>
									<el-select
										v-model="form.result_code.id"
										placeholder="Sonuç kodu seçin"
										filterable
										class="w-100"
									>
										<el-option
											v-for="code in resultCodes"
											:key="code.id"
											:label="code.name"
											:value="code.id"
										></el-option>
									</el-select>
								</app-form-row>
								<app-form-row
									label="Değerlendirmeniz"
									description="Lütfen görüşmeyle ilgili tüm görüşlerinizi bildiriniz."
								>
									<el-input
										v-model="form.comment"
										type="textarea"
										:rows="3"
									></el-input>
								</app-form-row>
							</div>
						</el-tab-pane>
						<el-tab-pane
							v-for="(customForm, index) in form.forms"
							:key="'form-' + index"
							:label="customForm.name"
							:name="customForm.name"
						>
							<div class="px-4 pt-2">
								<Preview :form="customForm"></Preview>
							</div>
						</el-tab-pane>
					</el-tabs>
					<app-information
						type="simple"
						:errors="this.errors"
					></app-information>
				</div>
				<div class="px-4 pt-3 pb-2 b-t app-crm-form-footer">
					<div class="row row-xs">
						<div class="col">
							<app-form-row
								label="Çağrı Kalitesi"
								description="Çağrı ses kalitesini değerlendirin."
							>
								<el-rate
									show-text
									:texts="['Çok Kötü', 'Kötü', 'Orta', 'İyi', 'Gayet İyi']"
									v-model="form.rating"
									:colors="colors"
								></el-rate>
							</app-form-row>
						</div>
						<div class="col-auto  pt-5">
							<button
								class="btn btn-sm btn-default mr-2 btn-rounded"
								@click="cancel"
							>
								Geçmiş görüşmeler
							</button>
							<button
								class="btn btn-sm btn-primary btn-rounded"
								@click="save"
								:disabled="loading.save"
							>
								{{ form.id ? "Güncelle" : "Kaydet" }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import ResultCodeSelect from "../../../components/form/ResultCodeSelect";
import Preview from "../crm-forms/Preview";
export default {
	components: {
		ResultCodeSelect,
		Preview,
	},
	props: {
		id: {
			required: true,
		},
		contactId: {
			required: false,
			default: null,
		},
		number: {
			required: false,
			default: null,
		},
		queue: {
			required: false,
			default: null,
		},
		forms: {
			required: false,
			default: () => [],
		},
		resultCodes: {
			required: false,
			default: () => [],
		},
		initial: {
			required: false,
			default: null,
		},
	},
	data() {
		return {
			atScrollBottom: false,
			activeForm: "crm",
			colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
			form: {
				id: null,
				rating: null,
				comment: null,
				result_code: {
					id: null,
				},
				forms: [],
			},
			loading: {
				save: false,
			},
			errors: [],
		};
	},
	created() {
		// Öncelik: save sonrası bellekte tutulan form state. Yoksa init'ten gelen formlar.
		if (this.initial && Array.isArray(this.initial.forms) && this.initial.forms.length) {
			this.form.forms = JSON.parse(JSON.stringify(this.initial.forms));
		} else if (this.forms && this.forms.length) {
			this.form.forms = JSON.parse(JSON.stringify(this.forms));
		}
		if (this.initial) {
			this.form.id = this.initial.id ?? null;
			this.form.rating = this.initial.rating ?? null;
			this.form.comment = this.initial.comment ?? null;
			this.form.result_code.id = this.initial.result_code_id
				?? this.initial.result_code?.id
				?? null;
		}
		this.$emit("complete", this.id);
	},
	methods: {
		handleScroll() {},
		cancel() {
			this.$emit("cancel");
		},
		save() {
			this.loading.save = true;
			if (this.form.rating === 0) this.form.rating = null;
			this.$api.post(
				"crm/notes",
				{
					...this.form,
					call_id:    this.id,
					contact_id: this.contactId,
					number:     this.number,
					queue:      this.queue,
				},
				(response) => {
					this.$message.success(
						this.form.id ? "Değerlendirme güncellendi." : "Değerlendirme kaydedildi."
					);
					this.form.id = response.data.data?.id ?? this.form.id;
					this.errors = [];
					this.loading.save = false;
					this.$emit("saved", this.form);
				},
				(code, errors) => {
					this.errors = errors;
					this.loading.save = false;
				}
			);
		},
	},
};
</script>
<style lang="scss">
.app-crm-phone .el-tabs__header {
	padding: 0 25px;
}
.app-crm-phone .el-tabs__nav-scroll {
	&::after {
		height: 1px !important;
	}
}
</style>
