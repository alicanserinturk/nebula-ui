<template>
	<div class="h-100">
		<!--:class="{'bg-dark':currentUser.settings['interface_dark_mode']}"-->
		<Connect></Connect>
		<Loading></Loading>
		<Logout></Logout>
		<transition name="el-fade-in-linear">
			<div class="h-100" v-if="!socket.isFirstConnect && currentUser">
				<div id="main" class="layout-row flex">
					<Menu></Menu>
					<div id="content" class="flex">
						<Header></Header>
						<div class="pb-3 pt-0" id="page-container">
							<!--page-container-->
							<router-view v-if="load"></router-view>
						</div>
					</div>
					<!--<QuickMenu></QuickMenu>-->
				</div>
				<Updates></Updates>
				<Notifications></Notifications>
				<!--<Messages></Messages>-->
				<Preferences></Preferences>
				<Permission></Permission>
				<DeveloperConsole
					v-if="envParams.VUE_APP_ENV !== 'production'"
				></DeveloperConsole>
				<DarkStyleCss
					v-if="currentUser.settings['interface_dark_mode']"
				></DarkStyleCss>
			</div>
		</transition>
	</div>
</template>
<script>
import Menu from "./Menu";
import Header from "./Header";
import DarkStyleCss from "./DarkStyleCss";
import Logout from "./Logout";
import Connect from "./Connect";
import Loading from "./Loading";
import { mapActions, mapGetters, mapMutations } from "vuex";
import EventBus from "@/utils/EventBus";
import Preferences from "@/layouts/app/Preferences";
import QuickMenu from "./QuickMenu";
import Notifications from "@/layouts/app/Notifications";
import Permission from "@/layouts/app/Permission";
import Messages from "@/layouts/app/Messages";
import Updates from "@/layouts/app/Updates";
import DeveloperConsole from "@/layouts/app/DeveloperConsole";

export default {
	components: {
		Permission,
		Notifications,
		Preferences,
		Menu,
		Header,
		DarkStyleCss,
		Logout,
		Loading,
		Connect,
		QuickMenu,
		Messages,
		Updates,
		DeveloperConsole,
	},
	data() {
		return {
			load: true,
			logoutEvent: false,
			lock: false,
			error: {},
			showError: false,
			loginForm: {
				password: "",
			},
			consoleUpdated: false,
		};
	},
	computed: {
		...mapGetters(["currentUser", "socket", "permissions"]),
		envParams() {
			return process.env;
		},
	},
	mounted() {},
	created() {
		let self = this;

		//Set Console Handling
		let _error = console.error;
		let _errorFunction = function() {
			self.pushConsoleError({
				message: arguments[0],
				path: self.$route.fullPath,
			});
			return _error.apply(console, arguments);
		};
		if (console.error.toString() !== _errorFunction.toString()) {
			console.error = _errorFunction;
		}
		// Set Theme
		document
			.getElementsByTagName("html")[0]
			.style.setProperty(
				"--primary-color",
				this.currentUser.settings["interface_primary_color"]
			);
		document
			.getElementsByTagName("html")[0]
			.style.setProperty(
				"--primary-color-lighter",
				"hsl(var(--primary-color),50%)"
			);
		document.getElementsByTagName("html")[0].style.zoom =
			this.currentUser.settings["interface_zoom"] + "%";
		if (this.currentUser.settings["interface_dark_mode"]) {
			document.getElementsByTagName("body")[0].classList.add("bg-dark");
		}
		document.getElementById("dark").disabled = !this.currentUser.settings[
			"interface_dark_mode"
		];
		// Check Permissions
		this.checkPermissions();
		// Users
		this.getUsers();
	},
	beforeDestroy() {
		this.disconnectSocket();
	},
	watch: {
		"currentUser.settings.interface_dark_mode": function(value) {
			if (!this.currentUser || !this.currentUser.settings) return;
			if (value) {
				document.getElementsByTagName("body")[0].classList.add("bg-dark");
				document.getElementById("dark").disabled = false;
			} else {
				document.getElementsByTagName("body")[0].classList.remove("bg-dark");
				document.getElementById("dark").disabled = true;
			}
		},
		"currentUser.settings.interface_zoom": function(value) {
			if (!this.currentUser || !this.currentUser.settings) return;
			document.getElementsByTagName("html")[0].style.zoom =
				this.currentUser.settings["interface_zoom"] + "%";
		},
		"currentUser.settings.interface_primary_color": function(value) {
			if (!this.currentUser || !this.currentUser.settings) return;
			document
				.getElementsByTagName("html")[0]
				.style.setProperty("--primary-color", value);
		},
	},
	methods: {
		...mapActions([
			"login",
			"signout",
			"connectSocket",
			"disconnectSocket",
			"pushConsoleError",
		]),
		...mapMutations(["setPermissionMicrophone", "setPermissionNotification", "setUsers"]),
		getUsers() {
			// chat devre dışı — backend chats route'ları kaldırıldı
			return;
			this.$api.get("chats/users", {}, (response) => {
				this.setUsers(response.data);
			});
		},
		submit() {
			this.login({
				email: this.currentUser.email,
				password: this.loginForm.password,
			});
		},
		checkPermissions() {
			let self = this;
			navigator.permissions
				.query({ name: "microphone" })
				.then(function(permissionStatus) {
					self.setPermissionMicrophone(permissionStatus.state);
					permissionStatus.onchange = function() {
						self.setPermissionMicrophone(this.state);
					};
				});
			navigator.permissions
				.query({ name: "notifications" })
				.then(function(permissionStatus) {
					self.setPermissionNotification(permissionStatus.state);
					permissionStatus.onchange = function() {
						self.setPermissionNotification(this.state);
					};
				});
		},
		logout() {
			this.signout().then(() => {
				setTimeout(() => {
					this.$router.push("/login");
				}, 1000);
			});
		},
	},
};
</script>
<style lang="scss">
.el-notification {
	background: rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(15px);
	box-shadow: 0 0 16px -3px rgb(0 0 0 / 10%);
}
.el-notification__title {
	font-size: 13px !important;
	font-weight: 500 !important;
}
.el-notification__content {
	font-size: 12px !important;
	margin-top: 0 !important;
}
.el-notification__icon {
	height: auto;
	width: auto;
	font-size: 17px !important;
}
.el-notification__group {
	margin-left: 8px;
}
.app-side-modal {
	backdrop-filter: blur(32px);
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	max-width: 60%;
	width: 420px;
	z-index: 1999;
	box-shadow: 0 0 60px -17px rgba(0, 0, 0, 0.2);
	border-left: 1px solid rgba(135, 150, 165, 0.15);
	.app-side-modal-header {
		padding-top: 20px;
		padding-bottom: 15px;
	}
	.app-side-modal-body {
		height: calc(100% - 161px);
		overflow-y: auto;
	}
	.app-side-modal-footer {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100px;
	}
}
.el-dropdown-menu--medium .el-dropdown-menu__item {
	padding: 0 0.5rem;
}
.el-dropdown-menu__item {
	border-radius: 7px;
}
.el-dropdown-menu {
	padding: 0.5rem;
}
ion-icon {
	vertical-align: -2px;
}
.v-modal {
	opacity: 0.85 !important;
}
.el-dialog {
	box-shadow: 0 0 120px -30px rgba(0, 0, 0, 0.8);
}
.bg-dark .el-dialog {
	border: 1px solid rgba(135, 150, 165, 0.1);
}
#page-container {
	padding-left: 2.1rem;
	padding-right: 2.1rem;
}
#header {
	padding-left: 1.1rem;
}
</style>
