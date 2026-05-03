<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
      <div class="app-module-frame">
        <div class="app-module-sidebar">
        <div class="card">
          <div class="aside aside-sm" id="content-aside">
						<div class="d-flex flex-column w-xl modal-dialog" id="chat-nav">
							<div class="navbar b-b position-relative">
								<div class="input-group flex">
									<input
										@input="searchFields"
										v-model="searchKey"
										type="text"
										class="form-control px-0 no-bg no-border no-shadow search"
										:placeholder="$t('constants.search_placeholder')"
										required=""
									/>
									<span class="input-group-append"
										><button
											class="btn no-bg no-shadow i-con-h-a"
											type="button"
										>
											<i class="i-con i-con-search w-16 text-muted"></i></button
									></span>
								</div>
								<div v-if="loadingUsers" class="loading-messages">
									<button class="btn btn-sm btn-rounded btn-default i-con-h-a">
										Yükleniyor... <i class="ml-2 el-icon-loading"></i>
									</button>
								</div>
							</div>
							<div class="scrollable hover" style="height: calc(100vh - 248px)">
								<div
									v-if="users.length > 0 && !loadingUsers"
									class="list list-row"
								>
									<div
										v-if="item.id !== currentUser.id"
										v-for="item in users"
										class="list-item pointer"
										:class="{ 'bg-light': item.id === activeUser.id }"
										@click="getMessages(item)"
									>
										<!--<div><span class="avatar-status on"></span></div>-->
										<div>
											<span class="w-48 avatar circle bg-light"
												><span
													v-if="item.status.is_online"
													class="avatar-status on b-white avatar-right"
												></span
												>{{ item.name[0] }}{{ item.surname[0] }}</span
											>
										</div>
										<div class="flex">
											<span class="item-author"
												>{{ item.name }} {{ item.surname }}</span
											>
											<div
												v-if="item.chats_last_from"
												class="item-except text-muted h-1x"
											>
												{{ item.chats_last_from.message }}
											</div>
										</div>
										<div v-if="unreadMessagesCount(item.id) !== 0">
											<span class="item-amount badge badge-pill bg-success">{{
												unreadMessagesCount(item.id)
											}}</span>
										</div>
									</div>
								</div>
								<div v-else-if="!loadingUsers" class="no-result">
									<div class="p-5 text-center">
										<p>
											{{ $t("module.message.user_not_fount_description") }}
										</p>
										<el-button size="mini"
											><i class="el-icon-plus"></i>
											{{ $t("module.message.create_user") }}
										</el-button>
									</div>
								</div>
							</div>
						</div>
					</div>
        </div>
      </div>
      <div class="app-module-main">
        <div class="card">
          <div
						class="d-flex flex"
						id="content-body"
						style="height: calc(100vh - 188px); overflow:auto"
					>
						<div
							class="d-flex flex-column flex"
							id="chat-list"
							data-plugin="chat"
						>
							<div v-if="activeUser">
								<div class="navbar flex-nowrap b-b position-relative">
									<h5 class="mb-0 text-ellipsis flex mx-1 font-weight-bold">
										{{ activeUser.name }} {{ activeUser.surname }}
										<small
											class="text-muted d-block mt-0 sub-item"
											v-if="activeUser.status.is_online"
											>Çevrimiçi</small
										>
									</h5>
									<div v-if="loadingMessages" class="loading-messages">
										<button
											class="btn btn-sm btn-rounded btn-default i-con-h-a"
										>
											Yükleniyor...<i class="ml-2 el-icon-loading"></i>
										</button>
									</div>
								</div>
								<div
									class="scrollable hover"
									ref="messagebody"
									style="height: calc(100vh - 323px)"
									@scroll="loadMessages"
								>
									<div class="p-3" v-if="messages.length > 0">
										<div class="chat-list">
											<div
												class="chat-item"
												v-for="item in messages"
												:class="{ alt: currentUser.id === item.from }"
											>
												<div class="chat-body">
													<div class="chat-content rounded msg">
														{{ item.message }}
													</div>
													<div class="chat-date date">
														<app-date-text
															:text="item.created_at"
														></app-date-text>
													</div>
												</div>
											</div>
											<div v-if="typing" class="chat-item" data-class="alt">
												<div class="chat-body">
													<div class="chat-content rounded msg">...</div>
													<div class="chat-date date">Yazıyor</div>
												</div>
											</div>
										</div>
									</div>
									<div v-if="!loadingMessages && messages.length === 0" class="row padding text-center">
										<div class="col-10 offset-1">
											<app-svg
												style="width: 40%"
												class="mx-auto"
												src="/assets/img/vectors/message.svg"
											></app-svg>
											<h5 class="font-weight-bold">
												Sohbet geçmişi bulunmuyor
											</h5>
											<p>
												Hemen <span class="badge badge-md bg-primary-lt mx-1 badge-pill">Selam {{ activeUser.name }}</span> yazabilir, sohbete başlayabilirsin.
											</p>
										</div>
									</div>
								</div>
								<div
									class="p-3 white lt b-t mt-auto d-block position-relative"
									id="chat-form"
								>
									<div v-if="newMessage" class="new-messages">
										<button
											v-if="unreadMessagesCount(activeUser.id) !== 0"
											@click="clearUnreadMessages(activeUser.id)"
											class="btn btn-raised btn-wave btn-sm btn-rounded green i-con-h-a w-md"
										>
											{{ unreadMessagesCount(activeUser.id) }} Yeni Mesaj
											<i class="i-con i-con-down float-right"><i></i></i>
										</button>
									</div>
									<el-input
										v-model="message"
										@keyup.enter.native="sendMessages"
										placeholder="Mesaj yazın..."
										class="input-with-select"
									>
										<el-popover
											slot="prefix"
											popper-class="app-emoji-popper"
											placement="top"
											trigger="click"
										>
											<VEmojiPicker
												:i18n="i18n"
												@select="selectEmoji"
											></VEmojiPicker>
											<i
												class="el-icon-cloudy-and-sunny el-input__icon pointer"
												slot="reference"
											></i>
										</el-popover>
										<span slot="suffix"
											><i
												@click="sendMessages"
												class="el-icon-top el-input__icon pointer"
											></i
										></span>
									</el-input>
								</div>
							</div>
							<div v-else class="row padding text-center">
								<div class="col-10 offset-1">
									<app-svg
										style="width: 40%"
										class="mx-auto"
										src="/assets/img/vectors/message.svg"
									></app-svg>
									<h5 class="font-weight-bold">
										{{ $t("module.message.landing_title") }}
									</h5>
									<p>
										{{ $t("module.message.landing_description") }}
									</p>
								</div>
							</div>
						</div>
					</div>
        </div>
      </div>
			
      </div>
		</app-module-body>
	</app-module>
