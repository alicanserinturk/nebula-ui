<template>
	<app-module>
		<app-module-header>
			<template slot="action">
				<button
					v-if="$api.has('customer_create')"
					@click="$router.push('/settings/customer/create')"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a"
				>
					{{ $t("menu.modules.customer_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</template>
		</app-module-header>
		<app-module-body>
			<app-table
				:downloadable="true"
				:selectable="true"
				endpoint="settings/customers"
				:options="options"
				@select="handleSelect"
				vector="customer"
				primary="name"
			>
				<template slot-scope="item">
					<el-table-column width="45px">
						<template slot-scope="scope">
							<span class="w-32 avatar circle bg-light">
								<i class="el-icon-office-building"></i>
							</span>
						</template>
					</el-table-column>
					<el-table-column label="Müşteri">
						<template slot-scope="scope">
							<router-link :to="$route.path + '/' + scope.row.id"
								><span>{{ scope.row.name }}</span>
							</router-link>
							<span class="sub-item"><app-date-text :text="scope.row.created_at"></app-date-text> önce oluşturuldu</span>
						</template>
					</el-table-column>
					<el-table-column align="right" label="Yetkili Kişi">
						<template slot-scope="scope">
							<span>{{ scope.row.responsible_name }}</span>
							<span class="sub-item">{{ scope.row.email }}</span>
						</template>
					</el-table-column>
				</template>
			</app-table>
		</app-module-body>
		<router-view></router-view>
	</app-module>
</template>
<script>
export default {
	data() {
		return {
			options: {},
		};
	},
	created() {},
	methods: {
		handleSelect() {},
	},
};
</script>
