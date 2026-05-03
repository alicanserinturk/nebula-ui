<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<app-table
				:downloadable="true"
				endpoint="reports/no-answer-calls"
				:options="options"
				vector="report"
				:filters="filters"
			>
				<template slot-scope="item">
					<el-table-column width="55">
						<template slot-scope="scope">
							<span class="w-36 avatar bg-light circle">
								<ion-icon
									style="font-size:18px"
									name="call"
									class="text-muted"
								></ion-icon>
								<ion-icon
									:name="
										scope.row.direction === 'out' ? 'arrow-redo' : 'arrow-undo'
									"
									class="text-muted"
									style="font-size:12px;position:absolute; top:6px; right:7px;"
								></ion-icon
							></span>
						</template>
					</el-table-column>
					<el-table-column label="Çağrı Detayları">
						<template slot-scope="scope">
							{{ scope.row.contact.number }}
							<small class="sub-item text-muted">
								<span v-if="scope.row.direction === 'in'">Gelen</span>
								<span v-else>Giden</span>
                                <span class="ml-1">{{scope.row.ring_time}} sn</span>
								<span class="ml-2" v-if="scope.row.user"
									><ion-icon name="person-outline" class="mr-1"></ion-icon
									>{{ scope.row.user.name }} {{ scope.row.user.surname }}</span
								>
								<span class="ml-2" v-if="scope.row.queue"
									><ion-icon name="cellular-outline" class="mr-1"></ion-icon
									>{{ scope.row.queue.name }}</span
								>
								<span class="ml-2" v-if="scope.row.number"
									><ion-icon name="people-outline" class="mr-1"></ion-icon
									>{{ scope.row.number.name }}</span
								>
							</small>
						</template>
					</el-table-column>
                
                    <el-table-column width="120px" align="right" label="Sonuç">
						<template slot-scope="scope">
							<span v-if="scope.row.is_success" class="badge bg-success-lt badge-md badge-pill"
								>Tekrar Ulaşıldı</span
							>
							<span v-else class="badge badge-pill bg-danger-lt badge-md">Kaçan Çağrı</span>
						</template>
					</el-table-column>
                    <el-table-column  width="120px" label="Tarih" align="right">
						<template slot-scope="scope">
							<span
								><app-date-text :text="scope.row.created_at"></app-date-text
							></span>
						</template>
					</el-table-column>
				</template>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
export default {
	data() {
		return {
			options: {},
			filters: {
				date: {
					name: "Tarih",
					type: "daterange",
					value: null,
					options: [],
					required: false,
				},
				queue_id: {
					name: "Kuyruk",
					type: "queue",
					value: null,
					options: [],
					required: false,
				},
				number_id: {
					name: "Numara",
					type: "number",
					value: null,
					options: [],
					required: false,
				},
			},
			crm: {
				visible: false,
				id: false,
			},
		};
	},
	created() {},
	methods: {
		showCrm(id) {
			this.crm.visible = true;
			this.crm.id = id;
		},
	},
};
</script>
