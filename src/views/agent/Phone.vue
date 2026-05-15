<template>
	<div>
		<el-dialog
			custom-class="app-modal app-phone-modal"
			:append-to-body="true"
			:visible.sync="phoneVisible"
		>
			<template slot="title">
				<div class="p-2 pl-2">
					<div class="row row-sm align-items-center">
						<div class="col-auto">
							<span
								v-if="!contact.name && !contact.surname"
								class="avatar border w-40 bg-secondary"
								><i class="el-icon-user"></i
							></span>
							<span v-else class="avatar border w-40 bg-secondary">
								<span v-if="contact.name">{{ contact.name[0] }}</span>
								<span v-if="contact.surname">{{ contact.surname[0] }}</span>
							</span>
						</div>
						<div class="col pt-1">
							<h5
								class="mb-0 font-weight-bold"
								v-if="!contact.name && !contact.surname"
							>
								Yeni Müşteri
							</h5>
							<h5 class="mb-0 font-weight-bold" v-else>
								{{ contact.name }} {{ contact.surname }}
							</h5>

								<span class="d-block pointer" @click="numberCopy(contact.number)">
									<el-tooltip
								class="item"
								effect="dark"
								:content="copied ? 'Kopyalandı' : 'Kopyala'"
								placement="bottom"
							><span>{{
									contact.number
								}}</span></el-tooltip></span>

						</div>
						<div class="col text-right" v-if="numberInfo && numberInfo.name">
							<small class="text-muted d-block">Operasyon</small>
							<span class="font-weight-bold">{{ numberInfo.name }}</span>
						</div>
						<div class="col-auto pr-5"></div>
					</div>
				</div>
			</template>
			<app-information type="simple" :errors="errors.getCrm"></app-information>
			<div class="row no-gutters">
				<div class="col-8 col-100" id="history" v-if="contact.id">
					<div class="px-3 py-2 pb-4">
						<History
							:expand="atScrollBottom"
							:active-call-id="callId"
							:active-task-id="taskId"
							:contact-id="contact.id"
							:crm-number="number"
							:crm-queue="queue"
							:crm-forms="forms"
							:crm-result-codes="resultCodes"
							:existing-note="existingNote"
						></History>
					</div>
				</div>
				<div class="col-4 b-l" v-if="contact.id">
					<div class="col-100 phone-sidebar pb-3" style="overflow-y:scroll">
						<div v-if="activeTab === 'actions'">
							<Risk
								:contact-id="contact.id"
								:contact-detail="contact"
								@changed="handleRiskChange"
							></Risk>
							<div class="b-b">
								<Block
									:id="contact.blacklist ? contact.blacklist.id : null"
									:contact-id="contact.id"
									@changed="handleBlacklistChange"
								></Block>
							</div>
							<div class="b-b px-4 pb-3 pt-4">
								<h6 class="mb-0 font-weight-bold">Randevular</h6>
							</div>
							<Appointment
								:contact-id="contact.id"
								:initial="appointments"
								:task-id="taskId"
							></Appointment>
						</div>
						<div v-else>
							<div class="b-b px-4 py-3 text-center">
								<span
									class="float-left d-inline-block"
									style="margin-top:-5px;"
									@click="activeTab = 'actions'"
								>
									<el-button type="text" size="mini"
										><i class="el-icon-arrow-left"></i> Geri</el-button
									>
								</span>
								<h6 class="mb-0 font-weight-500">Mesajlar</h6>
							</div>
							<div class="text-center py-5 px-4">
								<app-svg
									class="col-10 mx-auto"
									src="/assets/img/vectors/crm-messages.svg"
								></app-svg>
								<small style="font-weight:700" class=" mb-0 text-muted d-block"
									>GÖRÜŞME KAYDI BULUNAMADI</small
								>
								<small>SMS geçmişi bulunmuyor</small>
							</div>
						</div>
					</div>
					<div class="app-phone-action-buttons px-4 py-4 b-t bg-white">
						<div class="row row-sm" v-if="activeTab !== 'actions'">
							<div class="col text-left">
								<small>Sms varsayılan numaradan gönderilecek. </small>
								<el-popover trigger="click" placement="top" width="300">
									<app-form-row
										label="Varsayılan Numara"
										description="SMS'in gönderileceği numarayı son görüşme yaptığınız numara olarak belirler."
									>
										<el-switch :disabled="true"></el-switch>
									</app-form-row>
									<app-form-row label="Gönderici Numara">
										<el-select
											:disabled="true"
											placeholder="Sms için tanımlı herhangi bir numara bulunamadı"
										>
											<el-option value="1" label="03127860056"
												>03127860056</el-option
											>
										</el-select>
									</app-form-row>
								</el-popover>
								<div class="mt-3">
									<el-input
										v-model="message"
										:disabled="false"
										placeholder="Mesaj yazın..."
										type="textarea"
										autosize
									>
									</el-input>
								</div>
							</div>
							<div class="text-right col-auto">
								<button
									v-if="activeTab === 'actions'"
									@click="toggleMessages"
									class="btn btn-md btn-raised btn-icon btn-rounded btn-primary"
								>
									<ion-icon
										style="font-size:20px; margin-top:5px;"
										name="mail-outline"
									></ion-icon>
								</button>
								<button
									style="postion:absolute;"
									v-else
									class="btn btn-md btn-raised btn-icon btn-rounded btn-primary"
								>
									<ion-icon
										style="font-size:20px; margin-top:5px;"
										name="paper-plane-outline"
									></ion-icon>
								</button>
							</div>
						</div>
						<div v-else>
							<div class="row row-xs">
								<div class="col text-center">
									<ContactForm :contact-id="contact.id" :contact-detail="contact">
										<button
											class="btn btn-md btn-raised btn-wave btn-icon mb-2 r-3x i-con-h-a btn-outline-primary"
										>
											<span
												><span
													><ion-icon
														class="text-md"
														name="person-outline"
													></ion-icon></span
											></span>
										</button>
										<small class="d-block text-primary"
											>Müşteri Bilgileri</small
										>
									</ContactForm>
								</div>
								<div class="col text-center">
									<button
										class="btn btn-md btn-raised btn-wave btn-icon mb-2 r-3x i-con-h-a btn-outline-primary"
										@click="toggleMessages"
									>
										<span
											><span
												><ion-icon
													class="text-md "
													name="mail-outline"
												></ion-icon></span
										></span>
									</button>
									<small class="d-block text-primary">SMS Gönder</small>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Block from "../operation/contact/Block";
