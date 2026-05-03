<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<app-log
					owner-type="dialplans"
					:owner-id="form.id"
					:labels="['name', 'application', 'application_name']"
				></app-log>
				<button
					v-if="$api.has('dialplan_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm ml-2 btn-rounded btn-light i-con-h-a"
				>
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
					{{ $t("action.edit") }}
				</button>
				<button v-if="$api.has('dialplan_create')" @click="$router.push('/settings/dial-plan/create')" class="btn btn-sm ml-2 btn-rounded btn-primary i-con-h-a">
					{{$t('menu.modules.dialplan_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-warning></app-warning>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card>
						<div slot="header">
							<h5 class="mb-0 font-weight-500">{{ form.name }}</h5>
							<small class="text-muted">
								<span v-if="form.description">{{ description }} · </span>
								<app-date-text :text="form.created_at"></app-date-text> önce
								oluşturuldu
							</small>
						</div>
						<app-label
							v-if="form.application === 'queue'"
							icon="el-icon-position"
							label="Yönlendirme"
							>{{ form.application_name }}</app-label
						>
						<app-label icon="el-icon-view" label="Numarayı Gizle">
							<span v-if="form.hide_number"
								>Bu numaraya gelen çağrılar gizleniyor.</span
							>
							<span v-else>Pasif</span>
						</app-label>

						<app-label label="Aktif Günler">
							<template v-for="(day, index) in form.available.times">
								<div class="row row-sm mb-3" v-if="day.length > 0">
									<div class="col-auto">
										<button
											class="btn btn-icon btn-sm btn-rounded btn-light w-32"
										>
											{{ days[index] }}
										</button>
									</div>
									<div class="col">
										<span class="text-muted d-block mt-1">
											Saat
											<span
												v-for="(part, index) in formatDaysOfHours(
													form.available.times[index]
												)"
											>
												<span v-if="index === 0">
													<span class="text-dark font-weight-500"
														>{{ formatHour(part[0]) }}-{{ formatHour(part[1]) }}</span
													>
												</span>
												<span v-else>
													ve
													<span class="text-dark font-weight-500"
														>{{ formatHour(part[0]) }}-{{ formatHour(part[1]) }}</span
													>
												</span>
											</span>
											aralıklarında
											<span class="text-primary font-weight-500"
												>{{ formatDuration(day) }} saat</span
											>
											aktif.
										</span>
									</div>
								</div>
							</template>
						</app-label>
					</app-card>
					<app-card title="Aşamalar">
						<div class="pl-2">
							<app-form-row label="Açılış Anonsu" v-if="form.opening.sound.id">
								<span>
									<div class="btn-light btn btn-rounded w-md pt-2 pb-0">
										<app-audio
											:src="form.opening.sound.file"
											type="simple"
										></app-audio>
									</div>
								</span>
							</app-form-row>
						</div>
						<div class="timeline">
							<div class="tl-item active" v-if="form.no_action">
								<div class="tl-dot">
									<div>
										<button
											class="btn btn-ivr btn-light btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
										>
											<span
												><ion-icon name="hourglass-outline"></ion-icon
											></span>
										</button>
									</div>
								</div>
								<div class="tl-content w-100 pt-3">
									<app-form-row label="Zaman Aşımı İşlemi">
										<span v-if="form.no_action.application.action === 'dial'">
											<ion-icon name="person-outline"></ion-icon>
											<strong>{{ form.no_action.application.name }}</strong>
											kullanıcısına yönlendiriliyor
										</span>
										<span
											v-else-if="form.no_action.application.action === 'queue'"
										>
											<ion-icon name="people-outline"></ion-icon>
											<strong>{{ form.no_action.application.name }}</strong>
											kuyruğuna yönlendiriliyor
										</span>
										<span
											v-else-if="
												form.no_action.application.action === 'dialplan'
											"
										>
											<ion-icon name="keypad-outline"></ion-icon>
											<strong>{{ form.no_action.application.name }}</strong>
											arama planına yönlendiriliyor
										</span>
										<span
											v-else-if="form.no_action.application.action === 'hangup'"
										>
											<ion-icon name="close-circle-outline"></ion-icon>
											<strong>Çağrıyı Sonlandır</strong>
										</span>
										<span
											v-else-if="form.no_action.application.action === 'repeat'"
										>
											<ion-icon name="repeat-outline"></ion-icon>
											<strong>Çağrıyı Tekrarla</strong>
										</span>
									</app-form-row>
									<app-form-row
										label="Zaman Aşımı Anonsu"
										v-if="form.no_action.sound.id"
									>
										<span>
											<div
												class="btn-light btn btn-rounded text-primary w-md pt-2 pb-0"
											>
												<app-audio
													:src="form.no_action.sound.file"
													type="simple"
												></app-audio>
											</div>
										</span>
									</app-form-row>
								</div>
							</div>
							<div class="tl-item active" v-if="form.invalid_dialing">
								<div class="tl-dot">
									<div>
										<button
											class="btn btn-ivr btn-light btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
										>
											<span
												><ion-icon name="alert-circle-outline"></ion-icon
											></span>
										</button>
									</div>
								</div>
								<div class="tl-content w-100 pt-3">
									<app-form-row
										label="Geçersiz Tuşlama Anonsu"
										v-if="form.invalid_dialing.sound.id"
									>
										<span>
											<div
												class="btn-light btn btn-rounded text-primary w-md pt-2 pb-0"
											>
												<app-audio
													:src="form.invalid_dialing.sound.file"
													type="simple"
												></app-audio>
											</div>
										</span>
									</app-form-row>
								</div>
							</div>
							<div class="tl-item active" v-for="step in form.steps">
								<div class="tl-dot">
									<div>
										<button
											v-if="form.steps.length > 1"
											class="btn btn-ivr btn-light btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
										>
											<span>{{ step.key }}</span>
										</button>
										<div class="w-56" v-else></div>
									</div>
								</div>
								<div class="tl-content w-100 pt-3">
									<app-form-row label="İşlem">
										<span v-if="step.application.action === 'dial'">
											<ion-icon name="person-outline"></ion-icon>
											<strong>{{ step.application.name }}</strong> kullanıcısına
											yönlendiriliyor
										</span>
										<span v-else-if="step.application.action === 'queue'">
											<ion-icon name="people-outline"></ion-icon>
											<strong>{{ step.application.name }}</strong> kuyruğuna
											yönlendiriliyor
										</span>
										<span v-else-if="step.application.action === 'dialplan'">
											<ion-icon name="keypad-outline"></ion-icon>
											<strong>{{ step.application.name }}</strong> arama planına
											yönlendiriliyor
										</span>
										<span v-else-if="step.application.action === 'hangup'">
											Çağrıyı Sonlandır
										</span>
										<span v-else-if="step.application.action === 'repeat'">
											Çağrıyı Tekrarla
										</span>
									</app-form-row>
									<app-form-row label="Çıkış Anonsu" v-if="step.sound.id">
										<span>
											<div class="btn-light btn btn-rounded w-md pt-2 pb-0">
												<app-audio
													:src="step.sound.file"
													type="simple"
												></app-audio>
											</div>
										</span>
									</app-form-row>
								</div>
							</div>
						</div>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<style></style>
<script>
import { mapGetters } from "vuex";
import API from "../../../utils/API";

export default {
	data() {
		return {
			days: ["Pt", "S", "Ç", "P", "C", "Ct", "P"],
			form: {
				name: "",
				description: "",
				hide_number: false,
				opening: {
					sound: {
						id: null,
					},
				},
				invalid_dialing: {
					sound: {
						id: null,
					},
				},
				no_action: {
					application: {
						id: null,
						action: "hangup",
						name: null,
					},
					sound: {
						id: null,
					},
				},
				available: {
					times: [[], [], [], [], [], [], []],
					sound: {
						id: null,
					},
				},
				steps: [],
			},
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
	},
	beforeRouteEnter(to, from, next) {
		API.get("settings/dialplans/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data.data;
			});
		});
	},
	created() {},
	methods: {
		formatDaysOfHours(hours) {
			if (!hours || hours.length === 0) return [];
			const STEP = hours.some((h) => h % 1 !== 0) ? 0.5 : 1;
			const sorted = [...hours].sort((a, b) => a - b);
			let parts = [];
			let lastPartStarter = sorted[0];
			sorted.forEach((hour, index) => {
				if (index > 0) {
					const preHour = sorted[index - 1];
					if (hour - preHour > STEP) {
						parts.push([lastPartStarter, preHour + STEP]);
						lastPartStarter = hour;
					}
				}
				if (index === sorted.length - 1) {
					parts.push([lastPartStarter, hour + STEP]);
				}
			});
			return parts;
		},
		formatHour(value) {
			const hour = Math.floor(value);
			const minute = Math.round((value - hour) * 60);
			return `${hour}:${minute.toString().padStart(2, "0")}`;
		},
		formatDuration(day) {
			if (!Array.isArray(day) || day.length === 0) return 0;
			const step = day.some((h) => h % 1 !== 0) ? 0.5 : 1;
			const hours = day.length * step;
			return Number.isInteger(hours) ? hours : hours.toFixed(1);
		},
	},
};
</script>
<style scoped>
.btn-ivr {
	font-size: 14px;
	z-index: 9;
}
.tl-content .app-form-row {
	margin-bottom: 2rem !important;
}
.tl-content .app-form-row:last-child {
	margin-bottom: 1rem !important;
}
</style>
