<template>
  <div class="d-inline-block app-log">
    <el-dropdown @command="open">
      <button class="ml-2 btn btn-sm btn-icon btn-rounded btn-light i-con-h-a">
        <i class="i-con i-con-more"><i></i></i>
      </button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="history">Geçmiş</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog v-if="modalVisible" :custom-class="!showDetail ? 'app-modal app-modal-no-footer' : 'app-modal-no-footer app-modal app-modal-large'" :append-to-body="true" :visible.sync="modalVisible">
      <template slot="title">
        <div class="row">
          <div class="col">
            <h6 class="mt-2 ml-2 mb-0"><i class="i-con i-con-history mr-1"><i></i></i> Geçmiş</h6>
          </div>
          <div class="col-auto pr-5" v-if="showDetail">
            <button disabled class="btn btn-primary btn-sm btn-rounded i-con-h-a"><i class="i-con i-con-repeat mr-1"><i></i></i>
              Versiyonu Geri Yükle
            </button>
          </div>
        </div>
      </template>
      <div class="row">
        <div class="col app-modal-scrollable">
          <div v-if="!data[0]" class="text-center pt-3">
            <img class="col-6" src="/assets/img/vectors/history.svg" alt="">
            <h6>İşlem Kaydı Bulunamadı</h6>
            <small>Daha fazla bilgi için lütfen sistem yöneticinize danışın.</small>
          </div>
          <div v-else class="timeline timeline-theme pt-2">
            <div class="tl-item" v-for="(item, key) in data">
              <div class="tl-dot pt-3">
                <span class="tl-author"><span class="w-32 avatar circle" :class="{'bg-primary': activeHistory && activeHistory.key === key,'bg-light': !activeHistory || activeHistory.key !== key}"><i class="i-con i-con-edit"><i></i></i></span></span>
              </div>
              <div class="tl-content i-con-h-a" :class="{'tl-content-active': activeHistory && activeHistory.key === key}" @click="setDetail(item, key)">
                <div class="tl-active-right">
                  <i class="i-con i-con-right"><i></i></i></div>
                <div class="">{{ item.type }}</div>
                <small class="">{{ item.user.name }} {{ item.user.surname }}</small>
                <div class="tl-date w-100 text-muted mt-1">
                  <app-date-text :text="item.created_at"></app-date-text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-5 app-modal-scrollable pt-4" v-if="showDetail">
          <div class="b-r-3x mb-2 bg-soft" style="border-radius: 8px">
            <div class="row row-sm p-3">
              <div class="col-auto">
                <span><span class="w-48 avatar circle bg-white">SS</span></span>
              </div>
              <div class="col p-1">
                <span>{{ activeHistory.user.name }} {{ activeHistory.user.surname }}</span>
                <small class="item-except text-muted h-1x">{{ activeHistory.user.email }}</small>
              </div>
            </div>
            <div class="b-t p-3">
              <small><i class="i-con i-con-globe mr-1"><i></i></i> {{ activeHistory.ip_address }}</small>
            </div>
          </div>
          <small class="text-muted d-block mb-3">Bu işlemden etkilenen alanlar <i class="i-con i-con-edit"><i></i></i>
            sembolüyle belirtilmiştir. Sembolün üzerine gelerek önceki halini görebilirsiniz.</small>

          <h6 class="mt-1 mb-3 mb-0 d-block">Kayıt Detayları</h6>
          <div class="bg-soft" style="border-radius: 8px">
            <div v-for="key in Object.keys(activeHistory.request)" v-if="labels.includes(key)" class="py-3 px-3 b-t record-line">
              <small class="d-block text-muted">{{ key }}:</small>
              <div class="d-block">{{ activeHistory.request[key] }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {diff, addedDiff, deletedDiff, updatedDiff, detailedDiff} from 'deep-object-diff';

export default {
  props: {
    ownerType: {
      required: true,
    },
    ownerId: {
      required: true,
    },
    labels: {
      required: true,
    }
  },
  data() {
    return {
      data: [],
      activeHistory: {},
      modalVisible: false,
      showDetail: false,
    }
  },
  created() {
  },
  methods: {
    open() {
      this.getData();
      this.modalVisible = true;
    },
    getData() {
      this.$api.get('history?owner_type=' + this.ownerType + '&owner_id=' + this.ownerId, {}, (response) => {
        this.data = response.data.data;
      })
    },
    setDetail(item, key) {
      this.activeHistory = {
        created_at: item.created_at,
        ip_address: item.ip_address,
        request: JSON.parse(item.request),
        type: item.type,
        user: item.user,
        key: key,
      };
      this.showDetail = true;
    },
    diff,
  }
}
</script>
<style>
.record-line:first-child{
  border-top:0 !important;
}
.bg-soft{
  background: #FAFAFA;
}
.el-dialog.app-modal-large {
  width: 80%;
  transition: 0.5s;
  height: calc(90vh - 64px) !important;
}

.app-modal.app-modal-no-footer .el-dialog__body {
  height: calc(90vh - 64px) !important;
  overflow: hidden;
  padding: 0;
}

.app-modal-scrollable:first-child {
  border-right: 1px solid #FAFAFA;
  padding-right: 20px;
}

.app-modal-scrollable:last-child {
  padding-left: 20px;
}

.app-modal-scrollable {
  height: calc(90vh - 68px) !important;
  overflow-y: auto;
  padding: 15px 30px;
}

.app-log .tl-content {
  width: 100%;
  padding-left: 10px;
  border-left: 3px solid transparent;
  margin-bottom: 3px;
}

.app-log .tl-content:hover {
  border-radius: 8px;
  background: #FAFAFA;
  cursor: pointer;
  transition: 0.3s;
  padding-left: 20px;
  margin-left: 5px;
}

.app-log .tl-content-active {
  border-radius: 8px;
  background: #FAFAFA;
  cursor: pointer;
  transition: 0.3s;
  padding-left: 20px;
  margin-left: 5px;
  border-left: 3px solid #006BEC;
}

.app-log .tl-content:hover .tl-active-right {
  opacity: 1;
}

.app-log .tl-active-right {
  transition: 0.5s;
  position: absolute;
  top: 30px;
  right: 10px;
  opacity: 0;
}
.bg-dark .app-modal-scrollable:first-child {
  border-right: 1px solid #333539;
}
.bg-dark .tl-content:hover{
  background: #1F2124;
}
.bg-dark .bg-soft{
  background: #1F2124;
}
.bg-dark .tl-content-active{
  background: #1F2124;
}
</style>