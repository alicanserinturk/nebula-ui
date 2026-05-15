<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<button
					@click="$router.back()"
					class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a"
				>
					<i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> Geri
				</button>
				<button
					@click="save"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a"
				>
					{{ $t("action.save") }}
					<i class="el-icon-loading ml-2" v-if="loading"></i>
					<i v-else class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-information :errors="this.errors"></app-information>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card title="Arama Planı">
						<app-form-row label="Arama Planı Adı">
							<el-input
								v-model="form.name"
								prefix-icon="el-icon-sort"
								size="medium"
							></el-input>
						</app-form-row>
						<el-divider></el-divider>
						<app-form-row
							label="Açılış Anonsu"
							description="Tuşlamalar için bilgilendirmeyi, arkaplan müziği veya herhangi bir kaynak ses dosyası seçebilirsiniz."
						>
							<MediaInput v-model="form.opening.sound">
								<a class="text-primary font-weight-500">
									<ion-icon name="musical-note-outline"></ion-icon> Ses Dosyası
									Seç
								</a>
							</MediaInput>
						</app-form-row>
						<el-divider></el-divider>
						<!--<app-form-row label="Tuşlama Menüsü" description="Tuşlama menüsünü aktif ederek çoklu yönlendirmeleri yönetebilirsiniz.">
							<el-switch v-model="form.dialable"></el-switch>
						</app-form-row>-->
						
						<app-form-row>
							<div class="timeline">
								<template v-if="form.dialable">
									<div class="tl-item active">
										<div class="tl-dot">
											<button
												class="btn btn-ivr btn-light btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
											>
												<span
													><ion-icon name="hourglass-outline"></ion-icon
												></span>
											</button>
										</div>
										<div class="tl-content w-100">
											<app-form-row label="Zaman Aşımı">
												<el-select
													size="medium"
													v-model="form.no_action.application.action"
												>
													<el-option value="queue" label="Kuyruğa Yönlendir"
														>Kuyruğa Yönlendir</el-option
													>
													<el-option value="dial" label="Kullanıcıya Yönlendir"
														>Kullanıcıya Yönlendir</el-option
													>
													<el-option
														value="dialplan"
														label="Arama Planına Yönlendir"
														>Arama Planına Yönlendir</el-option
													>
													<el-option value="repeat" label="Menüyü Tekrarla"
														>Menüyü Tekrarla</el-option
													>
													<el-option value="hangup" label="Çağrıyı Sonlandır"
														>Çağrıyı Sonlandır</el-option
													>
												</el-select>
											</app-form-row>
											<DynamicInput
												key="custom"
												v-model="form.no_action.application"
												:type="form.no_action.application.action"
											></DynamicInput>
											<app-form-row
												label="Zaman Aşımı Anansu"
												description="Zaman aşımı sonrası çalınacak ses dosyasını belirleyebilirsiniz."
											>
												<MediaInput v-model="form.no_action.sound">
													<a class="text-primary font-weight-500">
									<ion-icon name="musical-note-outline"></ion-icon> Ses Dosyası
									Seç
								</a>
												</MediaInput>
											</app-form-row>
										</div>
									</div>
									<div class="tl-item active">
										<div class="tl-dot">
											<button
												class="btn btn-ivr btn-light btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
											>
												<span
													><ion-icon name="alert-circle-outline"></ion-icon
												></span>
											</button>
										</div>
										<div class="tl-content w-100">
											<app-form-row
												label="Geçersiz Tuşlama Anansu"
												description="Kullanıcılar hatalı olarak bir tuşlama yaptığında bildirilecek anons için ses dosyası seçin."
											>
												<MediaInput v-model="form.invalid_dialing.sound">
													<button
														class="btn-white btn btn-rounded text-primary"
													>
														<ion-icon name="musical-note-outline"></ion-icon>
														Ses Dosyası Seç
													</button>
												</MediaInput>
											</app-form-row>
											<div></div>
										</div>
									</div>
								</template>
								<div class="tl-item active" v-for="(step, index) in form.steps" :key="'step-' + index">
									<div class="tl-dot">
										<div>
											<button
												@click="removeStep(index)"
												v-if="form.steps.length > 1"
												class="btn btn-ivr btn-primary btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
											>
												<span class="btn-ivr-key">{{ step.key }}</span>
												<span class="btn-ivr-action text-md"
													><ion-icon name="trash"></ion-icon
												></span>
											</button>
											<div class="w-56" v-else></div>
										</div>
									</div>
									<div class="tl-content w-100">
										<app-form-row label="İşlem">
											<el-select
												size="medium"
												v-model="step.application.action"
											>
												<el-option value="queue" label="Kuyruğa Yönlendir"
													>Kuyruğa Yönlendir</el-option
												>
												<el-option value="dial" label="Kullanıcıya Yönlendir"
													>Kullanıcıya Yönlendir</el-option
												>
												<el-option
													value="dialplan"
													label="Arama Planına Yönlendir"
													>Arama Planına Yönlendir</el-option
												>
												<el-option value="repeat" label="Menüyü Tekrarla"
													>Menüyü Tekrarla</el-option
												>
												<el-option value="hangup" label="Çağrıyı Sonlandır"
													>Çağrıyı Sonlandır</el-option
												>
											</el-select>
										</app-form-row>
										<DynamicInput
											:key="step.key"
											v-model="step.application"
											:type="step.application.action"
										></DynamicInput>
										<app-form-row
											label="Çıkış Anansu"
											description="Tuşlamadan sonra çalınacak ses dosyasını belirleyebilirsiniz."
										>
											<MediaInput v-model="step.sound">
												<a class="text-primary font-weight-500">
									<ion-icon name="musical-note-outline"></ion-icon> Ses Dosyası
									Seç
								</a>
											</MediaInput>
										</app-form-row>
									</div>
								</div>
								<div class="tl-item active">
									<div class="tl-dot">
										<el-popover
											placement="top"
											trigger="click"
											width="220"
											v-model="dialpadVisible"
										>
											<div class="py-2">
												<div class="row no-gutters">
													<div
														class="col-4 text-center"
														:class="{ 'mb-2': index < 9 }"
														v-for="(number, index) in keys"
														:key="'key-' + index"
													>
														<button
															v-if="number !== '*' && number !== '#'"
															:disabled="checkStepIsAvailable(number)"
															@click="addStep(number)"
															class="btn btn-ivr btn-outline-primary btn-lg btn-icon btn-rounded i-con-h-a"
														>
															<span>{{ number }}</span>
														</button>
														<button
															v-else
															disabled
															class="btn btn-ivr btn-white btn-lg btn-icon btn-rounded"
														>
															<span>{{ number }}</span>
														</button>
													</div>
												</div>
											</div>
											<button
												slot="reference"
												class="btn btn-ivr btn-light btn-lg btn-icon btn-rounded mb-2 i-con-h-a"
											>
												<span><i class="i-con i-con-plus b-2x"></i></span>
											</button>
										</el-popover>
									</div>
								</div>
							</div>
						</app-form-row>
					</app-card>
				</div>
				<div class="app-module-sidebar">
					<app-card title="Özellikler">
						<app-form-row
							label="Arama Planı Açıklaması"
							description="Temsilciler çağrıyı karşıladığında arama planında belirttiğiniz açıklamayı görebilirler."
						>
							<el-input
								type="textarea"
								v-model="form.description"
								size="medium"
							></el-input>
						</app-form-row>
						<el-divider
							><ion-icon name="calendar-outline"></ion-icon>
							<small class="font-weight-500">Aktif Günler</small></el-divider
						>

						<app-form-row
							description="Arama planının hangi günler kullanılabilir olacağını belirleyin."
						>
							<div class="row row-xs">
								<div class="col" v-for="(day, index) in days" :key="'day-' + index">
									<button
										@click="toggleDayForAvailable(index)"
										class="btn btn-icon btn-sm btn-rounded"
										:class="{
											'btn-primary': form.available.times[index].length > 0,
											'btn-outline-primary':
												form.available.times[index].length === 0,
										}"
									>
										{{ day }}
									</button>
								</div>
							</div>
							<div class="mt-2 text-center">
								<small class="text-muted">
									7/24 çağrı alıyorsanız
									<a
										@click="toggleAllDay"
										class="font-weight-500 cursor-pointer"
										:class="isAllDay ? 'text-danger' : 'text-primary'"
									>
										{{ isAllDay ? 'tümünü kaldır' : 'tümünü işaretle' }}
									</a>
								</small>
							</div>
						</app-form-row>
						<app-form-row>
							<template v-for="(day, index) in form.available.times">
								<div class="row row-sm mb-3" v-if="day.length > 0" :key="'time-' + index">
									<div class="col-auto">
										<button
											class="btn btn-icon btn-sm btn-rounded btn-light w-32"
										>
											{{ days[index] }}
										</button>
									</div>
									<div class="col">
										<el-select
											@input="updateHours(index)"
											size="medium"
											v-model="form.available.times[index]"
											multiple
											collapse-tags
										>
											<el-option
												v-for="(item, slot) in 48"
												:key="'h-' + slot"
												:value="slot * 0.5"
												:label="formatHour(slot * 0.5)"
												>{{ formatHour(slot * 0.5) }}</el-option
											>
										</el-select>
										<small class="text-muted d-block mt-1">
											Saat
											<span
												v-for="(part, index) in formatDaysOfHours(
													form.available.times[index]
												)"
												:key="'part-' + index"
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
										</small>
									</div>
								</div>
							</template>
						</app-form-row>
						<app-form-row
							label="Geçersiz Saat Anansu"
							description="Arama planının aktif olmadığı saatler için çalınacak ses dosyası belirleyebilirsiniz."
						>
							<MediaInput v-model="form.available.sound">
								<a class="text-primary font-weight-500">
									<ion-icon name="musical-note-outline"></ion-icon> Ses Dosyası
									Seç
								</a>
							</MediaInput>
						</app-form-row>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<style></style>
