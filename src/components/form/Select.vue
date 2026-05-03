<template>
	<div class="d-block">
		<app-information :errors="errors"></app-information>
		<el-select
			v-model="selected"
			:multiple="multiple"
			filterable
			remote
			reserve-keyword
			:placeholder="placeholder"
			:remote-method="getItems"
			:loading="loading"
			:allow-create="allowCreate"
			:value-key="valueType === 'object' ? 'id' : null"
		>
			<el-option
				v-for="item in items"
				:key="item.id"
				:value="valueType === 'object' ? item : item.id"
				:label="getLabel(item)"
			>
				<slot :row="item"></slot>
			</el-option>
		</el-select>
	</div>
</template>
<script>
export default {
	props: {
		value: { required: true },
		multiple: { required: false, default: false },
		source: { required: true },
		placeholder: { required: false, default: "Seçim yapın" },
		label: { required: false, default: ["id"] },
		allowCreate: { required: false, default: false },
		valueType: { required: false, default: "object" }, //object, string, number
		valueKey: { required: false, default: "id" },
		queryParams: {
			required: false,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			errors: [],
			items: [],
			loading: false,
			parameters: {
				per_page: 15,
				page: 1,
				q: "",
			},
			default: null,
		};
	},
	computed: {
		selected: {
			get() {
				return this.value;
			},
			set(value) {
				if (this.valueType === "object") {
					this.$emit("input", value);
				} else if (this.valueType === "number") {
					console.log(value);
					this.$emit("input", parseInt(value));
				} else {
					this.$emit("input", value.toString());
				}
			},
		},
	},
	created() {
		this.default = this.value;
		this.getItems();
	},
	methods: {
		getLabel(item) {
			let labels = [];
			this.label.forEach((label) => {
				labels.push(item[label]);
			});
			return labels.join(" ");
		},
		getItems(searchKey = null) {
			this.parameters.q = searchKey;
			this.parameters.per_page = 50;
			this.$api.get(
				this.source,
				{ ...this.parameters, ...this.queryParams },
				(response) => {
					this.items = response.data.data;
					this.loading = false;
				},
				(code, errors) => {
					this.errors = errors;
					this.loading = false;
				}
			);
		},
	},
};
</script>
