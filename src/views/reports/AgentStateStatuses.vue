<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<app-table
				:downloadable="true"
				endpoint="reports/agent/:user_id/state-detail"
				vector="report"
				:filters="filters"
			>
				<el-table-column width="50px">
					<template slot-scope="scope">
						<span class="w-32 avatar circle bg-light">
							{{ scope.row.user.name[0] }}{{ scope.row.user.surname[0] }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="Kullanıcı">
					<template slot-scope="scope">
						<span>{{ scope.row.user.name }} {{ scope.row.user.surname }}</span>
						<span class="sub-item text-muted">{{ scope.row.user.email }}</span>
					</template>
				</el-table-column>
				<el-table-column label="Hat Durumu" width="150">
					<template slot-scope="scope">
						<span class="badge badge-pill badge-md badge-light">{{
							scope.row.state.name
						}}</span>
					</template>
				</el-table-column>
				<el-table-column label="Giriş Tarihi" width="150">
					<template slot-scope="scope">
						{{ scope.row.started_at }}
					</template>
				</el-table-column>
				<el-table-column label="Çıkış Tarihi" width="150">
					<template slot-scope="scope">
						{{ scope.row.ended_at }}
					</template>
				</el-table-column>
				<el-table-column align="right" label="Toplam" width="100">
					<template slot-scope="scope">
						{{ formatter.millisecondToDate(scope.row.duration) }}
					</template>
				</el-table-column>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
import formatter from "@/utils/Formatters";

export default {
	data() {
		return {
			formatter,
			filters: {
				user_id: {
					required: true,
					name: "Kullanıcı",
					type: "user",
					value: null,
					options: [],
				},
				date: {
					name: "Tarih",
					type: "daterange",
					value: "",
					options: [],
				},
			},
		};
	},
	computed: {},
	created() {},

	methods: {},
};
</script>
