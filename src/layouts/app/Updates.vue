<template>
  <div>
    <div class="app-side-modal b-l" v-if="this.visible">
      <div class="app-side-modal-header px-4">
        <div class="row row-xs">
          <div class="col-auto pt-1">
            <ion-icon name="megaphone-outline" style="font-size:19px;"></ion-icon>
          </div>
          <div class="col pt-1">
            <h6 class="mb-0 ml-1 font-weight-bold" style="line-height:21px;">Güncelleme Notları</h6>
          </div>
          <div class="col-auto">
            <button class="btn btn-icon btn-rounded btn-sm btn-white" @click="visible = false"><i class="el-icon-close"></i></ion-icon></button>
          </div>
        </div>
      </div>
      <div class="app-side-modal-body px-4 pt-0 pb-3">
        <div class="b-t py-3 pointer" v-for="item in versions" @click="setActiveVersion(item)">
            <h5 class="font-weight-bold mb-1">{{item.version}}</h5>
            <small class="d-block mb-1 text-muted"><small class="mr-1">{{item.description}} &bull; <app-date-text :text="item.release_date"></app-date-text></small></small>
            <div v-for="version in item.content">
            <h6 class="font-weight-bold d-block mb-1">{{version.title}}</h6>
            <ul class="pb-0 list mb-2">
              <li v-for="item in version.items" class="list-item">{{item}}</li>
            </ul>
        </div>
           
        </div>
      </div>
    </div>
    <div class="app-update-alert border bg-white pb-4 px-4" v-if="updateAlertVisible && !activeVersionModalVisible">
      <div class="text-center">
        <app-svg class="col-7 mt-2 mx-auto" src="/assets/img/vectors/ok.svg"></app-svg>
        <h5 class="font-weight-bold mt-2">Yazılımınız güncellendi</h5>
        <span class="d-block mt-2 mb-4">Güncellemeyle ilgili detayları öğrenmek için butona tıklayarak devam edebilirsiniz.</span>
      </div>
      <div>
        <button class="btn btn-primary btn-rounded w-100" @click="showUpdateDetails()">Detayları Görüntüle</button>
      </div>
      <div class="app-update-alert-close">
        <button class="btn btn-sm btn-icon btn-rounded btn-white" @click="closeUpdateAlert()"><i class="el-icon-close"></i></ion-icon></button>
      </div>
    </div>
    <el-dialog  :visible.sync="activeVersionModalVisible" :append-to-body="true">
      <div slot="title">
        <h5 class="font-weight-bold mb-1">{{activeVersion.version}}</h5>
        <span>{{activeVersion.description}}</span>
        <span class="ml-1 text-muted">&bull; <app-date-text :text="activeVersion.release_date"></app-date-text> yayınlandı</span>
      </div>
      <div class="px-4" v-if="activeVersion.content_type === 'json'">
        <div v-for="version in activeVersion.content" class="b-t pt-3">
          <h6 class="font-weight-bold">{{version.title}}</h6>
          <ul class="pb-1 m-0 p-0">
            <li v-for="item in version.items">{{item}}</li>
          </ul>
          <div class="pl-3 pb-3 mb-3">
            <div class="b-2x border shadow d-inline-block mr-2" v-for="(image, key) in version.images" :key="key">
            <el-image 
              style="width: 100px; height: 100px"
              :src="image"
              :preview-src-list="version.images">
            </el-image>
          </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-right">
        <button class="btn btn-primary btn-rounded" @click="activeVersionModalVisible = false">Tamam</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import Axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  data(){
    return {
      visible:false,
      activeVersionModalVisible:false,
      activeVersion:{},
      versions:[],
      updateAlertVisible: false,
    }
  },
  computed:{
    ...mapGetters(["currentUser"]),
  },
  created() {
    EventBus.$on('openUpdates',() => {
        this.visible = true;
    });
    // Sayfa yüklendiğinde bir kez kontrol et; setInterval yok, otomatik poll yapmıyoruz.
    Axios.get("/versions.json?cache=" + Date.now()).then((response) => {
      this.versions = response.data.versions;
      if(this.versions[0] && this.currentUser.settings.last_version !== this.versions[0].version)
      {
        this.updateAlertVisible = true;
      }
    }).catch(() => {});
  },
  beforeDestroy() {
    EventBus.$off('openUpdates');
  },
  methods:{
    ...mapActions(['updateCurrentUser']),
    setActiveVersion(item){
      this.activeVersion = item;
      this.activeVersionModalVisible = true;
    },
    closeUpdateAlert(){
      this.updateAlertVisible = false
      this.currentUser.settings.last_version = this.versions[0].version;
      this.updateCurrentUser()
    },
    showUpdateDetails(){
      this.currentUser.settings.last_version = this.versions[0].version;
      this.updateCurrentUser()
      this.setActiveVersion(this.versions[0])
    },
  }
}
</script>
<style lang="scss">
.app-update-alert{
  position: fixed;
  bottom:1.5rem;
  right:1.5rem;
  width: 300px;
  z-index:1999;
  box-shadow:0 0 60px -23px rgba(0,0,0,0.1);
  border-radius:10px;
  display: block;
  .app-update-alert-close{
    position: absolute;
    right:-12px;
    top:-12px;
  }
}
</style>