</template>
<script>
import { mapGetters } from "vuex";
import VEmojiPicker from "v-emoji-picker";
import EventBus from "../../utils/EventBus";

export default {
	components: {
		VEmojiPicker,
	},
	data() {
		return {
			searchKey: "",
			loadingUsers: false,
			loadingMessages: false,
			newMessage: true,
			typing: false,
			activeUser: false,
			allUsers: [],
			messages: [],
			message: "",
			unreads: [],
			messagesActivePage: 1,
			i18n: {
				search: "Ara ...",
				categories: {
					Activity: "Sık Kullanılanlar",
					Flags: "Baylaklar",
					Foods: "Yemekler",
					Frequently: "Spor",
					Objects: "Objeler",
					Nature: "Doğa",
					Peoples: "İnsanlar",
					Symbols: "Semboller",
					Places: "Ülkeler",
				},
			},
		};
	},
	computed: {
		...mapGetters(["currentUser", "socket", "users"]),
	},
	created() {
		this.getUsers();
		console.log("Listen");
		//this.socket.server.on("chat", this.addNewMessage);
		EventBus.$on("socket_chat", this.addNewMessage);
		/*let self = this;
    setInterval(() => {
        self.addNewMessage({
            from: '1',
            to: '2',
            message: 'Timeout ' + Math.floor(Math.random() * 10000000000) + " " + Math.floor(Math.random() * 10000000000),
            created_at: '2019-12-12 00:00:00'
        })
    }, 3000);*/
	},
	watch:{
		users:() => {
			this.users = this.users;
		}
	},
	beforeDestroy() {
		EventBus.$off("socket_chat");
	},
	methods: {
		loadMessages(e) {
			if (this.$refs.messagebody.scrollTop === 0) {
				let currentScrollHeight = this.$refs.messagebody.scrollHeight;
				this.loadingMessages = true;
				this.messagesActivePage++;
				this.$api.get(
					"chats/" + this.activeUser.id,
					{ page: this.messagesActivePage },
					(response) => {
						response.data.data
							.slice()
							.reverse()
							.forEach((item) => {
								this.messages.unshift(item);
							});
						let self = this;
						this.$nextTick().then(function() {
							self.$refs.messagebody.scrollTop =
								self.$refs.messagebody.scrollHeight - currentScrollHeight;
							self.loadingMessages = false;
						});
					}
				);
			}
		},
		unreadMessagesCount(id) {
			let count = 0;
			this.unreads.forEach((item, index) => {
				if (item.from === id) count++;
			});
			return count;
		},
		clearUnreadMessages(id) {
			this.unreads = this.unreads.filter((q, i) => {
				return q.from !== id;
			});
			let self = this;
			this.$nextTick().then(function() {
				self.scrollToBottom();
			});
		},
		addNewMessage(message) {
			console.log("ActiveUser", this.activeUser.id);
			message.to = parseInt(message.to);
			message.from = parseInt(message.from);
			console.log("addMewMessage", message);
			let self = this;
			if (message.from !== this.activeUser.id) {
				console.log("Other User");
				this.unreads.push(message);
			} else if (
				message.from === this.activeUser.id &&
				this.$refs.messagebody.scrollHeight ===
					this.$refs.messagebody.scrollTop + this.$refs.messagebody.clientHeight
			) {
				console.log("This User And Bottom");
				this.messages.push(message);
				this.$nextTick().then(function() {
					self.scrollToBottom();
				});
			} else {
				console.log("This User Not Bottom");
				this.messages.push(message);
				this.unreads.push(message);
			}
		},
		selectEmoji(emoji) {
			console.log(emoji);
		},
		getUsers() {
			this.users = this.users;
			this.allUsers = this.users;
		},
		getMessages(user, first = true) {
			this.loadingMessages = true;
			this.messages = [];
			this.$api.get(
				"chats/" + user.id,
				{ page: this.messagesActivePage },
				(response) => {
					this.activeUser = user;
					this.messages = response.data.data.slice().reverse();
					this.loadingMessages = false;
					this.messagesActivePage = 1;
					let self = this;
					this.$nextTick().then(function() {
						self.clearUnreadMessages(user.id);
						self.scrollToBottom();
					});
				}
			);
		},
		scrollToBottom() {
			let element = this.$refs.messagebody;
			element.scrollTop = element.scrollHeight;
		},
		setTyping() {
			if (this.message.length > 0) {
				this.typing = true;
				this.scrollToBottom();
			} else {
				this.typing = false;
			}
		},
		sendMessages() {
			this.$api.post(
				"chats",
				{
					user: {
						id: this.activeUser.id,
					},
					message: this.message,
				},
				(response) => {
					this.messages.push({
						created_at: new Date().toISOString(),
						delivery_report: false,
						from: this.currentUser.id,
						message: this.message,
						to: this.activeUser.id,
					});
					this.message = "";
					let self = this;
					this.$nextTick().then(function() {
						self.scrollToBottom();
					});
				}
			);
		},
		clearNewMessages() {
			this.newMessage = false;
			this.scrollToBottom();
		},
		searchFields() {
			if (this.searchKey !== "") {
				this.users = this.allUsers.filter((item) => {
					return (item.name + item.surname).includes(this.searchKey);
				});
			} else {
				this.users = this.allUsers;
			}
		},
	},
};
</script>
<style>
.app-emoji-popper {
	padding: 0 !important;
}

.new-messages {
	position: absolute;
	top: -47px;
	text-align: center;
	left: 0;
	right: 0;
}

.loading-messages {
	position: absolute;
	bottom: -47px;
	text-align: center;
	left: 0;
	right: 0;
}
</style>
