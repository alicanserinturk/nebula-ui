<template>
	<div>
		<app-modern-modal :visible.sync="isVisible" :closable="false">
			<div class="app-logout">
				<h5>Çıkış Yapılıyor</h5>
				<small class="">Güvenli çıkış yapılıyor, lütfen bekleyin.</small>
				<ul>
					<li>
						<i v-if="loading.sip" class="el-icon-loading"></i
						><span class="text-muted">Hat kontrol ediliyor...</span>
					</li>
					<li>
						<i v-if="loading.logout" class="el-icon-loading"></i
						><span class="text-muted">Oturum sonlandırılıyor...</span>
					</li>
					<li>
						<i v-if="loading.socket" class="el-icon-loading"></i
						><span class="text-muted">Socket sonlandırılıyor...</span>
					</li>
				</ul>
			</div>
		</app-modern-modal>
		<el-dialog
		:visible.sync="timeoutModalVisible"
		custom-class="app-modal-preferences-custom"
		:append-to-body="true"
		width="600px"
		>
		<div class="p-4">
			<div class="row">
				<div class="col-md-8 p-4">
					<h3 class="font-weight-bold mb-3">Oturumunuz Sonlandırıldı</h3>
					<span>
						Güvenlik nedeniyle oturumunuz sonlandırıldı, çıkış yaparak tekrar giriş yapmanız gerekiyor.
					</span>
				</div>
				<div class="col-md-4">
					<app-svg
						style="width: 140px;"
						src="/assets/img/vectors/timeout.svg"
					></app-svg>
				</div>
			</div>
		</div>
		<div slot="footer" class="pt-3">
			<button class="btn btn-primary btn-rounded" @click="logout('Güvenlik nedeniyle oturumunuz sonlandırıldı, lütfen tekrar giriş yapın.')">Çıkış Yap <ion-icon class="ml-2" name="log-out-outline"></ion-icon></button>
		</div>
	</el-dialog>
	</div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import { mapActions, mapGetters } from "vuex";
import API from "@/utils/API";

export default {
	props: {
		visible: {
			required: false,
			default: false,
		},
	},
	data() {
		return {
			isVisible: false,
			timeoutModalVisible: false,
			loading: {
				sip: false,
				logout: false,
				socket: false,
			},
		};
	},
	created() {
		EventBus.$on("logout", (data) => {
			this.logout(data);
		});
		EventBus.$on("timeout", () => {
			this.timeoutModalVisible = true;
		});
		EventBus.$on("sipDisconnected", () => {
			this.loading.sip = false;
		});
	},
	beforeDestroy() {
		EventBus.$off("logout");
		EventBus.$off("sipDisconnected");
	},
	computed: {
		...mapGetters(["socket", "currentUser"]),
	},
	methods: {
		...mapActions(["signout", "disconnectSocket"]),
		async forceLogout(warning = false) {
			this.isVisible = true;
			
			// 1. SIP Kontrolü
			if (this.currentUser && this.currentUser.sip) {
				this.loading.sip = true;
				// Sip.vue zaten logout eventini dinleyip disconnect() çağırıyor.
				// Biz burada sadece Loading'i gösteriyoruz. 
				// Sip.vue işi bittiğinde 'sipDisconnected' yayacak.
				// Çok beklememesi için bir timeout koyabiliriz veya direkt devam edebiliriz.
				// Şimdilik 1 saniye bekleyip devam edelim ki süreç çok uzamasın.
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
			this.loading.sip = false;

			// 2. Socket Kontrolü
			this.loading.socket = true;
			this.disconnectSocket();
			this.loading.socket = false;

			// 3. Backend Logout & Token Temizliği
			this.loading.logout = true;
			await this.signout();
			this.loading.logout = false;

			let query = "";
			if (warning)
				query =
					"?warning=" + window.btoa(unescape(encodeURIComponent(warning)));
			
			this.clear();
			EventBus.$off("logout");
			
			// Kısa bir bekleme görsel deneyim için iyi olabilir
			setTimeout(() => {
				window.location.href = "/login" + query;
			}, 500);
		},
		logout(type = null) {
			this.forceLogout(type);
		},
		clear() {
			localStorage.removeItem("user");
			document
				.getElementsByTagName("html")[0]
				.style.setProperty("--primary-color", "#007aff");
			document.getElementsByTagName("html")[0].style.zoom = "unset";
			document.getElementById("dark").disabled = true;
			document.getElementsByTagName("body")[0].classList.remove("bg-dark");
		},
	},
	watch: {},
};
</script>
<style>
.app-logout {
	width: 400px;
	background: rgba(255, 255, 255, 0.5);
	margin-top: 30vh;
	margin-left: auto;
	margin-right: auto;
	padding: 25px;
	border-radius: 10px;
}

.app-logout ul {
	list-style: none;
	margin: 20px 0 0 0;
	padding: 0;
}

.app-logout ul li {
	padding: 2px 0;
}

.app-logout ul li i {
	margin-right: 6px;
}
</style>
