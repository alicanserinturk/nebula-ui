<template>
	<div class="app-crm-history">
		<app-information
			type="simple"
			:errors="this.errors.getHistory"
		></app-information>
		<div
			class="p-3 text-center"
			v-if="loading.getHistory && items.length === 0"
		>
			<small> <i class="el-icon-loading"></i> Yükleniyor </small>
		</div>
		<div v-else>
			<div
				class="text-center py-2"
				v-if="historyLoaded && hasMore"
			>
				<button
					class="btn btn-white btn-sm btn-rounded"
					:disabled="loading.getHistory"
					@click="loadMore"
				>
					<i
						:class="loading.getHistory ? 'el-icon-loading' : 'el-icon-arrow-up'"
					></i>
					Daha fazla yükle
				</button>
			</div>
			<div class="timeline" v-if="items.length > 0">
				<div class="tl-item active" v-for="item in items">
					<div
						class="tl-dot"
						:style="
							!item.up_at && item.ringing_at ? 'border-color: #ffe3e6' : ''
						"
					>
						<a class="tl-author" href="#"
							><span
								:class="
									!item.up_at && item.ringing_at ? 'bg-danger-lt' : 'bg-light'
								"
								class="w-36 avatar circle"
							>
								<ion-icon style="font-size:18px" name="call-outline"></ion-icon>
								<ion-icon
									:name="
										item.direction === 'out'
											? 'arrow-redo-outline'
											: 'arrow-undo-outline'
									"
									style="font-size:12px;position:absolute; top:6px; right:7px;"
								></ion-icon></span
						></a>
					</div>
					<div class="tl-content pb-2 flex col-7">
						<small class="" v-if="!item.current">
							<span class="font-weight-500" v-if="item.direction === 'in'"
								>Gelen Arama ·</span
							>
							<span class="font-weight-500" v-else>Giden Arama ·</span>
							<span class="d-inline-block text-muted "
								><app-date-range-text
									:start-date="item.up_at"
									:end-date="item.hangup_at"
								></app-date-range-text
							></span>
						</small>
						<div v-else>
							<small class="font-weight-500 d-bl"
								>Değerlendirilmemiş görüşme</small
							>
							<div>
								<button
									@click="activeItemId = item.call_id"
									v-if="activeItemId !== item.call_id"
									class="btn btn-outline-primary mt-2 btn-rounded btn-sm"
								>
									Aktif Görüşmeyi Değerlendir
								</button>
							</div>
						</div>

						<div :class="'crm-' + item.call_id" v-if="activeItemId !== item.call_id">
							<div v-if="!item.current">
								<div class="d-inline-block" style="zoom:60%">
									<span class="d-block" style="margin-top:-10px"
										><el-rate
											:disabled="true"
											v-model="item.rating"
											:colors="colors"
										></el-rate
									></span>
								</div>
								<div class="d-inline-block" v-if="item.result_code">
									<span
										class="badge badge-sm"
										:class="{
											'text-success': item.result_code.is_success === true,
											'text-warning': item.result_code.is_success === false,
										}"
										>{{ item.result_code.name }}</span
									>
								</div>
								<span
									class="badge badge-sm text-muted"
									v-if="!item.up_at && item.ringing_at"
									>Cevapsız Çağrı</span
								>
							</div>

							<div
								v-if="item.comments"
								class="r-3x mt-2 mb-1 py-2 px-3 d-block bg-light"
							>
								<span>{{ item.comments }} </span>
							</div>
							<div class="row row-xs" v-if="!item.current">
								<div class="col-auto">
									<small class="text-muted" v-if="item.user">
										{{ item.user.name }} {{ item.user.surname }}
									</small>
								</div>
								<div class="col-auto">
									<small class="text-muted"
										><app-date-text :text="item.start_at"></app-date-text>
									</small>
								</div>
								<div class="col-auto" v-if="item.number">
									<small class="text-muted">{{ item.number.name || item.number.number }}</small>
								</div>
								<div class="col-auto" v-if="item.queue">
									<small class="text-muted">{{ item.queue.name }}</small>
								</div>
							</div>
						</div>
						<template v-else>
							<div
								:id="'crm-' + item.call_id"
								class="shadow r-3x border mt-3 app-crm bg-white"
								:class="{ 'app-expand-crm': expand }"
							>
								<Crm
									v-if="item.call_id && item.current"
									:id="item.call_id"
									:contact-id="contactId"
									:number="crmNumber"
									:queue="crmQueue"
									:forms="crmForms"
									:result-codes="crmResultCodes"
									:initial="activeForm"
									@saved="handleSavedCrm"
									@cancel="handleCancelCrm"
									@complete="handleCompleteCrm"
								></Crm>
							</div>
						</template>
						<span class="text-muted">...</span>
					</div>
				</div>
			</div>
			<div class="p-3 text-center" v-else>
				<small>Herhangi bir geçmiş kayıt bulunmuyor.</small>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import ResultCodeSelect from "../../../components/form/ResultCodeSelect";
import Crm from "./Crm";

