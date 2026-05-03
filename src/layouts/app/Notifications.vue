<template>
  <div class="app-side-modal b-l" v-if="this.visible">
    <div class="app-side-modal-header px-4">
      <div class="row row-xs">
        <div class="col-auto pt-1">
          <ion-icon name="notifications-outline" style="font-size:19px;"></ion-icon>
        </div>
        <div class="col pt-1">
          <h6 class="mb-0 ml-1 font-weight-bold" style="line-height:21px;">Bildirimler</h6>
        </div>
        <div class="col-auto">
          <button v-if="notifications.length > 0" class="btn btn-rounded btn-sm btn-white" @click="clearNotifications()">Bildirimleri Temizle</button>
          <button class="btn btn-icon btn-rounded btn-sm btn-white" @click="visible = false"><i class="el-icon-close"></i></ion-icon></button>
        </div>
      </div>
    </div>
    <div class="app-side-modal-body pb-3 px-4">
      <div class="app-notifications-clear" v-if="notifications.length === 0">
        <div class="p-3 py-4 r-3x mb-3 text-center">
              <app-svg class="col-6 mx-auto" src="/assets/img/vectors/settings-notification.svg"></app-svg>
              <small class="d-block mb-4 mx-4">Herhangi bir bildiriminiz yok. Bildirimleriniz burada görüntülecek.</small>
       </div>
      </div>
      <div v-else>
        <div class="b-b py-3 pointer" v-for="notification in sortedNotifications">
          <div class="row row-sm">
            <div class="col-auto pt-1">
              <span class="avatar circle w-36 bg-light">
                SS
              </span>
            </div>
            <div class="col">
              <small>{{notification.message}}</small>
              <small class="d-block mt-1 text-muted"><app-date-text :text="notification.created_at"></app-date-text></small>
            </div>
          </div>
      </div>
      </div>
    </div>
    <div class="app-side-modal-footer py-4 px-4">
        <div class="bg-light p-3 r-3x">
            <div class="row row-sm">
              <div class="col text-left">
                <span v-if="currentUser.settings['notifications']">Bildirimleri Açık</span>
                <span v-else>Bildirimleri Aç</span>
              </div>
              <div class="col-auto pointer" @click="openNotificationSettings">
                <ion-icon name="settings-outline" style="font-size:16px; margin-top:3px;"></ion-icon>
              </div>
              <div class="col-auto">
                <el-switch @input="updateCurrentUser" v-model="currentUser.settings['notifications']"></el-switch>
              </div>
            </div>
          </div>
    </div>
  </div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import {mapActions, mapGetters} from "vuex";

export default {
  data(){
    return {
      visible:false,
    }
  },
  computed:{
    ...mapGetters(['notifications','currentUser']),
    sortedNotifications(){
      return this.notifications.slice().reverse()
    }
  },
  created() {
    EventBus.$on('openNotifications',() => {
        this.visible = true;
    });
  },
  beforeDestroy() {
    EventBus.$off('openNotifications');
  },
  methods:{
    ...mapActions(['updateCurrentUser','clearNotifications']),
    openNotificationSettings(){
      EventBus.$emit('openPreferences','notification')
    }
  }
}
</script>