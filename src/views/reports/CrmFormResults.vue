<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<app-table
				:downloadable="true"
				:searchable="false"
				archivable
				endpoint="reports/crm/forms"
				:options="options"
				vector="report"
				:filters="filters"
				@loaded="handle"
			>
			<el-table-column label="Kullanıcı" fixed="left">
					<template slot-scope="scope">
						
						{{scope.row.user.name}}
							{{scope.row.user.surname}}
					</template>
				</el-table-column>
				<el-table-column label="Müşteri" fixed="left">
					<template slot-scope="scope">
						{{scope.row.contact.phone}}
					</template>
				</el-table-column>
				<el-table-column v-for="(field, index) in fields" :key="'field-' + index" :label="field.label">
					<template slot-scope="scope">
						{{ getFieldValue(scope.row, field.key).label }}
					</template>
				</el-table-column>
				<el-table-column width="120px" label="Tarih" align="right" fixed="right">
					<template slot-scope="scope">
						<span
							><app-date-text :text="scope.row.created_at"></app-date-text
						></span>
					</template>
				</el-table-column>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
	data() {
		return {
			items: [],
			fields: [],
			options: {},
			filters: {
				form_id: {
					name: "Form",
					type: "form",
					value: null,
					options: [],
					required: true,
				},
				start_at: {
					name: "Tarih",
					type: "daterange",
					value: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
					options: [],
				},
			},
		};
	},
	created() {},
	computed: {
		...mapGetters(["currentUser"]),
	},
	methods: {
		handle(response) {
			this.items = response.data;
			this.fields = response.fields;
		},
		getFieldValue(row, key) {
			let value = null;
			Object.keys(row.field_values).forEach((item) => {
				if (item === key) value = row.field_values[item];
			});
			return value;
		},
	},
};
</script>
<style>
audio {
	width: 100%;
}

.el-dialog__headerbtn {
	margin-top: 3px;
}
</style>
