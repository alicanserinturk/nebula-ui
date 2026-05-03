<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<app-table
				:downloadable="true"
				endpoint="reports/all-call"
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
							<span v-if="scope.row.direction === 'in'">{{
								scope.row.from
							}}</span>
							<span v-else>{{ scope.row.to }}</span>
							<small class="sub-item text-muted">
								<span v-if="scope.row.direction === 'in'">Gelen</span>
								<span v-else>Giden</span>
								<span v-if="scope.row.user"
									> &bull; <ion-icon name="person-outline" class="mr-1"></ion-icon
									>{{ scope.row.user.name }} {{ scope.row.user.surname }}</span
								>
								
								<span v-if="scope.row.queue"
									> &bull; <ion-icon name="people-outline" class="mr-1"></ion-icon
									>{{ scope.row.queue.name }}</span
								>
								<span v-if="scope.row.number"
									> &bull; <ion-icon name="cellular-outline" class="mr-1"></ion-icon
									>{{ scope.row.number.name }}</span
								>
							</small>
						</template>
					</el-table-column>
					<el-table-column width="120px" label="Sonuç Kodu">
						<template slot-scope="scope">
							<span
							v-if="scope.row.result_code"
								class="badge badge-md badge-pill"
								:class="{
									'bg-light': scope.row.result_code.is_success,
									'badge-light': scope.row.result_code.is_success === null,
									'bg-warning': scope.row.result_code.is_success === false,
								}"
								>{{ scope.row.result_code.name }}</span
							></template
						>
					</el-table-column>
					<el-table-column width="310px" label="Süreler">
						<template slot-scope="scope">
							<div class="row mr-2">
								<div class="col">
									<span v-if="scope.row.direction === 'in'"
										><app-date-range-text
											:start-date="scope.row.start_at"
											:end-date="scope.row.queue_at"
										></app-date-range-text
									></span>
									<small
										v-if="scope.row.direction === 'in'"
										class="sub-item text-muted d-block"
										>IVR</small
									>
								</div>
								<div class="col">
									<span v-if="scope.row.direction === 'in'"
										><app-date-range-text
											:start-date="scope.row.queue_at"
											:end-date="scope.row.ringing_at"
										></app-date-range-text
									></span>
									<small
										v-if="scope.row.direction === 'in'"
										class="sub-item text-muted d-block"
										>Kuyruk</small
									>
								</div>
								<div class="col">
									<span v-if="scope.row.up_at"
										><app-date-range-text
											:start-date="scope.row.ringing_at"
											:end-date="scope.row.up_at"
										></app-date-range-text
									></span>
									<span v-else
										><app-date-range-text
											:start-date="scope.row.ringing_at"
											:end-date="scope.row.hangup_at"
										></app-date-range-text
									></span>
									<small class="sub-item text-muted d-block">Ringing</small>
								</div>
								<div class="col">
									<span
										><app-date-range-text
											:start-date="scope.row.up_at"
											:end-date="scope.row.hangup_at"
										></app-date-range-text
									></span>
									<small class="sub-item text-muted d-block">Konuşma</small>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column width="70" align="right">
						<template slot-scope="scope">
							<button
								@click="showFile(scope.row)"
								class="btn btn-light btn-rounded btn-icon i-con-h-a"
							>
								<ion-icon
									v-if="scope.row.sound_file_size !== 0"
									class="text-muted"
									name="play"
								></ion-icon>
								<ion-icon
									v-else
									class="text-muted"
									name="hourglass-outline"
								></ion-icon>
							</button>
						</template>
					</el-table-column>
					<el-table-column width="110px" label="Tarih" align="right">
						<template slot-scope="scope">
							<small
								><app-date-text :text="scope.row.start_at"></app-date-text
							></small>
						</template>
					</el-table-column>
				</template>
			</app-table>
		</app-module-body>
		<el-dialog
			v-if="fileModalVisible"
			:append-to-body="true"
			:visible.sync="fileModalVisible"
			custom-class="app-modal-auto"
		>
			<template slot="title">
				<div class="row row-xs">
					<div class="col-auto">
						<div class="avatar w-40 bg-light">
							{{item.user.name[0]}}{{item.user.surname[0]}}
						</div>
					</div>
					<div class="col pl-1">
						<h5 class="font-weight-bold mb-0">{{ item.user.name }} {{ item.user.surname }}</h5>
						<template v-if="item.direction === 'out'">
							<small class=" text-muted d-block"
								>{{ item.to }} ile görüşüldü.</small
							>
						</template>
						<template v-else>
							<small class=" text-muted d-block"
								>{{ item.from }} ile görüşüldü.</small
							>
						</template>
					</div>
					<div class="col-md-auto pr-4">
						<a
							:disabled="item.sound_file_size === 0"
							target="_blank"
							:href="currentUser.servers.media + item.sound_file_url"
							class="btn mr-2 btn-light btn-rounded"
							:download="item.sound_file_url + '.vaw'"
							>İndir &bull;
							{{ (item.sound_file_size / 1024 / 1024).toFixed(2) }} Mb
							<i class="el-icon-download"></i
						></a>
					</div>
				</div>
			</template>
			<div class="px-2" slot="footer">
				<app-audio
					v-if="item.sound_file_size !== 0"
					:src="currentUser.servers.media + item.sound_file_url"
				></app-audio>
				<div v-else class="text-center">
					<app-svg
						class="mx-auto col-4"
						src="/assets/img/vectors/upload.svg"
					></app-svg>
					<h5 class="font-weight-bold">Yükleme devam ediyor</h5>
					<span
						>Ses kaydı bulut ortamına yükleniyor bu işlem uzun zaman alabilir,
						ses dosyası aktarıldığında dinleyebilirsiniz.</span
					>
				</div>
			</div>
		</el-dialog>
	</app-module>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
	data() {
		return {
			fileModalVisible: false,
			item: null,
			audio: {
				source: "",
			},
			options: {},
			filters: {
				start_at: {
					name: "Tarih",
					type: "daterange",
					value: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
					options: [],
				},
				result_code_id: {
					name: "Sonuç Kodu",
					type: "result_code",
					value: null,
					options: [],
				},
				user_id: {
					name: "Kullanıcı",
					type: "user",
					value: null,
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
				call_type: {
					name: "Tür",
					type: "primary",
					value: null,
					options: [
						{ name: "Tümü", value: null },
						{ name: "Başarılı", value: "call" },
						{ name: "Ivr", value: "ivr" },
						{ name: "Abondan", value: "abondan" },
						{ name: "Cevapsız", value: "missed" },
					],
				},
			},
			crm: {
				visible: false,
				id: false,
			},
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
	},
	created() {},

	methods: {
		showFile(item) {
			this.item = item;
			this.fileModalVisible = true;
		},
		showCrm(id) {
			this.crm.visible = true;
			this.crm.id = id;
		},
	},
};
</script>
