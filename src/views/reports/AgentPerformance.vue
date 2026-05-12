<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<app-table
				:downloadable="false"
				endpoint="reports/agent-performance"
				vector="report"
				:filters="filters"
			>
				<el-table-column width="55px">
					<template slot-scope="scope">
						<span class="w-36 avatar bg-light">
							{{ scope.row.user.name[0] }}{{ scope.row.user.surname[0] }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="Kullanıcı">
					<template slot-scope="scope">
						<h6 class="mb-1">
							{{ scope.row.user.name }} {{ scope.row.user.surname }}
						</h6>
						<span class="sub-item">{{ scope.row.user.email }}</span>
					</template>
				</el-table-column>
				<el-table-column width="180" align="right">
					<template slot-scope="scope">
						<button
							class="btn btn-sm btn-rounded btn-light"
							@click="$router.push('/reports/agent-performance/' + scope.row.user.id)"
						>
							Analizi Göster
							<ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon>
						</button>
					</template>
				</el-table-column>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
export default {
	data() {
		return {
			filters: {},
		};
	},
};
</script>
