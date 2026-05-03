<template>
	<div
		class="app-sip-client b-t"
		:class="{ drag: drag.status, 'bg-dark': drag.status }"
		ref="draggableContainer"
		id="draggable-container"
	>
		<div style="margin-top:-24px;" class="mb-3">
			<app-information type="simple" :errors.sync="errors"></app-information>
		</div>
		<div class="app-sip-client-loading" v-if="loading.status"></div>

		<!--<app-crm v-if="crm.visible" :visible.sync="crm.visible" :id="crm.id"></app-crm>-->
		<Phone
			v-if="crm.visible && crm.id"
			:visible.sync="crm.visible"
			:key="crm.id"
			:call-id="crm.id"
			:phone="crm.phone"
			:number="crm.number"
			:queue="crm.queue"
		></Phone>

		<!-- Disabled Call -->

		<!-- Disabled Call -->
		<!-- Start Reconnect Modal -->
		<el-dialog
			@close="reconnect.modalVisible = false"
			:append-to-body="true"
			title="Aktif Bir Oturmunuz Var"
			:visible.sync="reconnect.modalVisible"
		>
			<div class="row">
				<div class="col-md-7 pt-4">
					<p>
						Zaten aktif bir oturumunuz var. Başka bir bilgisayarda oturumunuz
						açık veya askıda kalmış olabilir.
					</p>
					<p>
						Aktif oturumunuzu sonlandırıp buradan kullanmaya devam etmek
						isterseniz "Aktif Oturumu Sonlandır ve Tekrar Bağlan" butonuna
						tıklayarak devam edebilirsiniz.
					</p>
				</div>
				<div class="col-md-5">
					<img src="/assets/img/vectors/sip-settings.svg" alt="" />
				</div>
			</div>
			<div slot="footer" style="margin-top:-20px;">
				<el-button type="primary" size="small" @click="enterLineForce()"
					>Aktif Oturumu Sonlandır ve Tekrar Bağlan
				</el-button>
			</div>
		</el-dialog>
		<!-- End Reconnect Modal -->
		<!-- Start Sip -->
		<!--<div class="px-4">
			<div class="bg-danger-lt p-2 border-0 mb-3">
			Bu görüşme sağlıksız başladı.
		</div>
		</div>-->
		<div v-if="sip.status" class="">
			<div class="row row-xs px-4" style="margin-top:-0.5rem">
				<div class="col-auto">
					<div class="dial-info">
						<el-dropdown
							placement="top"
							trigger="click"
							size="medium"
							@command="changeState"
						>
							<span class="skill pointer" style="font-size:13px;">
								{{ client.state.name }}
								<i class="text-muted el-icon-arrow-down"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<template v-if="!sip.session">
									<el-dropdown-item
										:command="item.id"
										:key="item.id"
										:disabled="client.state.id === item.id"
										v-for="item in client.states"
									>
										{{ item.name }}
									</el-dropdown-item>
								</template>
								<template v-else>
									<div class="text-center p-3 pt-0">
										<div class="">
											Konuşma sırasında durum<br />
											değiştiremezsiniz.
										</div>
										<div class="mt-2">
											<el-button type="danger" size="mini" @click="terminate">
												<i
													class="el-icon-phone mr-1"
													style="transform: rotate(135deg)"
												></i>
												Görüşmeyi Sonlandır
											</el-button>
										</div>
									</div>
								</template>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>

				<div class="col text-right">
					<el-tooltip
						:open-delay="1000"
						v-if="drag.status"
						class="item"
						effect="dark"
						content="Sabitle"
						placement="top"
					>
						<span class="i-con-h-a pointer ml-1" @click="resetDrag"
							><i class="el-icon-coordinate"></i
						></span>
					</el-tooltip>
					<template v-if="sip.status">
						<el-tooltip
							:open-delay="1000"
							class="item"
							effect="dark"
							content="Sürükle"
							:disabled="drag.status"
							placement="top"
						>
							<span
								class="i-con-h-a pointer ml-1"
								style="cursor:move;"
								id="draggable-header"
								@mousedown="dragMouseDown"
								><i class="el-icon-rank"></i
							></span>
						</el-tooltip>
						<el-tooltip
							:open-delay="1000"
							class="item"
							effect="dark"
							content="Ayarlar"
							placement="top"
						>
							<span @click="openPreferences" class="i-con-h-a pointer ml-1"
								><i class="el-icon-setting"></i
							></span>
						</el-tooltip>
					</template>
				</div>
			</div>
			<div
				v-if="
					client.state.state === 'outbound' && !sip.session && !settings.visible
				"
				class="col-md-12 px-4 mb-2 dial-info"
				style="margin-top:-15px;"
			>
				<el-dropdown
					class="change-number-dropdown"
					placement="top"
					@command="changeNumber"
					trigger="click"
				>
					<small class="skill pointer text-muted">
						<small v-if="client.number">
							{{ client.number.number }}
							<i class="text-muted el-icon-arrow-down"></i
						></small>
						<span v-else>
							<small
								>Numara seçin
								<i class="text-muted el-icon-arrow-down"></i></small
						></span>
					</small>
					<el-dropdown-menu slot="dropdown" v-if="client.numbers.length > 0">
						<el-dropdown-item
							:disabled="client.number.number === item.number"
							:command="item.id"
							:key="item.number"
							v-for="item in client.numbers"
						>
							{{ item.number }}
							<small class="text-muted ml-2">{{ item.name }}</small>
						</el-dropdown-item>
					</el-dropdown-menu>
					<el-dropdown-menu slot="dropdown" v-else>
						<div class="p-3 text-center">
							<small
								>Sistemde arama yapılacak<br />
								numara bulunamadı.</small
							>
						</div>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div class="px-4 app-sip-client-counter pointer" v-if="!sip.session">
				<el-popover placement="top" width="300" trigger="click">
					<div>
						<div class="timeline" v-if="statesCounter !== 0">
							<div class="tl-item" v-for="item in statesChanges">
								<div class="tl-dot">
									<a class="tl-author" href="#"
										><span class="w-32 avatar circle bg-primary-lt"
											><ion-icon name="hourglass-outline"></ion-icon></span
									></a>
								</div>
								<div class="tl-content">
									<div class="">
										<span class="text-primary">{{ item.state.name }}</span>
										durumunda <br />
										<template v-if="item.end_date"
											><app-date-range-text
												:start-date="item.start_date"
												:end-date="item.end_date"
											></app-date-range-text
										></template>
										<template v-else>{{ statesCounterFormat }}</template> vakit
										geçirildi.
									</div>
									<div class="tl-date text-muted mt-1" v-if="item.end_date">
										<app-date-text :text="item.end_date"></app-date-text>
									</div>
								</div>
							</div>
						</div>
					</div>
					<h5 slot="reference">
						<ion-icon class="mr-1" name="hourglass-outline"></ion-icon
						>{{ statesCounterFormat }}
					</h5>
				</el-popover>
			</div>
			<div
				v-if="
					client.state.state === 'outbound' && !settings.visible && !sip.session
				"
				class="px-4 pt-1 mb-2 row row-xs"
			>
				<div class="col-12" v-if="settings.form.pad">
					<div class="telephone">
						<div class="row row-xs">
							<div
								class="col-4 mb-2 pointer"
								@click="numberPush(number.toString())"
								v-for="number in 9"
								:key="number"
							>
								<button
									class="w-100 btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
								>
									{{ number }}
								</button>
							</div>
							<div class="col-4 mb-2 i-con-h-a" @click="numberPush(-1)">
								<button
									class="w-100 mb-1 btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
								>
									<i class="i-con i-con-arrow-left"><i></i></i>
								</button>
							</div>
							<div class="col-4 mb-2" @click="numberPush('0')">
								<button
									class="w-100 btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
								>
									0
								</button>
							</div>
							<div class="col-4 mb-1 i-con-h-a" @click="numberPush(false)">
								<button
									class="w-100 btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
								>
									<i class="i-con i-con-trash"><i></i></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="col">
					<input
						@keyup.enter="call(client.outboundForm.number)"
						v-model="client.outboundForm.number"
						class="btn-white btn-rounded"
						type="text"
						style="text-align: left; height: 28px; line-height: 28px; padding-left:25px; width: 100%; display: inline-block; border:0;box-shadow: none; font-size:12px;"
						placeholder="Numara girin"
					/>
				</div>
				<div class="col-auto">
					<button
						class="btn btn-white text-primary  btn-sm btn-rounded"
						@click="call(client.outboundForm.number)"
						v-if="client.state.state === 'outbound'"
						style="width: 56px"
					>
						<ion-icon name="call-outline" style="font-size:15px"></ion-icon>
					</button>
				</div>
			</div>
			<div class="pb-3 px-4" v-if="sip.session">
				<el-tooltip
					class="item"
					effect="dark"
					:content="copied ? 'Kopyalandı' : 'Kopyala'"
					placement="top"
				>
					<a href="javascript:;" class="d-inline-block">
						<span
							@click="numberCopy('05** *** ** **')"
							class="text-muted d-block sip-number"
							v-if="(sip.session.remote_identity.uri.user || '').length < 11"
							><i class="el-icon-user"></i> 05** *** ** **
						</span>
						<span
							@click="numberCopy(sip.session.remote_identity.uri.user)"
							class="text-muted d-block  sip-number"
							v-else
							><i class="el-icon-user"></i>
							{{ sip.session.remote_identity.uri.user }}
						</span>
					</a>
				</el-tooltip>
				<small
					class="text-dark d-block"
					v-if="sip.session.direction === 'incoming' && crm.queue"
				>
					<b>{{ crm.queue.name }}</b>
				</small>
			</div>
		</div>

		<!-- End Settings Modal -->

		<div class="px-4">
			<div class="row row-xs mb-2" v-if="sip.status && sip.session">
				<div class="col-12">
					<div class="row row-xs mb-2">
						<div class="col-auto" v-if="!sip.session.isEstablished()">
							<button
								class="btn btn-sm btn-rounded text-center i-con-h-a btn-white"
							>
								<small style="font-size:10px"
									>{{ Math.floor(sip.time.lastCall / 60) }}:{{
										sip.time.lastCall % 60
									}}</small
								>
							</button>
						</div>
						<div class="col p-0">
							<button
								v-if="crm.id"
								@click="crm.visible = true"
								class="btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
								style="width:100%"
							>
								<i class="i-con i-con-smile"><i></i></i> Değerlendir
							</button>
						</div>
					</div>
				</div>
				<div
					class="col"
					v-if="
						sip.session.direction === 'incoming' && !sip.session.isEstablished()
					"
				>
					<button
						class="col-12 btn btn-sm btn-rounded btn-success i-con-h-a d-block"
						@click="answer"
					>
						<small style="font-size:10px" v-if="!sip.session.isEstablished()"
							>Yanıtla</small
						>
						<i class="el-icon-phone"></i>
					</button>
				</div>
				<div class="col">
					<div class="row row-xs">
						<div class="col" v-if="sip.session.isEstablished()">
							<button
								class="pr-0 pl-0 btn btn-sm btn-rounded w-100 i-con-h-a btn-white"
							>
								<small style="font-size:10px"
									>{{ Math.floor(sip.time.lastCall / 60) }}:{{
										sip.time.lastCall % 60
									}}</small
								>
							</button>
						</div>
						<div class="col-auto" v-if="sip.session.isEstablished()">
							<button
								v-if="!sip.isOnHold"
								@click="hold()"
								class="btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
							>
								<i class="el-icon-video-pause"></i>
							</button>
							<button
								v-else
								@click="unhold()"
								class="btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
							>
								<i class="el-icon-video-play"></i>
							</button>
						</div>
						<div class="col-auto" v-if="sip.session.isEstablished()">
							<button
								v-if="!sip.isMuted"
								@click="mute()"
								class="btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
							>
								<i class="el-icon-microphone"></i>
							</button>
							<button
								v-else
								@click="unmute()"
								class="btn btn-sm btn-icon btn-rounded i-con-h-a btn-white"
							>
								<i class="el-icon-turn-off-microphone"></i>
							</button>
						</div>
						<div
							:class="{
								'col-auto': sip.session.isEstablished(),
								col: !sip.session.isEstablished(),
							}"
						>
							<button
								class="btn btn-sm btn-rounded btn-danger i-con-h-a"
								:class="{
									'btn-icon ': sip.session.isEstablished(),
									'w-100': !sip.session.isEstablished(),
								}"
								@click="terminate"
							>
								<small
									style="font-size:10px"
									v-if="!sip.session.isEstablished()"
									>Sonlandır</small
								>
								<i style="transform: rotate(135deg)" class="el-icon-phone"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="app-sip-client-line px-4">
			<template v-if="!sip.session">
				<div class="mb-3 text-center" v-if="notReady.visible">
					<app-svg class="col-10 mx-auto" src="/assets/img/vectors/not-ready.svg"></app-svg>
					<h6 class="font-weight-bold">Henüz Hazır Değil</h6>
					<span
						>Yapılandırmalarınız ve izinleriniz kontrol ediliyor.</span
					>
				</div>
				<button
					v-if="!sip.status"
					:disabled="loading.status || notReady.visible || !socketId || sipLock.active"
					class="col-md-12 btn btn-sm btn-rounded btn-white i-con-h-a d-block"
					@click="enterLine()"
				>
					<span v-if="sipLock.active" class="">Başka Sekmede Aktif</span>
					<span v-else-if="notReady.visible" class=""><small>({{30 - notReady.counter}})</small> Tekrar Dene</span>
					<span v-else class="">Hatta Gir</span>
					<ion-icon
						class="float-right"
						name="log-in-outline"
						style="font-size:17px;"
					></ion-icon>
				</button>
				<small v-if="!sip.status && sipLock.active" class="text-muted d-block text-center mt-1">
					SIP bu hesap için başka bir sekmede zaten açık.
				</small>
				<button
					v-if="sip.status"
					:disabled="loading.status"
					class="col-md-12 btn btn-sm btn-rounded btn-white i-con-h-a d-block"
					@click="exit()"
				>
					Hattan Çık
					<ion-icon
						class="float-right"
						name="log-out-outline"
						style="font-size:17px;"
					></ion-icon>
				</button>
			</template>
			<!--Start Status Bard-->
			<!--:class="{'active':dialWarningVisible,'success': sip.connectedCall, 'wait': !sip.connectedCall && !sip.ringing}"-->
			<!--<div v-if="sip.status" class="dial-warning">
        <div class="dial-warning-more" @click="logs.visible = !logs.visible"><i class="el-icon-arrow-down"></i></div>
      </div>-->
			<!--End Status Bard-->

			<div class="app-sip-client-console py-3" v-if="logs.visible">
				<small class="mb-1 d-block"><strong>Durum Mesajları</strong></small>
				<template v-for="item in logs.messages">
					<small class=" mb-0 d-block">{{ $t(item.message) }}</small>
					<small class="text-muted">{{ item.date }}</small>
				</template>
			</div>

			<!--Start Loading-->
			<div
				:class="{ active: loading.status }"
				class="text-muted app-sip-client-loading-message"
			>
				<i class="el-icon-loading"></i> <small>{{ loading.message }} ...</small>
			</div>
			<!--End Loading-->
		</div>
		<!-- End Sip -->
	</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import EventBus from "@/utils/EventBus";
