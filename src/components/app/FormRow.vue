<template>
	<div class="app-form-row mb-3">
		<div class="form-group">
			<label v-if="label" class="d-block">
				<span v-if="!required" class="app-form-row-required">*</span
				>{{ label }}:</label
			>
			<slot></slot>
			<small v-if="description" class="form-text text-muted d-flex">
                <span class="d-inline-block font-weight-400"><i style="transform: rotate(180deg)" class="el-icon-warning-outline mr-1 mb-1"></i>{{ description }}</span>
			</small>
		</div>
	</div>
</template>
<style>
.card-body .app-form-row:nth-last-child(2) .form-group{
    margin-bottom:-12px !important;
}
.app-form-row .form-group small {
	margin-top: 10px;
}
.app-form-row .form-group label {
	font-size: 14px;
}
.app-form-row-description {
	margin-top: 10px;
	color: #aaa;
	font-size: 12px;
	font-weight: 400 !important;
}

.app-form-row .el-select {
	width: 100%;
}

.app-form-row .el-autocomplete {
	width: 100%;
}

.app-form-row .el-date-editor {
	width: 100% !important;
}
</style>
<script>
export default {
	props: {
		label: { required: false },
		description: { required: false },
		required: { required: false, default: true },
	},
	data() {
		return {};
	},
};
</script>
