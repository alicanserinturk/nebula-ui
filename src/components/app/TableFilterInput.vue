<template>
	<div>
		<div
			v-if="
				type === 'date' ||
					type === 'daterange' ||
					type === 'year' ||
					type === 'month' ||
					type === 'dates' ||
					type === 'datetime' ||
					type === 'week' ||
					type === 'datetimerange' ||
					type === 'monthrange'
			"
		>
			<el-date-picker
				v-model="val"
				size="medium"
				:type="type"
				format="dd MMM yyyy"
				value-format="yyyy-MM-dd"
				start-placeholder="Başlangıç"
				end-placeholder="Bitiş"
				:default-time="['00:00:00', '23:59:59']"
			>
			</el-date-picker>
		</div>
		<div v-else-if="type === 'select'">
			<el-select size="medium" v-model="val">
				<el-option
					:value="option.value"
					:label="option.name"
					:key="option.value"
					v-for="option in filter.options"
				>
					{{ option.name }}
				</el-option>
			</el-select>
		</div>
		<div v-else-if="type === 'user'">
			<app-select
				v-model="val"
				source="settings/users"
				:label="['name', 'surname']"
			>
				<template slot-scope="props"
					>{{ props.row.name }} {{ props.row.surname }}</template
				>
			</app-select>
		</div>
		<div v-else-if="type === 'form'">
			<app-select
				v-model="val"
				source="operation/crm/forms"
				:label="['name']"
			>
				<template slot-scope="props">{{ props.row.name }}</template>
			</app-select>
		</div>
		<div v-else-if="type === 'number'">
			<app-select
				v-model="val"
				source="settings/numbers"
				:label="['name']"
			>
				<template slot-scope="props">{{ props.row.name }}</template>
			</app-select>
		</div>
		<div v-else-if="type === 'queue'">
			<app-select
				v-model="val"
				source="settings/queues"
				:label="['name']"
			>
				<template slot-scope="props">{{ props.row.name }}</template>
			</app-select>
		</div>
		<div v-else-if="type === 'call_list'">
			<app-select
				v-model="val"
				source="operation/calling-lists"
				:label="['name']"
			>
				<template slot-scope="props">{{ props.row.name }}</template>
			</app-select>
		</div>
		<div v-else-if="type === 'call_endpoint'">
			<app-select
				v-model="val"
				source="operation/call-endpoints"
				:label="['name']"
			>
				<template slot-scope="props">{{ props.row.name }}</template>
			</app-select>
		</div>
		<div v-else-if="type === 'result_code'">
			<app-select
				v-model="val"
				source="operation/result-codes"
				:label="['name']"
			>
				<template slot-scope="props">{{ props.row.name }}</template>
			</app-select>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		type: {
			required: true,
		},
		value: {
			required: false,
			default: null,
		},
	},
	data() {
		return {};
	},
	computed: {
		val: {
			set(value) {
				this.$emit("input", value);
			},
			get() {
				return this.value;
			},
		},
	},
};
</script>