import Appointment from "../operation/contact/Appointment";
import Risk from "../operation/contact/Risk";
import History from "../operation/contact/History";
import ContactForm from "../operation/contact/Form";

import { mapGetters } from "vuex";

export default {
	components: {
		Block,
		Appointment,
		Risk,
		History,
		ContactForm,
	},
	props: {
		visible: {
			required: false,
			default: false,
		},
		callId: {
			required: false,
			default: false,
		},
		contactId: {
			required: false,
			default: false,
		},
		phone: {
			required: false,
			default: null,
		},
		number: {
			required: false,
			default: null,
		},
		queue: {
			required: false,
			default: null,
		},
		// Click-to-call zincirinde Asterisk → voip-server → socket'ten taşınır.
		// CRM not / randevu request'lerinde backend'e geri verilir — task source'u
		// bu sayede note'a kopyalanır ve yeni randevuya devralınır.
		taskId: {
			required: false,
			default: null,
		},
	},
	data() {
		return {
			copied: false,
			contact: {},
			forms: [],
			resultCodes: [],
			numberInfo: null,
			existingNote: null,
			appointments: [],
			crm: {},
			crmForm: {},
			currentCall: null,
			activeTab: "actions",
			message: null,
			errors: {
				getCrm: [],
				getContact: [],
			},
			atScrollBottom: false,
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
		phoneVisible: {
			get() {
				return this.visible;
			},
			set(value) {
				this.$emit("update:visible", value);
			},
		},
	},
	created() {
		if (this.contactId) {
			this.getContact();
		} else {
			this.setCurrentCall();
			this.getCrm();
		}
	},
	methods: {
		toggleMessages() {
			this.activeTab = this.activeTab === "actions" ? "messages" : "actions";
		},
		handleBlacklistChange(payload) {
			// Block child'ı create → payload, delete → null gönderiyor.
			// contact objesi reaktif, Vue.set gerekmeden mutate edebiliriz.
			this.contact = { ...this.contact, blacklist: payload };
		},
		handleRiskChange(payload) {
			// Contact objesi UI'de risk_comment alanıyla çalışıyor (init response'unda
			// risk_note → risk_comment map'leniyor).
			this.contact = {
				...this.contact,
				is_risky: payload?.is_risky ?? false,
				risk_comment: payload?.risk_comment ?? null,
			};
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
		setCurrentCall() {
			this.currentCall = {
				call_id: this.callId,
				current: true,
				user: {
					id: this.currentUser.id,
					name: this.currentUser.name,
					surname: this.currentUser.surname,
					email: this.currentUser.email,
				},
			};
		},
		getContact() {
			this.$api.get(
				"operation/contacts/" + this.contactId,
				{},
				(response) => {
					this.crm = {};
					this.contact = response.data.data;
				},
				(code, errors) => {
					this.errors.getContact = errors;
				}
			);
		},
		getCrm() {
			this.$api.get(
				"crm/init",
				{ phone: this.phone, number: this.number, call_id: this.callId },
				(response) => {
					this.contact = response.data.data.contact || {};
					this.forms = response.data.data.forms;
					this.resultCodes = response.data.data.result_codes || [];
					this.numberInfo = response.data.data.number || null;
					this.existingNote = response.data.data.existing_note || null;
					this.appointments = response.data.data.appointments || [];
				},
				(code, errors) => {
					this.errors.getCrm = errors;
				}
			);
		},
	},
};
</script>
<style>
.app-phone-modal .el-dialog__header {
	border-bottom: 1px solid rgba(135, 150, 165, 0.1);
}
.app-phone-modal {
	width: 1000px;
	max-width: 90%;
	border: 1px solid rgba(135, 150, 165, 0.1);
}

.app-phone-modal .el-dialog__header {
	padding: 10px 15px 10px 15px;
}

.app-phone-modal .el-dialog__body {
	padding: 0 !important;
	height: calc(90vh - 85px) !important;
}

.app-phone-modal .col-100 {
	height: calc(90vh - 87px) !important;
	overflow-y: auto;
}
.app-phone-modal .phone-sidebar {
	height: calc(90vh - 203px) !important;
	overflow-y: auto;
}
.app-phone-action-buttons {
}
</style>
