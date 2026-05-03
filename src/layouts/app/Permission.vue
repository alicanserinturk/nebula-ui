<template>
	<el-dialog
		:visible.sync="visible"
		custom-class="app-modal-preferences-custom"
		:append-to-body="true"
    width="600px"
	>
		<div class="p-4 bg-primary">
			<div class="row">
				<div class="col-md-8 p-4">
					<h2 class="font-weight-bold mb-3 text-white">İzinleri Gözden Geçirin</h2>
					<span>
						Nebula'yı daha verimli kullanabilmeniz için mikrofon ve bildirim
						erişim izinlerini vermeniz gerekir.
					</span>
				</div>
				<div class="col-md-4">
					<app-svg
						style="width: 140px;"
						src="/assets/img/vectors/settings-notification.svg"
					></app-svg>
				</div>
			</div>
		</div>
		<app-list-action
			description="Telefonla görüşme yapabilmek için mikrofon erişimine izin vermeniz gerekiyor."
			label="Mikrofon Erişimi"
			:icon="
				permissions.microphone === 'granted'
					? 'mic-circle-outline'
					: 'mic-off-circle-outline'
			"
		>
			<el-button
				type="primary"
				v-if="permissions.microphone === 'prompt'"
				size="small"
				@click="getMicrophonePermission"
				><i class="el-icon-microphone"></i> Mikrofon Erişimine İzin
				Ver</el-button
			>
			<el-button
				type="danger"
				v-else-if="permissions.microphone === 'denied'"
				size="small"
				:disabled="true"
				><i class="el-icon-circle-close"></i> Engellendi</el-button
			>
			<el-button
				type="primary"
				v-else-if="permissions.microphone === 'granted'"
				size="small"
				:disabled="true"
				><i class="el-icon-circle-check"></i> İzin Verildi</el-button
			>
		</app-list-action>
		<app-list-action
			description="Bildirimlerinizi uygulama sekme durumundayken de gönderebilmemiz için bildirim erişimine izin vermeniz gerekiyor."
			label="Bildirim Erişimi"
			:icon="
				permissions.notification === 'granted'
					? 'notifications-circle-outline'
					: 'notifications-off-circle-outline'
			"
		>
			<el-button
				type="primary"
				v-if="permissions.notification === 'prompt'"
				size="small"
				@click="getNotificationsPermission"
				><i class="el-icon-bell"></i> Bildirim Erişimine İzin Ver</el-button
			>
			<el-button
				type="danger"
				v-else-if="permissions.notification === 'denied'"
				size="small"
				:disabled="true"
				><i class="el-icon-circle-close"></i> Engellendi</el-button
			>
			<el-button
				type="primary"
				v-else-if="permissions.notification === 'granted'"
				size="small"
				:disabled="true"
				><i class="el-icon-circle-check"></i> İzin Verildi</el-button
			>
		</app-list-action>
	</el-dialog>
</template>
<script>
import EventBus from "@/utils/EventBus";
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			visible: false,
			activeTab: "Chrome",
		};
	},
	computed: {
		...mapGetters(["permissions"]),
	},
	created() {
    let self = this;
		setTimeout(() => {
      self.checkPermissions()
    },5000)
		EventBus.$on("openPermission", () => {
			this.visible = true;
		});
	},
	beforeDestroy() {
		EventBus.$off("openPermission");
	},
	methods: {
		getMicrophonePermission() {
			navigator.mediaDevices.getUserMedia({ audio: true });
		},
		getNotificationsPermission() {
			Notification.requestPermission();
		},
		checkPermissions() {
			if (
				this.permissions.notification !== "granted" ||
				this.permissions.microphone !== "granted"
			) {
				this.visible = true;
			} else {
        this.visible = false;
      }
		},
	},
	watch: {
		"permissions.notification": function(val) {
			this.checkPermissions();
    },
		"permissions.microphone": function(val) {
			this.checkPermissions();
		},
	},
};
</script>
<style>
.app-modal-preferences-custom {
	overflow: hidden;
}
.app-modal-preferences-custom .el-dialog__body {
	padding: 0;
}
.app-modal-preferences-custom .el-dialog__header {
	display: none;
}
</style>