export default {
	components: {
		ResultCodeSelect,
		Crm,
	},
	props: {
		contactId: {
			required: true,
		},
		activeCallId: {
			required: false,
			default: null,
		},
		crmNumber: {
			required: false,
			default: null,
		},
		crmQueue: {
			required: false,
			default: null,
		},
		crmForms: {
			required: false,
			default: () => [],
		},
		crmResultCodes: {
			required: false,
			default: () => [],
		},
		existingNote: {
			required: false,
			default: null,
		},
	},
	data() {
		return {
			atScrollBottom: false,
			expand: false,
			animating: false,
			items: [],
			historyLoaded: false,
			currentPage: 1,
			hasMore: false,
			colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
			activeItemId: null,
			activeItem: {},
			activeForm: null,
			loading: {
				getHistory: false,
				save: false,
			},
			errors: {
				getHistory: [],
			},
		};
	},
	computed: {
		...mapGetters(["currentUser"]),
	},
	created() {
		this.pushCurrentCall();
		if (this.existingNote) {
			this.activeForm = { ...this.existingNote };
		}
	},
	watch: {
		existingNote(value) {
			if (value && !this.activeForm) {
				this.activeForm = { ...value };
			}
		},
	},
	methods: {
		clearScrollEvent() {
			document.getElementById("history").onscroll = (e) => {};
		},
		setScrollEvent() {
			document.getElementById("history").onscroll = (e) => {
				if (!this.animating) {
					this.expand = false;
				}

				/*if (!this.animating) {
					console.log(this.animating);
					let position = document.getElementById("history").scrollTop;
					let height =
						document.getElementById("history").scrollHeight -
						document.getElementById("history").clientHeight;
					if (position === height) {
						this.expand = true;
						this.animating = true;
						let self = this;
						document.getElementById("history").style.overflow = 'hidden'
					} else {
						
						
					}
				} else {
					document.getElementById("crm-464").scrollIntoView();
					console.log("else",this.animating);
				}*/
			};
		},
		scrollToBottom() {},
		handleCompleteCrm(id) {
			this.expand = true;
			let self = this;
			setTimeout(() => {
				console.log(".crm-" + id);
				document.getElementById("crm-" + id).scrollIntoView();
				document.getElementById("history").style.overflow = "hidden";
			},0)
		},
		handleCancelCrm() {
			this.activeItemId = null;
			this.expand = true;
			document.getElementById("history").style.overflow = "auto";
			this.expand = false;
			if (!this.historyLoaded) {
				this.getHistory();
			}
		},
		handleSavedCrm(form) {
			// Kayıt/güncelleme sonrası edit modunda kalıyoruz. Form state'i tutuyoruz
			// ki "Geçmiş görüşmeler"e geçip geri dönüldüğünde CRM boş olmasın.
			this.activeForm = form ? { ...form } : this.activeForm;
		},
		pushCurrentCall() {
			let index = this.items.findIndex((item) => {
				return item.call_id === this.activeCallId;
			});
			if (index === -1) {
				let item = {
					id: this.activeCallId,
					call_id: this.activeCallId,
					current: true,
					user: {
						id: this.currentUser.id,
						name: this.currentUser.name,
						surname: this.currentUser.surname,
						email: this.currentUser.email,
					},
				};
				this.items.push(item);
				this.activeItem = item;
			}
			this.activeItemId = this.activeCallId;
		},
		getHistory(page = 1) {
			this.loading.getHistory = true;
			const activeId = this.activeItemId;
			const scrollEl = document.getElementById("history");
			const prevScrollHeight = scrollEl ? scrollEl.scrollHeight : 0;
			const prevScrollTop = scrollEl ? scrollEl.scrollTop : 0;
			this.$api.get(
				"crm/call-history",
				{ contact_id: this.contactId, page },
				(response) => {
					const past = response.data.data.slice().reverse();
					const current = this.items.find((i) => i.current);
					const existingPast = this.items.filter((i) => !i.current);

					if (page === 1) {
						this.items = current ? [...past, current] : past;
					} else {
						this.items = current
							? [...past, ...existingPast, current]
							: [...past, ...existingPast];
					}

					const meta = response.data.meta || {};
					this.currentPage = meta.current_page ?? page;
					this.hasMore =
						meta.last_page != null
							? this.currentPage < meta.last_page
							: past.length >= 10;

					this.activeItemId = activeId;
					this.historyLoaded = true;
					this.loading.getHistory = false;

					this.$nextTick(() => {
						const el = document.getElementById("history");
						if (!el) return;
						if (page === 1) {
							el.scrollTop = el.scrollHeight;
						} else {
							// Başa eklenen eski kayıt yüksekliğini scrollTop'a ekle:
							// kullanıcının baktığı aktif kayıt tam olarak aynı yerde kalır.
							el.scrollTop = prevScrollTop + (el.scrollHeight - prevScrollHeight);
						}
					});
				},
				(status, errors) => {
					this.errors.getHistory = errors;
					this.loading.getHistory = false;
				}
			);
		},
		loadMore() {
			if (this.loading.getHistory || !this.hasMore) return;
			this.getHistory(this.currentPage + 1);
		},
		save() {
			this.activeItemId = null;
		},
	},
};
</script>
<style lang="scss">
.app-crm {
	width: 100%;
	padding-top: 0;
	margin-bottom: 0;
	height: auto;
	border: 1px solid transparent;
}
.app-expand-crm {
	border-top: 1px solid red;
	position: relative;
	margin-left: calc(-2rem + -50px);
	width: calc(100% + 4rem + 90px);
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.2) !important;
	border: 1px solid transparent !important;
	z-index: 9999999999;
	transition: 0.5s;
	.app-crm-form-body {
		height: calc(90vh - 219px);
		overflow: scroll;
	}
	.app-crm-form-footer {
		width: 100%;
		z-index: 9;
		border-bottom-left-radius: 20px !important;
		border-bottom-right-radius: 20px !important;
		overflow: hidden;
	}
}
.tl-item {
	position: unset;
}
.app-phone-modal .col-100 {
	position: relative;
}
.app-phone-modal .tl-content {
	max-width: calc(100% - 100px);
}
#history {
	scroll-behavior: smooth;
}
</style>