import JsSIP from "jssip";
import Crm from "./Crm";
import Phone from "../../views/agent/Phone";
import Formatters from "@/utils/Formatters";

export default {
	components: {
		Crm,
		Phone,
	},
	data() {
		return {
			notReady: {
				visible: false,
				interval: null,
				timeout: null,
				counter: 0,
			},
			unhealthy: false,
			copied: false,
			errors: [],
			reconnect: {
				modalVisible: false,
			},
			loading: {
				status: false,
				message: "",
			},
			client: {
				status: false,
				number: false,
				states: [],
				state: {},
				numbers: [],
				queues: [],
				outboundForm: {
					number: "",
				},
			},
			crm: {
				visible: false,
				id: null,
				number: null,
				queue: null,
				phone: null,
			},
			settings: {
				visible: false,
				form: {
					auto_crm: true,
					default_number: null,
					default_state: null,
					pad: false,
				},
			},
			logs: {
				visible: false,
				messages: [],
			},
			sip: {
				status: false,
				isCalling: false,
				isRinging: false,
				isMuted: false,
				isOnHold: false,
				direction: false,
				socket: false,
				phone: false,
				session: false,
				disconnectTimer: null,
				intentionalDisconnect: false,
				time: {
					lastState: 0,
					interval: false,
					lastCall: 0,
				},
			},
			audio: {
				lineIn: null,
				lineExit: null,
				incoming: null,
				remote: null,
			},
			drag: {
				status: false,
				position: "fixed",
				clientX: undefined,
				clientY: undefined,
				movementX: 0,
				movementY: 0,
			},
			dialWarningInterval: false,
			dialWarningVisible: true,
			statesChanges: [],
			statesCounter: 0,
			statesCounterInterval: null,
		};
	},
	computed: {
		...mapGetters(["currentUser", "socket", "socketId", "sipLock"]),
		statesCounterFormat() {
			return Formatters.millisecondToDate(this.statesCounter);
		},
	},
	created() {
		/*
		 * Listen Events
		 * */
		EventBus.$on("sipStartCall", this.startCall);

		this.setAudios();
		this.startDialWarning();
		/*
		 * Required User Settings
		 * */
		if (this.currentUser && this.currentUser.settings) {
			this.settings.form = this.currentUser.settings.sip;
		}
	},
	beforeDestroy() {
		EventBus.$off("sipStartCall");
		this.setLoading("exit");
		this.exit();
	},
	methods: {
		...mapActions(["updateCurrentUser"]),
		startCall(number) {
			console.log(number);
			if (
				!this.client.status ||
				!this.sip.status ||
				this.client.state.id !== 2
			) {
				this.$message.warning(
					"Arama başlatabilmek için hatta girmiş olmalısınız ve dış arama durumu aktif olmalır."
				);
			} else {
				this.call(number);
			}
		},
		clearErrors() {
			this.errors = [];
		},
		/*
		 * Line Methods
		 * */
		checkBrowserSupport() {
			const ua = navigator.userAgent;
			// Edge (Chromium) — UA'da hem "Edg" hem "Chrome" var, önce kontrol
			const edgeMatch = ua.match(/Edg\/(\d+)/);
			if (edgeMatch) {
				const version = parseInt(edgeMatch[1], 10);
				return { name: "Edge", version, supported: version >= 88 };
			}
			// Chrome (Opera hariç)
			const chromeMatch = ua.match(/Chrome\/(\d+)/);
			if (chromeMatch && !/OPR\//.test(ua)) {
				const version = parseInt(chromeMatch[1], 10);
				return { name: "Chrome", version, supported: version >= 88 };
			}
			// Firefox
			const firefoxMatch = ua.match(/Firefox\/(\d+)/);
			if (firefoxMatch) {
				const version = parseInt(firefoxMatch[1], 10);
				return { name: "Firefox", version, supported: version >= 78 };
			}
			// Safari — Version/X.X UA pattern'i
			const isSafari = /Safari/.test(ua) && !/Chrome|Chromium/.test(ua);
			if (isSafari) {
				const safariMatch = ua.match(/Version\/(\d+)/);
				const version = safariMatch ? parseInt(safariMatch[1], 10) : 0;
				return { name: "Safari", version, supported: version >= 14 };
			}
			return { name: "Bilinmeyen tarayıcı", supported: false };
		},
		enterLine(successCallback = () => {}, failedCallback = () => {}) {
			if (!this.currentUser || !this.currentUser.settings) return;
			// Başka sekmede SIP aktifse bu tab'den girmeye izin verme.
			if (this.sipLock.active) return;
			// Socket bağlantısı henüz kurulmamışsa enter-line isteği gönderilemez —
			// back-end SIP sahipliği için socket_id bekliyor.
			if (!this.socketId) {
				this.$message.warning('Bağlantı kuruluyor, lütfen birkaç saniye bekleyin.');
				return;
			}
			const browser = this.checkBrowserSupport();
			if (!browser.supported) {
				const versionText = browser.version ? " " + browser.version : "";
				this.errors = [{
					message: "Bu tarayıcı (" + browser.name + versionText + ") sip client için desteklenmiyor. Lütfen güncel Chrome, Edge, Firefox veya Safari kullanın.",
				}];
				return;
			}
			let self = this;
			this.clearNotReady();
			this.setLoading("enter-line");
			this.log("enter-line");
			this.$api.patch(
				"soft-phone/enter-line",
				{
					state_id: this.currentUser.settings.sip.default_state,
					socket_id: this.socketId,
				},
				(response) => {
					this.log("enter-line-success");
					this.client.status = true;
					this.client.states = this.currentUser.states;
					this.client.numbers = this.currentUser.numbers;
					this.changeState(this.currentUser.settings.sip.default_state, () => {
						this.connect();
					});
					// Others
					successCallback();
				},
				(code, errors) => {
					this.log("enter-line-failed");
					if (code === 409 && errors && errors.key === "sip_host_taken") {
						// Başka sekme hattı tuttu — kilidi aktifleştir, kullanıcıyı uyar.
						this.$store.commit('setSipLock', { active: true, lockedBy: null });
						this.clearLoading();
					} else if (code === 409) {
						// Eski "aktif oturum var" akışı.
						this.reconnect.modalVisible = true;
						this.clearLoading();
					} else if (errors.key && errors.key === "sip_not_ready") {
						this.setLoading('not-ready');
						this.notReady.visible = true;
						this.notReady.interval = setInterval(() => {
							self.notReady.counter++;
						}, 1000);
						this.notReady.timeout = setTimeout(() => {
							self.enterLine();
						}, 30000);
					} else {
						this.errors = errors;
						this.clearLoading();
					}
					// Others
					
					failedCallback(code);
				}
			);
		},
		clearNotReady() {
			this.clearLoading();
			this.notReady.visible = false;
			this.notReady.counter = 0;
			clearTimeout(this.notReady.timeout);
			clearInterval(this.notReady.interval);
		},
		exit() {
			if (this.client.status || this.sip.status) {
				this.log("exit");
				this.setLoading("exit-line");
				this.exitLine(
					() => {
						this.log("exit-success");
						this.client.status = false;
						this.disconnect();
					},
					() => {
						this.clearLoading();
						this.client.status = false;
						this.disconnect();
					}
				);
			}
		},
		exitLine(successCallback = () => {}, failedCallback = () => {}) {
			this.log("exit-line");
			this.$api.patch(
				"soft-phone/exit-line",
				{},
				(response) => {
					this.log("exit-line-success");
					// Others
					successCallback();
				},
				(code, errors) => {
					this.log("exit-line-failed");
					this.errors = errors;
					// Others
					failedCallback();
				}
			);
		},
		enterLineForce() {
			this.log("enter-line-force");
			this.reconnect.modalVisible = false;
			this.setLoading("exit-line-force");
			this.exitLine(
				() => {
					this.log("enter-line-force-success");
					this.setLoading("exit-line-force");
					setTimeout(() => {
						this.enterLine();
					}, 1000);
				},
				() => {
					this.log("enter-line-force-failed");
					this.reconnect.modalVisible = true;
					this.clearLoading();
				}
			);
		},
		/*
		 * Status Methods
		 * */
		changeState(id, handle = () => {}) {
			this.setLoading("Durum değiştiriliyor");
			this.$api.patch(
				"soft-phone/change-state/" + id,
				{},
				() => {
					let self = this;
					this.client.state = this.client.states.find((item) => {
						return item.id === id;
					});
					if (this.client.numbers.length > 0 && id === 2) {
						if (this.currentUser.settings.sip.default_number) {
							this.changeNumber(this.currentUser.settings.sip.default_number);
						}
					} else {
						this.client.number = false;
					}
					this.clearLoading("change-state");
					//counter
					if (this.statesChanges.length > 0) {
						this.statesChanges[
							this.statesChanges.length - 1
						].end_date = new Date().toString();
					}
					this.statesChanges.push({
						state: this.client.state,
						start_date: new Date().toString(),
						end_date: null,
					});
					this.statesCounter = 0;
					clearInterval(this.statesCounterInterval);
					this.statesCounterInterval = setInterval(() => {
						self.statesCounter++;
					}, 1000);
					//
					handle();
				},
				(code, errors) => {
					this.errors = errors;
					this.clearLoading("change-state");
				}
			);
		},
		resetCounter() {},
		changeNumber(id) {
			this.setLoading("Numara değiştiriliyor");
			this.$api.patch(
				"soft-phone/outbound-number/" + id,
				{},
				() => {
					this.client.number = this.client.numbers.find((item) => {
						return item.id === id;
					});
					this.clearLoading();
				},
				(code, errors) => {
					this.errors = errors;
					this.clearLoading();
				}
			);
		},
		setAudios() {
			this.log("set-audios");
			this.audio.lineIn = new window.Audio("/assets/sound/line-in.mp3");
			this.audio.lineExit = new window.Audio("/assets/sound/line-exit.mp3");
			this.audio.incoming = new window.Audio("/assets/sound/calling.mp3");
			this.audio.remote = new window.Audio();
			this.audio.incoming.loop = true;
			this.audio.remote.loop = true;
		},
		/*
		 * Sip Connect Methods
		 * */
		buildIceServers() {
			const stun = this.currentUser.servers.stun;
			const stunUrl = stun && stun.length > 5 ? stun : "stun:stun.l.google.com:19302";
			const servers = [{ urls: [stunUrl] }];
			const turn = this.currentUser.servers.turn;
			if (turn && turn.urls && turn.username && turn.credential) {
				servers.push({
					urls: turn.urls,
					username: turn.username,
					credential: turn.credential,
				});
			}
			return servers;
		},
		connect() {
			this.log("connect");
			this.setLoading("connect");
			// Set Self For This
			let self = this;
			this.sip.socket = new JsSIP.WebSocketInterface(
				this.currentUser.servers.sip
			);
			// Configuration
			let configuration = {
				sockets: [this.sip.socket],
				connection_recovery_min_interval: 2,
				connection_recovery_max_interval: 30,
				no_answer_timeout: 240,
				register_expires: 600,
				uri: this.currentUser.sip.connection_string,
				password: this.currentUser.sip.password,
				mediaConstraints: { audio: true, video: false },
				pcConfig: { iceServers: this.buildIceServers() },
				authorization_user: this.currentUser.sip.username,
				display_name: this.currentUser.sip.username,
			};
			// Start Phone
			if (process.env.VUE_APP_ENV !== 'production') {
				JsSIP.debug.enable('JsSIP:*');
			} else if (!localStorage.getItem('debug')) {
				JsSIP.debug.enable('JsSIP:WARN:*,JsSIP:ERROR:*');
			}
			this.sip.phone = new JsSIP.UA(configuration);
			this.sip.phone.start();
			this.sip.phone.on("connecting", function(e) {
				console.log("connecting", e);
			});
			this.sip.phone.on("connected", function(e) {
				self.log("sip-connected");
				if (self.sip.disconnectTimer) {
					clearTimeout(self.sip.disconnectTimer);
					self.sip.disconnectTimer = null;
					self.log("sip-reconnect-grace-recovered");
				}
			});
			this.sip.phone.on("registered", function(e) {
				self.audio.lineIn.play();
				self.sip.status = true;
				self.listenEvents();
				self.log("sip-registered");
				self.clearLoading();
			});
			this.sip.phone.on("disconnected", function(e) {
				self.log("sip-disconnected");
				if (self.sip.intentionalDisconnect) {
					self.sip.intentionalDisconnect = false;
					self.clearSip();
					return;
				}
				if (self.sip.disconnectTimer) return;
				self.sip.disconnectTimer = setTimeout(() => {
					self.sip.disconnectTimer = null;
					self.log("sip-reconnect-grace-expired");
					self.clearSip();
				}, 10000);
			});
			this.sip.phone.on("registrationFailed", function(e) {
				self.log("sip-registration-failed");
			});
			this.sip.phone.on("registrationExpiring", function(e) {
				self.log("sip-registration-expiring");
			});
			this.sip.phone.on("unregistered", function(e) {
				self.log("sip-unregistered");
			});
			this.sip.phone.on("newRTCSession", function(e) {
				self.log("sip-new-rtc-session", e);
				if (self.sip.session) {
					self.sip.session.terminate();
				}
				self.sip.session = e.session;

				if (self.sip.session.direction === "incoming") {
					/*Dikkat bu if bloğunun üzerinde olması gerekebilir. V3.0.12 ile eklendi.*/
					self.sip.session.on("peerconnection", (data) => {
						self.sip.session.connection.addEventListener("track", (e) => {
							self.log("sip-track", e);
							self.audio.incoming.pause();
							if (e.streams && e.streams[0]) {
								self.audio.remote.srcObject = e.streams[0];
								self.audio.remote.play();
							}
						});
					});
					self.audio.incoming.play();
				} else {
					self.sip.session.connection.addEventListener("track", (e) => {
						self.log("sip-track", e);
						if (e.streams && e.streams[0]) {
							self.audio.remote.srcObject = e.streams[0];
							self.audio.remote.play();
						}
					});
				}
				self.sip.session.on("icecandidate", function(event) {
					event.ready();
				});
				self.sip.session.on("failed", (e) => {
					self.reset();
					self.log("sip-failed", e);
				});
				self.sip.session.on("connecting", (e) => {
					self.log("sip-connecting", e);
				});
				self.sip.session.on("ended", (e) => {
					self.reset();
					self.log("sip-ended", e);
				});
				self.sip.session.on("confirmed", function() {
					self.log("sip-confirmed");
					const conn = self.sip.session && self.sip.session.connection;
					if (!conn || conn._nebulaStateListenerAttached) return;
					conn._nebulaStateListenerAttached = true;
					conn._nebulaIceRestartAttempted = false;
					conn._nebulaIceRestartTimer = null;
					conn.addEventListener("connectionstatechange", () => {
						const state = conn.connectionState;
						self.log("sip-connectionstatechange-" + state);
						if (state === "connected") {
							if (conn._nebulaIceRestartTimer) {
								clearTimeout(conn._nebulaIceRestartTimer);
								conn._nebulaIceRestartTimer = null;
							}
							conn._nebulaIceRestartAttempted = false;
							return;
						}
						if (state === "closed" && self.sip.session) {
							self.reset();
							return;
						}
						if (state === "failed" && self.sip.session) {
							if (conn._nebulaIceRestartAttempted) {
								self.log("sip-ice-restart-already-tried-reset");
								self.reset();
								return;
							}
							conn._nebulaIceRestartAttempted = true;
							try {
								self.log("sip-ice-restart-attempt");
								if (typeof conn.restartIce === "function") {
									conn.restartIce();
								} else if (self.sip.session.renegotiate) {
									self.sip.session.renegotiate({ useUpdate: false, rtcOfferConstraints: { iceRestart: true } });
								}
								conn._nebulaIceRestartTimer = setTimeout(() => {
									if (self.sip.session && conn.connectionState !== "connected") {
										self.log("sip-ice-restart-timeout-reset");
										self.reset();
									}
								}, 10000);
							} catch (err) {
								self.log("sip-ice-restart-error", err);
								self.reset();
							}
						}
					});
				});
				self.sip.session.on("progress", (e) => {
					self.log("sip-progress", e);
					self.timer();
				});
			});
		},
		disconnect() {
			this.log("disconnect");
			this.sip.intentionalDisconnect = true;
			try {
				this.sip.phone.stop();
			} catch (e) {
				this.clearSip();
			}
		},
		clearSip() {
			if (this.sip.disconnectTimer) {
				clearTimeout(this.sip.disconnectTimer);
				this.sip.disconnectTimer = null;
			}
			this.sip.socket = false;
			this.sip.session = false;
			this.resetDrag();
			this.client.number = false;
			this.client.status = false;
			this.sip.status = false;
			this.client.status = false;
			this.statesCounter = 0;
			clearInterval(this.statesCounterInterval);

			this.closeEvents();
			this.reset();
			this.audio.lineExit.play();
		},
		/*
		 * Sip Client Action Methods
		 * */
		/*startAutoCall(){
      this.reset();
      this.changeState(1);
    },*/
		// Client-side click-to-call ve manuel dialpad arama yolu.
		// Server-side originate (task akışı) bu metodu KULLANMAZ; oradaki
		// çağrı backend'den AMI ile başlatılır ve agent'a incoming INVITE
		// olarak döner. Burası agent'ın numarayı bildiği senaryolar içindir
		// (manuel dial, ileride rehberden tıklama vb).
		call(number) {
			if (number.length > 0) {
				this.setLoading("Aranıyor");
				this.$api.get(
					"soft-phone/before-call?number=" + number,
					{},
					() => {
						this.clearLoading();
						this.sip.phone.call(number, {
							mediaConstraints: { audio: true, video: false },
							pcConfig: {
								iceServers: this.buildIceServers(),
							},
						});
						if (this.currentUser.settings.sip.auto_crm) {
							this.crm.id = null;
							this.crm.visible = true;
						}
					},
					(code, errors) => {
						this.crm.visible = false;
						this.errors = errors;
						this.clearLoading();
					}
				);
			}
		},
		answer() {
			this.audio.incoming.pause();
			if (this.sip.session) {
				this.sip.session.answer({
					mediaConstraints: { audio: true, video: false },
					pcConfig: {
						iceServers: this.buildIceServers(),
					},
				});
				this.timer();
				if (this.currentUser.settings.sip.auto_crm) {
					this.crm.visible = true;
				}
			}
		},
		mute() {
			this.sip.session.mute();
			this.sip.isMuted = true;
		},
		unmute() {
			this.sip.session.unmute();
			this.sip.isMuted = false;
		},
		hold() {
			this.sip.session.hold();
			this.sip.isOnHold = true;
		},
		unhold() {
			this.sip.session.unhold();
			this.sip.isOnHold = false;
		},
		terminate() {
			if (this.sip.session) {
				this.sip.session.terminate();
			}
			this.reset();
		},
		reset() {
			this.audio.incoming.pause();
			if (this.audio.remote) {
				this.audio.remote.pause();
				this.audio.remote.srcObject = null;
			}
			this.client.outboundForm.number = "";
			this.sip.session = false;
			this.sip.time.lastCall = 0;
			clearInterval(this.sip.time.interval);
			this.sip.time.interval = false;
			this.clearLoading();
			this.log("reset");
		},
		timer() {
			this.sip.time.lastCall = 0;
			clearInterval(this.sip.time.interval);
			this.sip.time.interval = setInterval(() => {
				this.sip.time.lastCall++;
			}, 1000);
		},
		/*
		 * Log
		 * */
		startDialWarning() {
			this.dialWarningInterval = setInterval(() => {
				this.dialWarningVisible = !this.dialWarningVisible;
			}, 1000);
		},
		stopDialWarning() {
			clearInterval(this.dialWarningInterval);
		},
		setLoading(message = "") {
			this.clearErrors();
			this.loading.status = true;
			this.loading.message = this.$t(message);
		},
		clearLoading(method = false) {
			console.log("Clear", method);
			this.loading.status = false;
			this.loading.message = "";
		},
		log(string, data = null) {
			this.logs.messages.push({
				message: this.$t(string),
				date: new Date(),
			});
			console.log(
				"%c Log : " + this.$t(string),
				"background: #222; color: #bada55",
				{
					message: string,
					data: data,
					date: new Date(),
				}
			);
		},
		message() {},
		listenEvents() {
			this.socket.server.on("crm", this.crmEvent);
			this.socket.server.on("agent_states", this.statusUserEvent);
		},
		statusUserEvent(data) {
			console.log("Status User event:", data, "| mySip:", this.currentUser.sip && this.currentUser.sip.username);
			// Socket server'dan gelen format: { sip, current_state, timestamp }
			if (data.sip && data.current_state === 'avail' && this.sip.session) {
				const mySip = this.currentUser.sip && this.currentUser.sip.username;
				// PJSIP endpoint adı {org_key}_{sip} formatında olabilir (örn: acme_1001)
				const sipMatch = mySip && (data.sip === mySip || data.sip.endsWith('_' + mySip));
				if (sipMatch) {
					console.log("Listen Events: My SIP went avail - resetting call");
					this.reset();
				}
			}
		},
		crmEvent(data) {
			console.log("Listen Events: Crm", data);
			if (!data.call_id) {
				this.unhealthy = true;
			}
			this.crm.id     = data.call_id;
			this.crm.number = data.number || null;
			this.crm.queue  = data.queue  || null;
			this.crm.phone  = data.phone  || null;
		},
		closeEvents() {
			if (this.socket.status) {
				this.socket.server.off("crm", this.crmEvent);
				this.socket.server.off("agent_states", this.statusUserEvent);
			}
		},
		/*
		 * Settings
		 * */
		numberPush(key) {
			if (key === -1) {
				this.client.outboundForm.number = this.client.outboundForm.number.slice(
					0,
					-1
				);
			} else if (!key) {
				this.client.outboundForm.number = "";
			} else {
				this.client.outboundForm.number = this.client.outboundForm.number + key;
			}
		},
		/*
		 * Drag
		 * */
		resetDrag() {
			this.drag.status = false;
			this.drag.clientX = undefined;
			this.drag.clientY = undefined;
			this.drag.movementX = 0;
			this.drag.movementY = 0;
			try {
				this.$refs.draggableContainer.style.top = "unset";
				this.$refs.draggableContainer.style.left = "unset";
				this.$refs.draggableContainer.style.bottom = "50px";
			} catch (e) {
				console.log("Drag Error:", e);
			}
		},
		dragMouseDown: function(event) {
			this.drag.status = true;
			event.preventDefault();
			this.drag.clientX = event.clientX;
			this.drag.clientY = event.clientY;
			document.onmousemove = this.elementDrag;
			document.onmouseup = this.closeDragElement;
		},
		elementDrag: function(event) {
			event.preventDefault();
			this.drag.movementX = this.drag.clientX - event.clientX;
			this.drag.movementY = this.drag.clientY - event.clientY;
			this.drag.clientX = event.clientX;
			this.drag.clientY = event.clientY;
			this.$refs.draggableContainer.style.top =
				this.$refs.draggableContainer.offsetTop - this.drag.movementY + "px";
			this.$refs.draggableContainer.style.left =
				this.$refs.draggableContainer.offsetLeft - this.drag.movementX + "px";
			this.$refs.draggableContainer.style.bottom = "unset";
		},
		closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		},
		openPreferences() {
			EventBus.$emit("openPreferences", "phone");
		},
		numberCopy(number) {
			let self = this;
			this.copied = true;
			setTimeout(() => {
				self.copied = false;
			}, 2000);
			const el = document.createElement("textarea");
			el.value = number;
			el.setAttribute("readonly", "");
			el.style.position = "absolute";
			el.style.left = "-9999px";
			document.body.appendChild(el);
			const selected =
				document.getSelection().rangeCount > 0
					? document.getSelection().getRangeAt(0)
					: false;
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
			if (selected) {
				document.getSelection().removeAllRanges();
				document.getSelection().addRange(selected);
			}
		},
	},
	i18n: {
		messages: {
			tr: {
				"not-ready": "İzinler yapılandırılıyor.",
				"connect": "Sip başlatılıyor.",
				"set-audios": "Ses ayarları kontrol ediliyor.",
				"exit": "Çıkış yapılıyor.",
				"exit-line": "Hattan çıkılıyor.",
				"exit-line-success": "Hattan çıkıldı.",
				"exit-success": "Çıkış yapıldı.",
				"enter": "Giriş yapılıyor.",
				"enter-line": "Hatta giriliyor.",
				"enter-line-force": "Tekrar hatta giriliyor.",
				"enter-line-success": "Hatta girildi.",
				"enter-line-failed": "Hatta firerken bir hatayla karşılaşıldı.",
				"enter-success": "Giriş yapıldı.",
				"sip-connected": "Sip bağlandı.",
				"disconnect": "Sip sonlandırılıyor.",
				"sip-disconnected": "Sip sonlandırıldı.",
				"sip-registered": "Sip oturumu başlatıldı.",
				"sip-registration-failed":
					"Sip oturumu başlatılırken bir hatayla karşılaşıldı.",
				"sip-unregistered": "Sip oturumu sonlandırıldı.",
				"sip-failed": "Çağrı sonlandı.",
				"sip-ended": "Çağrı sonlandırıldı.",
				"sip-connecting": "Bağlanıyor.",
				"sip-progress": "Çağrı işleniyor.",
				"sip-new-rtc-session": "Çağrı karşılandı.",
				"reset": "Sip sıfırlandı.",
			},
		},
	},
};
</script>
<style>
.change-number-dropdown .el-dropdown-menu__item {
	line-height: 16px !important;
}

