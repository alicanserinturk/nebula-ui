<template>
  <div class="app-side-modal b-l app-side-modal-messages" v-if="visible">
    <div class="app-side-modal-header b-b px-4">
      <div class="row row-xs">
        <div class="col-auto">
          <ion-icon name="chatbubbles-outline" style="font-size:19px;"></ion-icon>
        </div>
        <div class="col">
          <h5 class="mb-0 ml-1">Mesajlar</h5>
        </div>
        <div class="col-auto">
          <ion-icon class="pointer" @click="visible = false"  style="font-size:20px;" name="close-outline"></ion-icon>
        </div>
      </div>
    </div>
    <div class="app-side-modal-body">
      <div class="d-flex flex">

        <div class="d-flex flex" id="content-body" style="height: calc(100vh - 61px)">
          <div class="d-flex flex-column flex" id="chat-list" data-plugin="chat">
            <div v-if="activeUser">
              <div class="navbar flex-nowrap b-b position-relative">
                <span class="text-md text-ellipsis flex mx-1">{{ activeUser.name }} {{ activeUser.surname }} <small class="text-muted d-block sub-item" v-if="activeUser.status.is_online">Çevrimiçi</small></span>
                <div v-if="loadingMessages" class="loading-messages">
                  <button class="btn btn-sm btn-rounded btn-default i-con-h-a">Yükleniyor...<i class="ml-2 el-icon-loading"></i></button>
                </div>
              </div>
              <div class="scrollable hover" ref="messagebody" style="height: calc(100vh - 195px)" @scroll="loadMessages">
                <div class="p-3">
                  <div class="chat-list">
                    <div class="chat-item" v-for="item in messages" :class="{'alt': currentUser.id === item.from}">
                      <div class="chat-body">
                        <div class="chat-content rounded msg">{{ item.message }}</div>
                        <div class="chat-date date">
                          <app-date-text :text="item.created_at"></app-date-text>
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
              </div>
              <div class="p-3 white lt b-t mt-auto d-block position-relative" id="chat-form">
                <div v-if="newMessage" class="new-messages">
                  <button v-if="unreadMessagesCount(activeUser.id) !== 0" @click="clearUnreadMessages(activeUser.id)" class="btn btn-raised btn-wave btn-sm btn-rounded green i-con-h-a w-md">
                    {{ unreadMessagesCount(activeUser.id) }} Yeni Mesaj
                    <i class="i-con i-con-down float-right"><i></i></i></button>
                </div>
                <el-input v-model="message" @keyup.enter.native="sendMessages" placeholder="Mesaj yazın..." class="input-with-select">
                  <el-popover
                      slot="prefix"
                      popper-class="app-emoji-popper"
                      placement="top"
                      trigger="click">
                    <VEmojiPicker :i18n="i18n" @select="selectEmoji"></VEmojiPicker>
                    <i class="el-icon-cloudy-and-sunny el-input__icon pointer" slot="reference"></i>
                  </el-popover>
                  <span slot="suffix"><i @click="sendMessages" class="el-icon-top el-input__icon pointer"></i></span>
                </el-input>
              </div>
            </div>
            <div v-else class="row padding text-center">
              <div class="col-10 offset-1">
                <img style="width: 40%" src="/assets/img/vectors/message.svg" alt=".">
                <h6>{{ $t('module.message.landing_title') }}</h6>
                <p>
                  {{ $t('module.message.landing_description') }}
                </p>
                <!--<el-button size="mini"><i class="el-icon-plus"></i>
                    {{$t('module.message.create_message')}}
                </el-button>-->
              </div>
            </div>
          </div>
        </div>
        <div class="aside hover-anchor" id="content-aside">
          <div class="d-flex flex-column b-l modal-dialog" id="chat-nav">
            <div class="navbar b-b position-relative px-2 ml-0 text-center">
              <div class="input-group flex">
                <input @input="searchFields" v-model="searchKey" type="text" class=" hover-show form-control px-0 no-bg no-border no-shadow search" :placeholder="$t('constants.search_placeholder')" required="">
                <span class="input-group-append"><button class="btn no-bg no-shadow i-con-h-a" type="button"><i class="i-con i-con-search w-16 text-muted"></i></button></span>
              </div>
              <div v-if="loadingUsers" class="loading-messages">
                <button class="btn btn-sm btn-rounded btn-default i-con-h-a">
                  Yükleniyor... <i class="ml-2 el-icon-loading"></i>
                </button>
              </div>
            </div>
            <div class="scrollable">
              <div v-if="users.length > 0 && !loadingUsers" class="list list-row">
                <div v-if="item.id !== currentUser.id" v-for="item in users" class="list-item px-0 pointer" :class="{'bg-light': item.id === activeUser.id}" @click="getMessages(item)">
                  <!--<div><span class="avatar-status on"></span></div>-->
                  <div>
                      <span class="w-48 avatar circle bg-light"><span v-if="item.status.is_online" class="avatar-status on b-white avatar-right"></span>{{
                          item.name[0]
                        }}{{ item.surname[0] }}</span>
                  </div>
                  <div class="flex hover-show" style="min-width: 200px">
                    <span class="item-author">{{ item.name }} {{ item.surname }}</span>
                    <div v-if="item.chats_last_from" class="item-except text-muted h-1x">
                      {{ item.chats_last_from.message }}
                    </div>
                  </div>
                  <div v-if="unreadMessagesCount(item.id) !== 0">
                    <span class="item-amount badge badge-pill bg-success">{{ unreadMessagesCount(item.id) }}</span>
                  </div>
                </div>
              </div>
              <div v-else-if="!loadingUsers" class="no-result">
                <div class="p-5 text-center">
                  <p>
                    {{ $t('module.message.user_not_fount_description') }}
                  </p>
                  <el-button size="mini"><i class="el-icon-plus"></i>
                    {{ $t('module.message.create_user') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import VEmojiPicker from "v-emoji-picker"
import EventBus from "../../utils/EventBus";

export default {
  components: {
    VEmojiPicker
  },
  data() {
    return {
      visible:true,
      searchKey: '',
      loadingUsers: false,
      loadingMessages: false,
      newMessage: true,
      typing: false,
      activeUser: false,
      users: [],
      allUsers: [],
      messages: [],
      message: '',
      unreads: [],
      messagesActivePage: 1,
      i18n: {
        search: 'Ara ...',
        categories: {
          Activity: "Sık Kullanılanlar",
          Flags: "Baylaklar",
          Foods: "Yemekler",
          Frequently: "Spor",
          Objects: "Objeler",
          Nature: "Doğa",
          Peoples: "İnsanlar",
          Symbols: "Semboller",
          Places: "Ülkeler"
        }
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'socket']),
  },
  created() {
    this.getUsers();
    console.log('Listen');
    this.socket.server.on('chat', this.addNewMessage);
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
  beforeDestroy() {
    this.socket.server.off('chat', this.addNewMessage)
  },
  methods: {
    loadMessages(e,) {
      if (this.$refs.messagebody.scrollTop === 0) {
        let currentScrollHeight = this.$refs.messagebody.scrollHeight;
        this.loadingMessages = true;
        this.messagesActivePage++;
        this.$api.get('chats/' + this.activeUser.id, {page: this.messagesActivePage}, (response) => {
          response.data.data.reverse().forEach((item) => {
            this.messages.unshift(item);
          });
          let self = this;
          this.$nextTick()
              .then(function () {
                self.$refs.messagebody.scrollTop = self.$refs.messagebody.scrollHeight - currentScrollHeight;
                self.loadingMessages = false;
              })

        });
      }
    },
    unreadMessagesCount(id) {
      let count = 0;
      this.unreads.forEach((item, index) => {
        if (item.from === id) count++
      })
      return count;
    },
    clearUnreadMessages(id) {
      console.log('clearUnreadMessages',id);
      this.unreads = this.unreads.filter((q, i) => {
        return q.from !== id;
      });
      let self = this;
      this.$nextTick()
          .then(function () {
            self.scrollToBottom();
          })
    },
    addNewMessage(message) {
      console.log('ActiveUser',this.activeUser.id);
      message.to = parseInt(message.to);
      message.from = parseInt(message.from);
      console.log('addMewMessage', message);
      let self = this;
      if (message.from !== this.activeUser.id) {
        console.log("Other User");
        this.unreads.push(message);
      } else if (message.from === this.activeUser.id && this.$refs.messagebody.scrollHeight === this.$refs.messagebody.scrollTop + this.$refs.messagebody.clientHeight) {
        console.log("This User And Bottom");
        this.messages.push(message);
        this.$nextTick()
            .then(function () {
              self.scrollToBottom();
            })
      } else {
        console.log("This User Not Bottom");
        this.messages.push(message);
        this.unreads.push(message);
      }
    },
    selectEmoji(emoji) {
      console.log(emoji)
    },
    getUsers() {
      this.loadingUsers = true;
      this.$api.get('chats/users', {}, (response) => {
        this.users = response.data;
        this.allUsers = response.data;
        this.loadingUsers = false;
      });
    },
    getMessages(user, first = true) {
      this.loadingMessages = true;
      this.messages = [];
      this.$api.get('chats/' + user.id, {page: this.messagesActivePage}, (response) => {
        this.activeUser = user;
        this.messages = response.data.data.reverse();
        console.log(response.data.data.reverse());
        this.loadingMessages = false;
        this.messagesActivePage = 1;
        let self = this;
        this.$nextTick()
            .then(function () {
              self.clearUnreadMessages(user.id);
              self.scrollToBottom();
            })
      });
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
      this.$api.post('chats', {
        user_id: this.activeUser.id,
        message: this.message,
      }, (response) => {
        this.messages.push({
          created_at: new Date().toISOString(),
          delivery_report: false,
          from: this.currentUser.id,
          message: this.message,
          to: this.activeUser.id,
        });
        this.message = '';
        let self = this;
        this.$nextTick()
            .then(function () {
              self.scrollToBottom();
            });
      });
    },
    clearNewMessages() {
      this.newMessage = false;
      this.scrollToBottom();
    },
    searchFields() {
      if (this.searchKey !== '') {
        this.users = this.allUsers.filter((item) => {
          return (item.name + item.surname).includes(this.searchKey)
        })
      } else {
        this.users = this.allUsers;
      }
    }
  }
}
</script>
<style lang="scss">
.app-side-modal.app-side-modal-messages{
  width: 700px;
  max-width: 70%;
}
</style>