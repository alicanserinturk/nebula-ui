<template>
	<app-module>
		<app-module-header></app-module-header>
		<app-module-body>
			<app-information :errors="errors"></app-information>
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
								<span
									v-if="scope.row.task_id"
									class="badge badge-xs badge-primary ml-1"
									><i class="el-icon-tickets mr-1"></i> Görev</span
								>
								<small class="sub-item text-muted d-block">{{
									scope.row.number ? scope.row.number.name : ''
								}}</small>
							</template>
							<template v-else>
								<span class="badge badge-xs badge-light"
									><i class="el-icon-back mr-1"></i> Gelen Arama</span
								>
								<span
									v-if="scope.row.task_id"
									class="badge badge-xs badge-primary ml-1"
									><i class="el-icon-tickets mr-1"></i> Görev</span
								>
								<small class="sub-item text-muted d-block"
									>{{ scope.row.number ? scope.row.number.name : '' }}
									<span v-if="scope.row.number && scope.row.number.name && scope.row.queue">
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
								v-if="scope.row.crm.note_id"
							>
								<span
									class="badge badge-sm badge-light"
									v-if="scope.row.crm.result_code"
								>
									{{ scope.row.crm.result_code }}
								</span>
								<span
									class="badge badge-sm badge-warning"
									v-else
								>
									Sonuçlandırılmadı
								</span>
								<span class="sub-item text-muted">
									<span v-if="scope.row.crm.comment">{{
										scope.row.crm.comment
									}}</span>
									<span v-else>Yorum girilmedi</span>
								</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="right" width="205">
						<template slot-scope="scope">
							<button
								class="btn btn-white btn-sm btn-rounded"
								v-if="scope.row.crm.note_id"
								@click="showCrm(scope.row)"
							>
								<i class="el-icon-view"></i> Görüntüle / Düzenle
							</button>
							<button
								class="btn btn-white btn-sm btn-rounded text-primary"
								v-else
								@click="showCrm(scope.row)"
							>
								<i class="el-icon-chat-dot-round"></i> Görüşmeyi Değerlendir
							</button>
						</template>
					</el-table-column>
					<el-table-column align="right" width="82px">
						<template slot-scope="scope">
							<button
								v-if="calledIds.includes(scope.row.id)"
								:disabled="true"
								class="btn btn-white text-primary btn-sm btn-rounded"
							>
								<i class="el-icon-loading"></i>
								Aranıyor
							</button>
							<button
								v-else
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
		<Phone
			v-if="crm.visible"
			:visible.sync="crm.visible"
			:key="crm.callId"
			:call-id="crm.callId"
			:phone="crm.phone"
			:number="crm.number"
			:queue="crm.queue"
			:task-id="crm.taskId"
		></Phone>
	</app-module>
</template>
<script>
import Phone from "./Phone";
import moment from "moment";

export default {
	components: {
		Phone,
	},
	data() {
		return {
			errors: null,
			calledIds: [],
			crm: {
				callId: null,
				phone: null,
				number: null,
				queue: null,
				// pbx_calls.task_id — voip-server CDR'a yazdı, backend resource döndü.
				// Phone popup'a iletilir; not/randevu kaydında backend'e geri gönderilir.
				taskId: null,
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
		showCrm(row) {
			// Phone modal crm/init endpoint'inden mevcut crm_note'u asterisk_id ile çeker;
			// forms/contact yüklemek için phone (encrypted) ve number (string) gerekli.
			this.crm.callId = row.asterisk_id;
			this.crm.phone  = row.contact ? row.contact.phone : null;
			this.crm.number = row.number ? row.number.number : null;
			this.crm.queue  = row.queue ? row.queue.key : null;
			this.crm.taskId = row.task_id || null;
			this.crm.visible = true;
		},
		startCall(row) {
			// Server-side click-to-call: state, sip, blacklist kontrolleri ve AMI
			// originate backend'de yapılır. Task ekranı ile aynı yapı.
			if (this.calledIds.includes(row.id)) return;
			this.calledIds.push(row.id);
			this.$api.get(
				"agent/last-calls/call/" + row.id,
				{},
				() => {
					this.errors = null;
					setTimeout(() => {
						const idx = this.calledIds.indexOf(row.id);
						if (idx > -1) this.calledIds.splice(idx, 1);
					}, 1000);
				},
				(code, errors) => {
					this.errors = errors;
					const idx = this.calledIds.indexOf(row.id);
					if (idx > -1) this.calledIds.splice(idx, 1);
				}
			);
		},
	},
};
</script>