.el-popper {
	border-radius: 8px;
	box-shadow: 0 0 10px -5px rgba(0, 0, 0, 0.1);
}

.number:hover {
	background: rgba(120, 120, 120, 0.07) !important;
}

.number {
	border: 1px solid #eaeaea;
	border-radius: 200px;
}

.app-sip-client .app-form-row {
	margin-bottom: -5px !important;
}

.app-sip-client label {
	font-weight: 500;
}

.app-sip-client .form-text {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 100%;
	font-weight: 400;
	opacity: 0.7;
}

.app-sip-client {
	position: relative;
	z-index: 9;
	border-radius: 6px;
	width: 251px;
	height: auto;
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;
	bottom: 50px;
	margin-bottom: -50px;
	margin-top: 50px;
	overflow: hidden;
}

#draggable-header {
	z-index: 10;
}

.app-sip-client.drag {
	position: fixed;
	margin-bottom: 0 !important;
	border-radius: 8px;
	margin-top: 0 !important;
	bottom: 50px;
}

.app-sip-client .dial-info span {
	display: block;
	font-size: 14px;
}

.app-sip-client .dial-info i {
	font-size: 10px;
	margin-left: 2px;
}

.dial-icons .dial-icon i {
	font-size: 18px;
	color: #fff;
	border-width: 3px;
}