<script>
import API from "../../../utils/API";
import MediaInput from "../../../components/form/MediaInput";
import DynamicInput from "./DynamicInput";
import { mapGetters } from "vuex";

export default {
	components: {
		MediaInput,
		DynamicInput,
	},
	data() {
		return {
			test:{
				id: 22,
			},
			errors: [],
			loading: false,
			dialpadVisible: false,
			keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"],
			days: ["Pt", "S", "Ç", "P", "C", "Ct", "P"],
			form: {
				dialable: false,
				name: "",
				description: "",
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
				steps: [
					{
						key: "1",
						application: {
							id: null,
							action: null,
						},
						sound: {
							id: null,
						},
					},
				],
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.id) {
			API.get("settings/dialplans/" + to.params.id, {}, (response) => {
				next((wm) => {
					response.data.data.invalid_dialing =
						response.data.data.invalid_dialing || wm.form.invalid_dialing;
					response.data.data.opening =
						response.data.data.opening || wm.form.opening;
					response.data.data.no_action =
						response.data.data.no_action || wm.form.no_action;
					if (
						response.data.data.available &&
						Array.isArray(response.data.data.available.times)
					) {
						response.data.data.available.times = response.data.data.available.times.map(
							(day) => {
								if (!Array.isArray(day) || day.length === 0) return [];
								const hasHalf = day.some((h) => h % 1 !== 0);
								if (hasHalf) return day;
								const expanded = [];
								day.forEach((h) => {
									expanded.push(h);
									expanded.push(h + 0.5);
								});
								return expanded.sort((a, b) => a - b);
							}
						);
					}
					wm.form = response.data.data;
				});
			});
		} else {
			next();
		}
	},
	computed: {
		...mapGetters(["currentUser"]),
		isAllDay() {
			return this.form.available.times.every((day) => day.length === 48);
		},
	},
	created() {},
	methods: {
		removeStep(index) {
			this.form.steps.splice(index, 1);
		},
		addStep(key) {
			this.dialpadVisible = false;
			this.form.steps.push({
				key: key,
				application: {
					id: null,
					action: "hangup",
				},
				sound: {
					id: null,
				},
			});
			this.form.steps = this.form.steps.sort((a, b) =>
				a.key > b.key ? 1 : b.key > a.key ? -1 : 0
			);
		},
		createMenu() {
			this.addStep("2");
		},
		toggleAllDay() {
			if (this.isAllDay) {
				this.form.available.times = [[], [], [], [], [], [], []];
			} else {
				const allSlots = Array.from({ length: 48 }, (_, i) => i * 0.5);
				this.form.available.times = Array(7)
					.fill(null)
					.map(() => [...allSlots]);
			}
			this.$forceUpdate();
		},
		toggleDayForAvailable(key) {
			if (this.form.available.times[key].length > 0) {
				this.form.available.times[key] = [];
			} else {
				this.form.available.times[key] = [
					9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5,
					14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5,
				];
			}
			this.$forceUpdate();
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
		checkStepIsAvailable(key) {
			let turn = false;
			this.form.steps.forEach((item) => {
				if (item.key === key) {
					turn = true;
					return true;
				}
			});
			return turn;
		},
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
		updateHours(index) {
			this.form.available.times[index] = this.form.available.times[index].sort(
				function(a, b) {
					return a - b;
				}
			);
		},
		save() {
			if (this.$route.params.id) {
				this.update();
			} else {
				this.store();
			}
		},
		store() {
			this.loading = true;
			this.$api.post(
				"settings/dialplans",
				this.form,
				(response) => {
					this.$router.push("/settings/dial-plan/" + response.data.data.id);
					this.loading = false;
				},
				(code, errors) => {
					this.errors = errors;
					this.loading = false;
				}
			);
		},
		update() {
			this.loading = true;
			this.$api.put(
				"settings/dialplans/" + this.form.id,
				this.form,
				(response) => {
					this.$router.push("/settings/dial-plan/" + this.$route.params.id);
					this.loading = false;
				},
				(code, errors) => {
					this.errors = errors;
					this.loading = false;
				}
			);
		},
	},
};
</script>
<style lang="scss">
.my-editor {
	color: #ccc;
	font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
	font-size: 14px;
	line-height: 1.5;
	padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
	outline: none;
}
.btn-ivr {
	font-size: 14px;
	z-index: 9;
	.btn-ivr-action {
		display: none;
	}
	&:hover .btn-ivr-key {
		display: none;
	}
	&:hover .btn-ivr-action {
		display: flex;
	}
}
.tl-content .app-form-row {
	margin-bottom: 2rem !important;
}
.tl-content .app-form-row:last-child {
	margin-bottom: 1rem !important;
}
.tl-content:after {
}
</style>
