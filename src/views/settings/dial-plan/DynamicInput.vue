<template>
	<app-form-row :label="labels[type]">
		<app-select
			key="1"
			v-if="type === 'dial'"
			v-model="val"
			source="settings/users"
			:label="['name', 'surname']"
		>
			<template slot-scope="props"
				>{{ props.row.name }} {{ props.row.surname }}</template
			>
		</app-select>
		<app-select
			key="2"
			v-if="type === 'queue'"
			v-model="val"
			source="settings/queues"
			:label="['name']"
		>
			<template slot-scope="props">{{ props.row.name }}</template>
		</app-select>
		<app-select
			key="3"
			v-if="type === 'dialplan'"
			v-model="val"
			source="settings/dialplans"
			:label="['name']"
		>
			<template slot-scope="props">{{ props.row.name }}</template>
		</app-select>
	</app-form-row>
</template>
<script>
export default {
	props: {
		value: {
			default: null,
			required: false,
		},
		type: {
			default: false,
			required: true,
		},
	},
	computed: {
		val: {
			get() {
				return this.value;
			},
			set(val) {
				let ob = {
					...val,
					action: this.type,
				};
				this.$emit("input", ob);
			},
		},
	},
	mounted() {},
	watch: {
		type(val) {
			if (!val) {
				this.val = {
					id: null,
					action: val,
				};
			}
		},
	},
	data() {
		return {
			labels: {
				dial: "Kullanıcı",
				queue: "Arama Grubu",
				dialplan: "Arama Planı",
			},
		};
	},
};
</script>
