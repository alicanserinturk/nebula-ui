<template>
<div class="pt-5">
	<div>
		<app-avatar name="Serkan" surname="Suren" title="serkan@apperatif.com"></app-avatar>
	</div>
	<div class="row pt-4">
    <h6><ion-icon class="app-icon" name="person-outline"></ion-icon> Count: {{$store.getters['notificationsCountByModule']('users')}}</h6>
  </div>
	<!--<div class="row">
		<div class="col-2" v-for="vector in vectors">
			<app-svg :src="'/' + vector"></app-svg>
			<small>{{ vector }}</small>
		</div>
	</div>-->
</div>

</div>
	
</template>
<script>
import axios from "axios";
import { mapActions, mapGetters } from 'vuex';

export default {
	data() {
		return {
			vectors: [
				"assets/img/vectors/access-admin.svg",
				"assets/img/vectors/access-custom.svg",
				"assets/img/vectors/access-lead.svg",
				"assets/img/vectors/access-user.svg",
				"assets/img/vectors/archive.svg",
				"assets/img/vectors/archived.svg",
				"assets/img/vectors/call.svg",
				"assets/img/vectors/call-list.svg",
				"assets/img/vectors/change-password.svg",
				"assets/img/vectors/connect.svg",
				"assets/img/vectors/customer.svg",
				"assets/img/vectors/data.svg",
				"assets/img/vectors/dial-plans.svg",
				"assets/img/vectors/empty.svg",
				"assets/img/vectors/favorites.svg",
				"assets/img/vectors/feedback.svg",
				"assets/img/vectors/feedback-success.svg",
				"assets/img/vectors/history.svg",
				"assets/img/vectors/message.svg",
				"assets/img/vectors/notification.svg",
				"assets/img/vectors/number.svg",
				"assets/img/vectors/pbx.svg",
				"assets/img/vectors/player.svg",
				"assets/img/vectors/queues.svg",
				"assets/img/vectors/rate-call.svg",
				"assets/img/vectors/report.svg",
				"assets/img/vectors/settings-account.svg",
				"assets/img/vectors/settings-audio.svg",
				"assets/img/vectors/settings-design.svg",
				"assets/img/vectors/settings-feedback.svg",
				"assets/img/vectors/settings-location.svg",
				"assets/img/vectors/settings-notification.svg",
				"assets/img/vectors/settings-password.svg",
				"assets/img/vectors/settings-permission.svg",
				"assets/img/vectors/settings-phone.svg",
				"assets/img/vectors/sip-settings.svg",
				"assets/img/vectors/team.svg",
				"assets/img/vectors/user.svg",
				"assets/img/vectors/users.svg",
			],
		};
	},
	computed:{
		notificationsCount(module){
			this.$store.getters['notificationsCountByModule'](module)
		}
	},
	methods:{
		...mapActions(['pushNotification']),
	},
	created(){
		let self = this;
		setInterval(() => {
			self.pushNotification({
				type: 'info',
				icon: 'SS',
				title: 'Çevrimiçi',
				message: 'Serkan artık çevrimiçi.',
				primary: null,
				module: 'users',
				url: '/',
			});
		},10000);
	}
};
</script>
<style>
.app-icon{
  height: auto !important;
}
</style>
