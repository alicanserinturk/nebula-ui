<template>
	<div class="d-inline-block app-avatar-group">
		<div class="app-avatar d-flex flex-wrap align-items-center avatar-group">
			<span class="w-32 avatar circle bg-light border pointer border-white" v-for="item in items">
				<el-tooltip
					class="item"
					effect="dark"
					:content="item.name + ' ' + item.surname"
					placement="top"
				>
					<span class="d-flex">
						<template v-if="item.name || item.surname">
							<span v-if="item.name">{{ item.name[0] }}</span>
							<span v-if="item.surname">{{ item.surname[0] }}</span>
						</template>
						<template v-else>
							<ion-icon name="person-outline"></ion-icon>
						</template>
					</span>
				</el-tooltip>
			</span>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		items: {
			required: false,
			default: false,
		},
		listView: {
			required: false,
			default: false,
		},
		expandOnFocus: {
			required: false,
			default: false,
		},
	},
};
</script>
<style lang="scss">
.app-avatar-group {
	.app-avatar {
	}
	.avatar {
	}
}
</style>
