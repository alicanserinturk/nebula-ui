<template>
	<div
		v-if="
			errors &&
				((typeof errors === 'object' && Object.keys(errors).length > 0) ||
					(Array.isArray(errors) && errors.length > 0))
		"
	>
		<div
			:class="{
				'app-information-popper p-4 border r-3x bg-white': type === 'popper',
				'app-information p-4 border mb-3 r-3x bg-white': type === 'card',
				'px-4 py-3 bg-warning-lt b-success': type === 'simple',
			}"
		>
			<div class="row row-xs">
				<div class="col">
					<h5 v-if="type === 'card'">Uyarı</h5>
					<template v-if="Array.isArray(errors)">
						<div v-for="item in errors">
							<span class="d-block">{{ item.message }}</span>
						</div>
					</template>
					<template v-else-if="typeof errors === 'object'">
						<div>
							<span class="d-block">{{ errors.message }}</span>
						</div>
					</template>
				</div>
				<div class="col-auto">
					<i class="el-icon-close pointer" @click="clear()"></i>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		errors: {
			required: true,
			default: () => {
				return [];
			},
		},
		type: {
			required: false,
			default: "card",
		},
	},
	data() {
		return {};
	},
	watch: {
		errors(err) {
			window.scrollTo(0, 0);
		},
	},
	methods:{
		clear(){
			this.$emit('update:errors', []);
		}
	}
};
</script>
<style>
.app-information {
	border-left: 3px solid var(--red) !important;
}
.app-information-popper{
	position: absolute;
	top:-30px;
}
</style>
