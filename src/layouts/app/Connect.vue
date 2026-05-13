<template>
	<div>
		<transition name="el-fade-in-linear">
			<div class="app-connect-cover" v-if="!socket.status && !loggingOut">
				<div class="app-connect-action-cover">
					<div>
						<transition name="el-fade-in-linear">
							<div
								class="app-connect-action row"
								v-if="socket.failed || !online"
							>
								<div class="col-12 text-center">
									<app-svg
										src="/assets/img/vectors/connect.svg"
										class="col-8 mx-auto mb-4"
									/>
								</div>
								<div class="app-connect-message text-center col">
									<span class="d-block mb-3" v-if="!online"
										>İnternete erişilemiyor. Lütfen bağlantınızı kontrol
										edin.</span
									>
									<span class="d-block mb-3" v-else
										><i class="el-icon-loading mr-1"></i>
										{{ socket.failedMessage }}</span
									>
								</div>
							</div>
							<div class="app-connect-action app-connect-loading row" v-else>
								<div class="app-connect-message col text-center pt-4">
									<i class="el-icon-loading mt-5"></i>
								</div>
							</div>
						</transition>
						<transition name="el-fade-in-linear">
							<div class="app-connect-information px-4 py-5">
								<button
									v-if="socket.failed"
									@click="logout"
									class="btn btn-light btn-rounded mx-auto d-block"
								>
									Çıkış Yap <i class="el-icon-right ml-1"></i>
								</button>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
	diff,
	addedDiff,
	deletedDiff,
	updatedDiff,
	detailedDiff,
} from "deep-object-diff";
import { currentUser } from "@/constans/config";
import Axios from "axios";

export default {
	data() {
		return {
			online: window.navigator.onLine,
			visible: false,
		};
	},
	computed: {
		...mapGetters(["currentUser", "socket", "loggingOut"]),
	},
	created() {
		// Set Variables
		this.setSocketIsFirstConnect(true);
		// Set Socket Statuses
		this.connectSocket();
		// Check User Settings For Updates
		this.checkAndUpdateUserSettings();
	},
	methods: {
		...mapMutations(["setSocketIsFirstConnect", "clearSocketFailed"]),
		...mapActions([
			"login",
			"signout",
			"connectSocket",
			"disconnectSocket",
			"refreshSocket",
			"updateCurrentUser",
		]),
		logout() {
			EventBus.$emit("logout");
		},
		checkAndUpdateUserSettings() {
			if (!this.currentUser || !this.currentUser.settings) return;
			let currentUserSettings = this.currentUser.settings;
			let defaultUserSettings = currentUser.settings;
			let settingsDiff = addedDiff(currentUserSettings, defaultUserSettings);
			if (settingsDiff && Object.keys(settingsDiff).length > 0) {
				Object.keys(defaultUserSettings).forEach((key) => {
					if (typeof defaultUserSettings[key] === "object") {
						Object.keys(defaultUserSettings[key]).forEach((subKey) => {
							defaultUserSettings[key][subKey] =
								defaultUserSettings[key][subKey];
						});
					} else {
						defaultUserSettings[key] = defaultUserSettings[key];
					}
				});
				this.currentUser.settings = defaultUserSettings;
				this.updateCurrentUser();
			}
		},
		checkOnlineStatus() {
			this.online = window.navigator.onLine;
		},
	},
	watch: {
		"socket.status": function(val) {
			this.visible = !val;
			this.checkOnlineStatus();
		},
	},
};
</script>
<style lang="scss">
.app-connect-information {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	text-align: center;
}
.app-connect-background {
	height: 50%;
	width: 50%;
}
.app-connect-cover {
	backdrop-filter: blur(24px);
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 9999999;
}

.app-connect-action {
	width: 550px;
	margin: auto;
	padding: 10px 30px 40px 30px;
	border-radius: 10px;
	margin-top: calc(50vh - 180px);
	&.app-connect-loading {
		i {
			font-size: 18px;
		}
	}
}

.app-connect-action-cover {
	width: 100%;
	padding: 20px;
}
</style>
