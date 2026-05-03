<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<app-table
				downloadable
				editable
				endpoint="agent/last-calls"
				vector="customer"
				:filters="filters"
			>
				<template slot-scope="item">
					<el-table-column width="55px">
						<template slot-scope="scope">
							<span
								v-if="!scope.row.contact.name && !scope.row.contact.surname"
								class="w-36 avatar circle bg-light"
							>
								<i class="el-icon-user"></i>
							</span>
							<span v-else class="w-36 avatar circle bg-light">
								<span
									v-if="scope.row.contact.name && scope.row.contact.name[0]"
									>{{ scope.row.contact.name[0] }}</span
								>
								<span
									v-if="
										scope.row.contact.surname && scope.row.contact.surname[0]
									"
									>{{ scope.row.contact.surname[0] }}</span
								>
							</span>
						</template>
					</el-table-column>
					<el-table-column label="Müşteri" width="130">
						<template slot-scope="scope">
							<span v-if="!scope.row.contact.name && !scope.row.contact.surname"
								>Yeni Müşteri</span
							>
							<span v-else class="text-capitalize"
								>{{ scope.row.contact.name }}
								{{ scope.row.contact.surname }}</span
							>
							<span class="sub-item text-muted">
								<span>{{ scope.row.contact.number }}</span>
							</span>
						</template>
					</el-table-column>
					<el-table-column width="60" align="left" label="Süre">
						<template slot-scope="scope">
							<app-date-range-text
								:start-date="scope.row.startat_at"
								:end-date="scope.row.ended_at"
							></app-date-range-text>
						</template>
					</el-table-column>
					<el-table-column label="Detay" align="left" width="auto" :fit="true">
						<template slot-scope="scope">
							<template v-if="scope.row.direction === 'out'">
								<span class="badge badge-xs badge-light"
									><i class="el-icon-right ml-1"></i> Giden Arama</span
								>
								<small class="sub-item text-muted d-block">{{
									scope.row.number.name
								}}</small>
							</template>
							<template v-else>
								<span class="badge badge-xs badge-light"
									><i class="el-icon-back mr-1"></i> Gelen Arama</span
								>
								<small class="sub-item text-muted d-block"
									>{{ scope.row.number.name }}
									<span v-if="scope.row.number.name">
										- {{ scope.row.queue.name }}</span
									></small
								>
							</template>
						</template>
					</el-table-column>
					<el-table-column align="right">
						<template slot-scope="scope">
							<div
								class="d-inline-block"
								v-if="scope.row.crm.result_code || scope.row.crm.comment"
							>
								<span
									class="badge badge-sm badge-light"
									v-if="scope.row.crm.result_code"
								>
									{{ scope.row.crm.result_code }}
								</span>
								<span
									class="badge badge-sm badge-warning"
									v-else="scope.row.crm.result_code"
								>
									Sonuçlandırılmadı
								</span>
								<span class="sub-item text-muted">
									<span v-if="scope.row.crm.comment">{{
										scope.row.crm.comment
									}}</span>
									<span v-else>Değerlendirme yapılmadı</span>
								</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="right" width="205">
						<template slot-scope="scope">
							<button
								class="btn btn-white btn-sm btn-rounded"
								v-if="scope.row.crm.result_code || scope.row.crm.comment"
								@click="showCrm(scope.row.crm.id)"
							>
								<i class="el-icon-circle-check"></i> Değerlendirmeyi İncele
							</button>
							<button
								class="btn btn-white btn-sm btn-rounded text-primary"
								v-else
								@click="showCrm(scope.row.crm.id)"
							>
								<i class="el-icon-chat-dot-round"></i> Görüşmeyi Değerlendir
							</button>
						</template>
					</el-table-column>
					<el-table-column align="right" width="82px">
						<template slot-scope="scope">
							<button
								@click="startCall(scope.row)"
								class="btn btn-primary btn-sm btn-rounded"
							>
								<i class="el-icon-phone-outline"></i>
								Ara
							</button>
						</template>
					</el-table-column>

					<el-table-column align="right" width="120" label="Tarih">
						<template slot-scope="scope">
							<small class="text-muted">
								<app-date-text :text="scope.row.created_at"></app-date-text>
							</small>
						</template>
					</el-table-column>
				</template>
			</app-table>
		</app-module-body>
		<!--<app-crm v-if="crm.visible" :visible.sync="crm.visible" :id="crm.id"></app-crm>-->
		<Phone
			v-if="crm.visible"
			:visible.sync="crm.visible"
			:key="crm.id"
			:call-id="crm.id"
		></Phone>
	</app-module>
</template>
<script>
import EventBus from "@/utils/EventBus";
import Phone from "./Phone";
import moment from "moment";

export default {
	components: {
		Phone,
	},
	data() {
		return {
			crm: {
				id: null,
				visible: false,
			},
			filters: {
				direction: {
					name: "Yön",
					type: "primary",
					value: null,
					options: [
						{ name: "Tümü", value: null },
						{ name: "Gelen", value: "in" },
						{ name: "Giden", value: "out" },
					],
				},
				date: {
					name: "Tarih Aralığı",
					type: "daterange",
					value: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
					options: [],
				},
				queue_id: {
					name: "Arama Grubu",
					type: "queue",
					value: null,
					options: [],
				},
				number_id: {
					name: "Numara",
					type: "number",
					value: null,
					options: [],
				},
			},
		};
	},
	created() {},
	methods: {
		showCrm(crmID) {
			this.crm.id = crmID;
			this.crm.visible = true;
		},
		startCall(item) {
			EventBus.$emit("sipStartCall", item.contact.calling_number);
		},
	},
};
</script>
