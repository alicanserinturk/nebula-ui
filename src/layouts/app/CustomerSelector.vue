<template>
  <el-popover
      v-model="visible"
      popper-class="p-0 border app-customers-popper"
      placement="bottom-start"
      width="480"
      trigger="click">
    <el-tabs tab-position="left" style="height: 340px;">
      <el-tab-pane>
        <span slot="label" class="i-con-h-a"><i class="i-con mr-2 i-con-grid"><i></i></i> Tümü</span>
        <div class="px-3 py-3 b-b">
          <el-input v-model="searchKey" @input="getCustomers" placeholder="Ara"
                    :suffix-icon="customersLoading ? 'el-icon-loading' : 'el-icon-search'" size="mini"></el-input>
        </div>
        <div class="pt-2" style="height: 280px;overflow: auto">
          <template v-if="loading">
            <div class="text-center pt-3">
              <small>Yükleniyor</small>
            </div>
          </template>
          <div v-else class="app-customers-popper-row row row-sm px-3 py-2 mb-1" v-for="item in customers">
            <div class="col-auto" @click="setCurrentUserCustomer(item.id)" v-if="item.name">
              <span class="w-32 avatar circle bg-light">{{ item.name[0] }}</span>
            </div>
            <div class="col" @click="setCurrentUserCustomer(item)">
              <span class="d-block">{{ item.name }}</span>
              <small class="text-muted d-block">{{ item.responsible_name }}</small>
            </div>
            <div class="col-auto text-right pr-2 pt-2">
              <i class="el-icon-star-off pointer"
                 v-if="!checkFavorite(item)" @click="addFavorite(item)"></i>
              <i class="el-icon-star-on pointer text-primary" v-else @click="removeFavorite(item)"></i>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label" class="i-con-h-a"><i class="i-con mr-2 i-con-star"><i><i></i></i></i> Favoriler</span>
        <div class="p-3 b-b" style="height: 61px">
          <h6 class="mb-0 mt-2">Favoriler</h6>
        </div>
        <div class="pt-2" v-if="currentUser.settings.customer_selector.favorites.length !== 0" style="height: 280px;overflow: auto">
          <div class="app-customers-popper-row row row-sm px-3 py-2 mb-1"
               v-for="item in currentUser.settings.customer_selector.favorites">
            <div class="col-auto" @click="setCurrentUserCustomer(item.id)" v-if="item.name">
              <span class="w-32 avatar circle bg-light">{{ item.name[0] }}</span>
            </div>
            <div class="col" @click="setCurrentUserCustomer(item)">
              <span class="d-block">{{ item.name }}</span>
              <small class="text-muted d-block">{{ item.responsible_name }}</small>
            </div>
            <div class="col-auto text-right pr-2 pt-2">
              <i class="el-icon-star-off pointer"
                 v-if="!checkFavorite(item)" @click="addFavorite(item)"></i>
              <i class="el-icon-star-on pointer text-primary" v-else @click="removeFavorite(item)"></i>
            </div>
          </div>
        </div>
        <div v-else class="text-center px-5 py-2">
          <app-svg src="/assets/img/vectors/favorites.svg" class="mx-5"></app-svg>
          <small class="text-muted">Herhangi bir favori bulunamadı. Tüm müşterileri listeleyerek sık kullandıklarınızı favorilere
            ekleyebilirsiniz.</small>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label" class="i-con-h-a"><i class="i-con mr-2 i-con-history"><i></i></i> En Son</span>
        <div class="p-3 b-b" style="height: 61px">
          <h6 class="mb-0 mt-2">Geçmiş <span class="float-right pointer" v-if="currentUser.settings.customer_selector.history.length !== 0" @click="clearHistory"><i
              class="el-icon-delete"></i></span></h6>
        </div>
        <div class="pt-2" style="height: 280px;overflow: auto"
             v-if="currentUser.settings.customer_selector.history.length !== 0">
          <div class="app-customers-popper-row row row-sm px-3 py-2 mb-1"
               v-for="item in currentUser.settings.customer_selector.history">
            <div class="col-auto" @click="setCurrentUserCustomer(item.id)" v-if="item.name">
              <span class="w-32 avatar circle bg-light">{{ item.name[0] }}</span>
            </div>
            <div class="col" @click="setCurrentUserCustomer(item)">
              <span class="d-block">{{ item.name }}</span>
              <small class="text-muted d-block">{{ item.responsible_name }}</small>
            </div>
            <div class="col-auto text-right pr-2">
              <i class="el-icon-refresh-left"></i>
              <small class="d-block text-muted">
                <app-date-text :text="item.history_date"></app-date-text>
              </small>
            </div>
          </div>
        </div>
        <div v-else class="text-center px-5 py-2">
          <app-svg src="/assets/img/vectors/history.svg" class="mx-5"></app-svg>
          <small class="text-muted">Herhangi bir geçmiş bulunamadı. Müşteriler arasında geçiş yaptıkça geçmiş kayıtları görüntüleyebilirsiniz.</small>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="reference" class="customer-selector d-block pointer">
      <small class="font-weight-500 d-block">{{ currentUser.customer.name }} <i class="el-icon-arrow-down right"></i></small>
    </div>
  </el-popover>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import EventBus from "@/utils/EventBus";