.dial-icons .dial-icon.yes {
	background: #2dd256;
}

.dial-icons .dial-icon.no {
	background: #fe4635;
	transform: rotate(135deg);
}

.dial-icons .dial-icon {
	cursor: pointer;
	height: 30px;
	width: 30px;
	display: inline-block;
	border-radius: 40px;
	background: #dadada;
	text-align: center;
	padding-top: 6px;
	transition: all 0.4s;
}

.dial-time {
	text-align: right;
	width: 100%;
	display: inline-block;
	font-size: 12px;
	margin-bottom: 15px;
}

.skill {
	margin-bottom: 15px;
}

.dial-warning {
	height: 5px;
	border-radius: 12px;
	background: #2dd256 !important;
	width: 100%;
	margin-top: 15px;
	opacity: 0.2;
	transition: 0.2s;
	position: relative;
	cursor: pointer;
}

.dial-warning:hover > .dial-warning-more {
	display: block !important;
}

.dial-warning-more {
	display: none;
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	text-align: center;
	padding-top: 2px;
}

.dial-warning.success {
	background: #2dd256 !important;
	transition: 0.8s;
	opacity: 0.7;
}

.dial-warning.end {
	background: #fe4635 !important;
	transition: 0.8s;
	opacity: 0.7;
}

.dial-warning.wait {
	background: var(--primary-color) !important;
	transition: 0.8s;
	opacity: 0.2;
}
.dial-warning.active {
	opacity: 1;
}

.phone {
	font-size: 12px !important;
}

.session-actions i {
	font-size: 20px;
	cursor: pointer;
}

.dialer-form .el-dropdown {
	width: 47px;
}

.app-sip-client-console {
	max-height: 130px;
	overflow: auto;
}

.app-sip-client-loading {
	position: absolute;
	opacity: 0.4;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	backdrop-filter: blur(0);
}

.app-sip-client-loading-message {
	height: 0;
	overflow: hidden;
	transition: 0.5s;
	margin-top: 0;
}

.app-sip-client-loading-message.active {
	height: 25px;
	margin-top: 1rem;
}
.sip-number-copy {
	display: none;
}
.sip-number:hover .sip-number-copy {
	display: block;
}
.app-sip-client-counter h5 {
	font-family: "Source Code Pro", monospace !important;
	font-size: 16px;
}
</style>
