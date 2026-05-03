<template>
	<div>
		<app-form-row
			:label="field.label ? field.label : 'Başlıksız Alan'"
			:description="field.description"
			v-for="(field, index) in form.fields"
			:key="index"
		>
			<div v-if="field.type === 'text'">
				<el-input
					:key="'preview-' + field.id"
					v-model="field['value']"
				></el-input>
			</div>
			<div v-else-if="field.type === 'paragraph'">
				<el-input
					:key="'preview-' + field.id"
					:value="14"
					v-model="field['value']"
					type="textarea"
				></el-input>
			</div>
			<div v-else-if="field.type === 'number'">
				<el-input-number
					:key="'preview-' + field.id"
					v-model="field['value']"
				></el-input-number>
			</div>
			<div v-else-if="field.type === 'select'">
				<el-select :key="'preview-' + field.id" v-model="field['value']">
					<el-option
						label="Seçim yapın"
						:value="null"
						>Seçim yapın</el-option
					>
					<el-option
						:label="option.value"
						:value="option.id"
						v-for="(option, oIndex) in field.options"
						:key="oIndex"
						>{{ option.value }}</el-option
					>
				</el-select>
			</div>
			<div v-else-if="field.type === 'checkbox'">
				<el-switch
					:key="'preview-' + field.id"
					v-model="field['value']"
				></el-switch>
			</div>
			<div v-else-if="field.type === 'rate'">
				<el-rate
					:key="'preview-' + field.id"
					v-model="field['value']"
				></el-rate>
			</div>
			<div v-else-if="field.type === 'date'">
				<el-date-picker
					:key="'preview-' + field.id"
					v-model="field['value']"
					type="date"
				>
				</el-date-picker>
			</div>
			<div v-else-if="field.type === 'datetime'">
				<el-date-picker
					:key="'preview-' + field.id"
					v-model="field['value']"
					type="datetime"
				>
				</el-date-picker>
			</div>
			<div v-else-if="field.type === 'time'">
				<el-time-picker :key="'preview-' + field.id" v-model="field['value']">
				</el-time-picker>
			</div>
		</app-form-row>
	</div>
</template>
<script>
export default {
	props: {
		form: {
			required: true,
		},
	},
	data() {
		return {};
	},
	computed: {
		cache: {
			set(value) {},
			get() {
				return this.value;
			},
		},
	},
	created() {
		this.form.fields.forEach((item) => {
			// Backend'den gelen mevcut cevabı koru — sadece boşsa default ata.
			if (item.value !== undefined && item.value !== null) return;
			if (item.type === 'select' || item.type === 'checkbox') {
				const defaultOption = item.options.find((o) => o.default_value);
				item.value = defaultOption ? defaultOption.id : null;
			} else {
				item.value = null;
			}
		});
	},
};
</script>
