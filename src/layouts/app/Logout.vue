<template>
	<div>
		<app-modern-modal :visible.sync="progressVisible" :closable="false">
			<div class="app-logout">
				<app-svg
					src="/assets/img/vectors/connect.svg"
					class="app-logout-illustration mx-auto mb-3"
				/>
				<h5>Çıkış Yapılıyor</h5>
				<small class=""><i class="el-icon-loading mr-2"></i>Oturum sonlandırılıyor, lütfen bekleyin.</small>
			</div>
		</app-modern-modal>
		<el-dialog
			:visible.sync="reasonVisible"
			custom-class="app-modal-preferences-custom"
			:append-to-body="true"
			:show-close="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			width="600px"
		>
			<div class="p-4">
				<div class="row">
					<div class="col-md-8 p-4">
						<h3 class="font-weight-bold mb-3">Oturumunuz Sonlandırıldı</h3>
						<span>{{ reasonMessage }}</span>
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
				<button class="btn btn-primary btn-rounded" @click="runLogout(reasonMessage)">Çıkış Yap <ion-icon class="ml-2" name="log-out-outline"></ion-icon></button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import { mapActions } from "vuex";

const DEFAULT_REASON = "Güvenlik nedeniyle oturumunuz sonlandırıldı, lütfen tekrar giriş yapın.";

export default {
	data() {
		return {
			progressVisible: false,
			reasonVisible: false,
			reasonMessage: DEFAULT_REASON,
			running: false,
		};
	},
	created() {
		EventBus.$on("logout", (reason) => {
			if (this.running) return;
			if (reason) {
				this.reasonMessage = reason;
				this.reasonVisible = true;
			} else {
				this.runLogout();
			}
		});
		// Sebep modal'ı atlanarak direkt cleanup + redirect (socket 15 sn grace gibi).
		EventBus.$on("logout:silent", (reason) => {
			if (this.running) return;
			this.runLogout(reason);
		});
	},
	beforeDestroy() {
		EventBus.$off("logout");
		EventBus.$off("logout:silent");
	},
	methods: {
		...mapActions(["signout", "disconnectSocket"]),
		async runLogout(reason = null) {
			if (this.running) return;
			this.running = true;

			this.reasonVisible = false;
			this.progressVisible = true;

			this.disconnectSocket();
			// API ulaşılamazsa signout takılabilir; en fazla 3 sn bekle, sonra redirect.
			await Promise.race([
				this.signout(),
				new Promise((resolve) => setTimeout(resolve, 3000)),
			]);
			this.clear();

			const query = reason
				? "?warning=" + window.btoa(unescape(encodeURIComponent(reason)))
				: "";

			setTimeout(() => {
				window.location.href = "/login" + query;
			}, 500);
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
};
</script>
<style>
.app-logout {
	width: 500px;
	margin-top: 15vh;
	margin-left: auto;
	margin-right: auto;
	padding: 25px;
	text-align: center;
}

.app-logout-illustration {
	display: block;
	width: 360px;
}
</style>
