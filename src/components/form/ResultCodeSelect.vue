<template>
	<div class="d-block position-relative">
		<div
			v-if="dataLoading"
			style="position:absolute; right: 30px; z-index:9; top:10px;"
		>
			<i class="el-icon-loading"></i>
		</div>
		<el-select
			:multiple="multiple"
			:disabled="dataLoading"
			v-model="itemID"
			:placeholder="placeholder"
			filterable
		>
			<el-option
				v-for="item in options"
				:key="item.id"
				:label="item.name"
				:value="item.id"
			>
				{{ item.name }}
			</el-option>
		</el-select>
	</div>
</template>
<script>
export default {
	props: {
		value: { required: true, default: null },
		multiple: { required: false, default: false },
	},
	data() {
		return {
			placeholder: "",
			dataLoading: false,
			options: [],
			cacheId: null,
		};
	},
	created() {
		this.cacheId = this.value;
		this.itemID = this.value;
		this.dataLoading = true;
		this.placeholder = "Yükleniyor...";
		if (!this.multiple) {
			this.itemID = null;
		}
		this.$api.get("operation/result-codes", {}, (result) => {
			this.options = result.data.data;
			this.dataLoading = false;
			this.placeholder = "Sonuç Kodu Seçin";
			this.itemID = this.cacheId;
		});
	},
	computed: {
		itemID: {
			get() {
				if (this.multiple) {
					if (this.options.length > 0) {
						let items = [];
						this.value.forEach((key) => {
							if (typeof key === "object") {
								items.push(key.id);
							} else {
								items.push(key);
							}
						});
						return items;
					}
					return this.value;
				}
				return this.value;
			},
			set(value) {
				if (this.multiple) {
					if (this.options.length > 0) {
						let items = [];
						value.forEach((key) => {
							if (typeof key === "object") {
								items.push(key.id);
							} else {
								items.push(key);
							}
						});
						this.$emit("input", items);
						return;
					}
					this.$emit("input", value);
					return;
				}
				this.$emit("input", value);
			},
		},
	},
	methods: {
		setValue() {},
	},
};
</script>
<style>
.el-select {
	width: 100%;
}
</style>