export default {
  data() {
    return {
      visible: false,
      loading: false,
      searchTimeout: null,
      searchKey: '',
      customersLoading: false,
      customers: [],
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  watch:{
    visible(value){
      if(value)
        this.getCustomers();
    }
  },
  created() {
    // Set Default Settings
    if (!('customer_selector' in this.currentUser.settings)) {
      this.currentUser.settings['customer_selector'] = {
        favorites: [],
        history: [],
      }
    }
    let self = this;
    EventBus.$on('addCustomer', () => {
      self.getCustomers();
    });
  },
  methods: {
    ...mapActions(['updateCurrentUser']),
    setCurrentUserCustomer(item) {
      EventBus.$emit('startLoading');
      setTimeout(() => {
        this.currentUser.customer = item;
        this.addHistory({
          ...item,
          history_date: new Date(),
        })
        this.updateCurrentUser();
        this.$router.push('/refresh');
        setTimeout(() => {
          EventBus.$emit('stopLoading');
          this.$message.success(this.currentUser.customer.name + ' müşterisinin verilerini görüntülüyorsunuz.');
        }, 1000)
      }, 1000)
    },
    getCustomers() {
      clearTimeout(this.searchTimeout);
      this.loading = true;
      this.customersLoading = true;
      this.searchTimeout = setTimeout(() => {
        if (this.$api.has('customer_list', true)) {
          this.$api.get('settings/customers', {
            q: this.searchKey
          }, (response) => {
            this.loading = false;
            this.customers = response.data.data;
            this.customersLoading = false;
          });
        }
      }, 500);
    },
    checkFavorite(item) {
      let key = this.currentUser.settings.customer_selector.favorites.findIndex(i => {
        return i.id === item.id;
      });
      return key !== -1;
    },
    addFavorite(item) {
      this.currentUser.settings.customer_selector.favorites.push(item);
      this.updateCurrentUser();
    },
    removeFavorite(item) {
      let key = this.currentUser.settings.customer_selector.favorites.findIndex(i => {
        return i.id === item.id;
      });
      if (key !== -1) {
        this.currentUser.settings.customer_selector.favorites.splice(key, 1);
      }
      this.updateCurrentUser();
    },
    addHistory(item) {

      let key = this.currentUser.settings.customer_selector.history.findIndex(i => {
        return i.id === item.id;
      });
      if (key !== -1) {
        this.currentUser.settings.customer_selector.history.splice(key, 1);
      }
      this.currentUser.settings.customer_selector.history.unshift(item);
      console.log(this.currentUser.settings.customer_selector.history);
    },
    clearHistory() {
      this.currentUser.settings.customer_selector.history = [];
      this.updateCurrentUser();
    }
  }
}
</script>
<style>
.customer-selector {
  /*padding:5px 10px;
  background: #FFF;
  border-radius: 6px;
  border:1px solid #EEE;
  color:#0e1012;*/
}
.bg-dark .app-customers-popper-row:hover{
  background: #1F2124;
}
.bg-dark .app-customers-popper h6{
  color:#DDD !important;
}
.bg-dark .app-customers-popper .el-tabs__header{
  border-right: 1px solid #333;
}
.bg-dark .el-tabs__item.is-active{
  color:var(--primary-color);
}
.bg-dark .el-tabs__item{
  color:#DDD;
}
.bg-dark .app-customers-popper-row{
  color:#EEE;
}
</style>