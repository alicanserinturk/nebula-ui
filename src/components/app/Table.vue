<template>
  <div class="app-table">
    <div class="app-table-header" v-if="selected.length > 0">
      <div class="app-module-toolbar actions row row-xs pb-0 pt-0">
        <div class="col-md-auto">
          <el-button v-for="(item,key) in defaultActions" :key="key" @click="actionModal(key)" class="mr-1" size="small">
            <i :class="item.icon" class="mr-1"></i>{{ item.name }}
          </el-button>
          <template v-if="!excelLoading">
            <el-button v-if="downloadable" @click="download" class="mr-1" size="small">
              <i class="el-icon-download mr-0"></i> Dışarı Aktar
            </el-button>
          </template>
          <template v-else>
            <el-button v-if="downloadable" class="mr-1" size="small" disabled="true">
              <i class="el-icon-loading mr-0"></i> Dışarı Aktarılıyor
            </el-button>
          </template>
        </div>
        <div class="col-md text-right text-muted pl-2">
          <div style="width: 150px;float:right">
            <el-select v-model="onlySelected" size="small">
              <el-option :value="true" :label="selected.length + ' kayıt seçildi'"></el-option>
              <!--<el-option :value="false" label="Tüm kayıtları seç"></el-option>-->
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="app-table-toolbar row app-table-filter-bar" v-else>
      <div class="col-auto" v-for="(filter, key) in filters" :key="key" v-if="filter.type === 'primary' && !filter.hidden">
        <div class="app-module-toolbar bg-white pb-0 pt-0 position-relative">
          <div class="col-md-auto">
            <el-radio-group v-model="filter.value" size="mini">
              <el-radio-button :value="option.value" :label="option.value" :key="option.value" v-for="option in filter.options">
                {{ option.name }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row no-gutters">
          <div class="col">
            <div class="app-module-toolbar bg-white row row-xs pb-0 pt-0 position-relative">
              <div class="col-md app-table-filter-search" style="padding-bottom:0 !important;">
                <el-input v-model="search.key" size="mini" prefix-icon="el-icon-search" placeholder="Ara..."></el-input>
              </div>
              <div class="col-auto" style="padding-bottom:0 !important;" v-for="(filter, key) in filters" v-if="filter.type !== 'primary' && filter.value !== '' && filter.value">
                <div slot="reference" class=" btn-light r-3x b-l ml-1 btn-toolbar" :key="key" @click="filterVisible = true; filterLoaded = true;">
                  <span class="d-inline-block">{{ getFilterLabel(filter) }}</span><button class="btn btn-icon btn-white btn-rounded"><ion-icon name="close" @click="filter.value = null"></ion-icon></button>
                </div>
              </div>
              <div class="col-auto" style="padding-bottom:0 !important;">
                <el-popover
                    v-model="filterVisible"
                    placement="bottom"
                    width="400"
                    popper-class="app-table-filter"
                    trigger="manual">
                  <div>
                    <template v-if="filterLoaded">
                      <span key="test" class="text-label text-muted d-block mb-3">Filtreler</span>
                      <app-form-row :required="filter.required" v-for="(filter, key) in filters" :key="key" :label="filter.name" v-if="filter.type !== 'primary' && !filter.hidden">
                        <TableFilterInput :type="filter.type" v-model="filter.value"></TableFilterInput>
                        <small v-if="filter.required" class="d-block mt-2 text-muted"><small class="text-danger"><ion-icon name="alert-circle-outline"></ion-icon></small> Raporu oluşturabilmek için bu alanı seçmelisiniz.</small>
                      </app-form-row>
                    </template>
                  </div>
                  <div class="text-right pt-2">
                    <button class="btn btn-light mr-2 btn-rounded" @click="filterVisible = false">Kapat</button>
                    <button class="btn btn-primary btn-rounded" @click="filterVisible = false">Uygula</button>
                  </div>
                  <div class="b-l btn-toolbar"  v-if="Object.keys(filters).length > 0" slot="reference" @click="filterVisible = true; filterLoaded = true;">
                    <span><ion-icon name="filter-outline"></ion-icon></span>
                  </div>
                </el-popover>

              </div>
            </div>
          </div>


        </div>

      </div>
    </div>
    <el-table
        ref="multipleTable"
        :data="items"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          v-if="selectable"
          type="selection"
          width="35">
      </el-table-column>
      <slot></slot>
      <el-table-column
          v-if="selectable"
          fixed="right"
          align="right"
          label=""
          width="50">
        <template slot-scope="scope">
          <div class="item-action dropdown">
            <el-dropdown :hide-on-click="false" size="medium" trigger="click" @command="handleAction">
              <ion-icon name="ellipsis-vertical" class="text-muted pointer" style="margin-top:8px;"></ion-icon>
              <el-dropdown-menu slot="dropdown">
                <!--<router-link :to="$route.fullPath + '/' + scope.row.id.toString() + '/edit'">
                  <el-dropdown-item><i class="el-icon-edit-outline"></i> Düzenle</el-dropdown-item>
                </router-link>-->
                <el-dropdown-item :key="item.key" :command="{key:key, item:scope.row}" v-for="(item,key) in defaultActions"><i :class="item.icon"></i>{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--Landing-->
    <div class="app-table-landing pb-4" v-if="items.length === 0 && !loading">
      <template v-if="!archived">
        <div class="text-center row pt-4">
          <div style="width:200px;" class="mx-auto">
            <app-svg v-if="hasRequiredFilters" :src="'/assets/img/vectors/select.svg'"></app-svg>
            <app-svg v-else-if="Object.keys(filters).length > 0" :src="'/assets/img/vectors/empty-filter.svg'"></app-svg>
            <app-svg v-else :src="'/assets/img/vectors/'+ vector +'.svg'"></app-svg>
          </div>
          <div class="col-12">
            <div class=" text-center" v-if="hasRequiredFilters">
              <h5 class="mb-2 d-block font-weight-bold">Filtre seçimi yapın</h5>
              <span>Sonuçların listelenebilmesi <span class="badge badge-md bg-primary-lt mx-1 badge-pill" v-for="filter in requiredFilters">{{filter.name}}</span> filtresini seçin.</span>
              <div class="mt-4">
                <button class="btn btn-primary btn-rounded" @click="filterVisible = true; filterLoaded = true;">
                  <ion-icon name="checkmark-circle-outline"></ion-icon> Filtre Seç
                </button>
              </div>
            </div>
            <div class=" text-center" v-else-if="getSelectedFiltersCount()">
              <h5 class="mb-2 d-block font-weight-bold">Aradığınız filtreye uygun kayıt bulunmuyor</h5>
              <span>Filtreleme sonucu herhangi bir kayıt bulunamadı, <br>filtreyi temizleyerek tekrar deneyebilirsiniz.</span>
              <div class="mt-4">
                <button class="btn btn-light btn-rounded" @click="clearFilters">
                  <ion-icon name="close-circle-outline"></ion-icon> Filtreyi Temizle
                </button>
              </div>
            </div>
            <div class="col-12" v-else>
              <h5 class="mb-2 d-block font-weight-bold">Herhangi bir kayıt bulunamadı</h5></small>
              <span>{{ text }}</span>
              <div class="mt-4">
                <slot name="action"></slot>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else class="pb-4">
        <div class="app-table-landing-left">
          <div class="app-table-landing-cover">
            <app-svg :src="'/assets/img/vectors/archived.svg'"></app-svg>
          </div>
        </div>
        <div class="app-table-landing-right">
          <div class="app-table-landing-cover">
            <h6 class="mb-2">Arşivlenen Bir Kayıt Bulunamadı</h6>
            <small>Arşivlenen kayıtlar listelerde görülemez ve aktif olarak kullanılamaz.</small>
            <div class="mt-3">
              <div class="bg-white text-dark r-2x px-4 py-3 shadow pointer" @click="archived = false">
                <i class="el-icon-back mr-1"></i> Tüm Kayıtlar <i class="el-icon-folder float-right mt-1"></i>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!--Landing-->

    <div v-if="loading" class="app-table-row-loading bg-white border" style="padding-right:30px; padding-left:48px; margin-top:13px; padding-top:0.75rem; width: 100%; height:60px; border-radius: 10px; box-shadow:0 0 6px -3px rgba(0,0,0,0.1)">
      <SkeletonTheme :highlight="currentUser.settings.interface_dark_mode ? '#27292C' : '#FFF'" :color="currentUser.settings.interface_dark_mode ? '#1F2124' : '#F2F2F2'">
        <div>
          <Skeleton height="14px" width="150px"></Skeleton>
        </div>
        <div style="margin-top:0px;">
          <Skeleton height="12px" width="270px"></Skeleton>
        </div>
      </SkeletonTheme>
    </div>

    <!--Loading-->
    <!--<div class="app-table-loading" v-if="loading">
      <i class="el-icon-loading"></i>
    </div>-->
    <!--Loading-->

    <!--Pagination-->
    <div class="app-table-pagination">
      <div class="float-left">
        <div class="row row-xs">
          <div class="col-auto" v-if="downloadable">
            <el-button v-if="excelLoading" disabled="true" size="small" class="mr-2"><i class="el-icon-loading mr-0"></i> Dışarı Aktarılıyor</el-button>
            <el-button v-if="!excelLoading" @click="download(true)" size="small" class="mr-2"><i class="el-icon-download mr-0"></i> Dışarı Aktar</el-button>
          </div>
          <div class="col-auto" v-if="archivable">
            <el-select v-model="archived" size="small" @input="getData"  >
              <el-option :value="false" label="Tüm Kayıtlar">Tüm Kayıtlar</el-option>
              <el-option :value="true" label="Arşivlenmiş Kayıtlar">Arşivlenmiş Kayıtlar</el-option>
            </el-select>
          </div>
        </div>

      </div>
      <el-pagination
          v-if="items.length > 0 && !loading"
          background
          :current-page.sync="pagination.current_page"
          :page-size.sync="pagination.per_page"
          :page-sizes="[15,25,50]"
          layout="total, prev, pager, next, sizes "
          :total="pagination.total"
          @size-change="getData"
          @current-change="getData">
      </el-pagination>
    </div>
    <!--Pagination-->
    <!--Action Modals-->
    <el-dialog v-if="action.modalVisible" custom-class="app-dialog"
               :append-to-body="true" :visible.sync="action.modalVisible">
      <template slot="title"><span class="text-label">{{defaultActions[action.active].confirmTitle}}</span></template>
      <template>
        <div class="row">
          <div class="col-7 pl-5 pt-5">
            <h4 class="alert-heading font-weight-bold mt-1">
              {{ defaultActions[action.active].name }}
            </h4>
            <p class="mt-3">
              {{ defaultActions[action.active].confirmText }}
            </p>
            <p class="mb-0" v-if="selected.length > 0">
              <span class="text-primary"><strong>{{ selected.length }} kayıt işlemden etkilenecek.</strong></span>
            </p>
          </div>
          <div class="col-md-5">
            <app-svg class="col-12" src="/assets/img/vectors/data.svg" alt=""></app-svg>
          </div>
        </div>
        <div v-if="errors.length > 0 && selected.length === 0" class="px-4 mx-1 py-3 alert r-3x mb-0 alert-warning" role="alert">
          <small class="mb-0"><strong style="font-weight: 700">{{ errors.length }} kayıt için işlem gerçekleştirilemedi</strong></small>
          <div class="mt-2" v-for="item in errors">
            <span class="d-block text-sm font-weight-bold">{{
                item.field.name
              }} <small><i class="el-icon-top-right"></i></small></span>
            <small class="d-block" v-if="typeof item === 'object'" v-for="error in item.data">{{
                error.message
              }}</small>
            <small class="d-block" v-else>{{ item.data.message }}</small>
          </div>
        </div>
        <div slot="footer" class="app-dialog-footer">
          <div class="row">
            <div class="col-md pt-2">
              <el-progress v-if="action.status" :text-inside="true" :stroke-width="20"
                           :percentage="action.percent"></el-progress>
            </div>
            <div class="col-md-auto">
              <button class="btn btn-light btn-rounded mr-2" @click="cancelAction">Vazgeç</button>
              <button class="btn btn-primary btn-rounded" @click="close" v-if="errors.length > 0">Tamam</button>
              <button v-else class="btn btn-primary btn-rounded" @click="runAction">
                <i :class="defaultActions[action.active].icon + ' mr-1'"></i> {{ defaultActions[action.active].name }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </el-dialog>
    <!--Action Modals-->
  </div>
</template>
<script>
import {Skeleton, SkeletonTheme} from 'vue-loading-skeleton';
import XLSX from 'xlsx';
import {mapGetters} from "vuex";
import TableFilterInput from "./TableFilterInput.vue";

export default {
  components: {
    Skeleton,
    SkeletonTheme,
    TableFilterInput
  },
  props: {
    'endpoint': {'required': false},
    'filters': {
      'required': false, default: () => {
        return {}
      }
    },
    'landing': {required: false, default: 'default'},
    'text': {required: false, default: 'Hemen yeni bir kayıt oluşturarak başlayabilirsin'},
    'vector': {required: false, default: 'empty'},
    'back': {required: false, default: false},
    'create': {required: false, default: false},
    'createtext': {required: false, default: false},
    'editable': {required: false, default: true},
    'deletable': {required: false, default: true},
    'downloadable': {required: false, default: false},
    'archivable': {required: false, default: false},
    'actions': {
      required: false, default: () => {
        return {}
      }
    },
    'selectable': {required: false, default: false},
    beforeDownload: {required: false, default: false}
  },
  data() {
    return {
      typeFilters:{
        daterange:(val) => {
          return val[0] + " ile " + val[1] + " arası";
        },
        select:(val) => {
          return val;
        },
        user:(val) => {
          return val.name + " " + val.name;
        },
        form:(val) => {
          return val.name;
        },
        number:(val) => {
          return val.name;
        },
        queue:(val) => {
          return val.name;
        },
        call_list:(val) => {
          return val.name;
        },
        call_endpoint:(val) => {
          return val.name;
        },
        result_code:(val) => {
          return val.name;
        },
        default:(val) => {
          return val;
        },
      },
      filterLoaded: false,
      hasRequiredFilters: true,
      requiredFilters:[],
      errors: [],
      filterVisible: false,
      test: '',
      multipleSelection: [],
      loading: false,
      excelLoading: false,
      items: [],
      selectAll: false,
      selected: [],
      toolbar: {
        checkAll: false,
      },
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
      },
      search: {
        key: '',
        timeout: null,
      },
      selectedFilters: {},
      onlySelected: true,
      action: {
        count: 0,
        status: false,
        active: '',
        modalVisible: false,
        percent: 23
      },
      i: 0,
      archived: false,
      defaultActions: {
        /*archive: {
          method: 'patch',
          endpoint: '/:id',
          parameters: {},
          name: 'Arşivle',
          confirmTitle: 'Arvişleme İşlemini Onayla',
          confirmText: 'Arşivlenen kayıtları daha sonra tekrar arşivden çıkarabilirsiniz.',
          description: '',
          icon: 'el-icon-takeaway-box',
          withArchived: false,
        },
        unArchive: {
          method: 'patch',
          endpoint: '/:id',
          parameters: {},
          name: 'Arşivden Çıkar',
          confirmTitle: 'Arşivden Çıkarma İşlemini Onayla',
          confirmText: 'Arşivden çıkardığınız kayıtlar listelerde tekrar görülecektir.',
          description: '',
          icon: 'el-icon-folder-opened',
          withArchived: false,
        },*/
        delete: {
          method: 'delete',
          endpoint: '/:id',
          parameters: {},
          name: 'Sil',
          confirmTitle: 'Silme İşlemini Onayla',
          confirmText: 'Silme işlemi geri alınmaz, kaydı silmek için tekrar ihtiyacınız olmayacağınızdan emin olun. Yine de silmek istediğinize emin misiniz? ',
          description: '',
          icon: 'el-icon-delete',
          withArchived: false,
        },
        /*
        copy: {
          method: 'patch',
          endpoint: '/:id',
          parameters: {},
          name: 'Kopyala',
          confirmTitle: 'Kopyalama İşlemini Onayla',
          confirmText: 'Seçtiğiniz kayıtların kopyası oluşturulacak.',
          description: '',
          icon: 'el-icon-document-copy',
        },*/
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser']),

    createText: function () {

    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.loading = true;
        this.items = [];
        clearTimeout(this.search.timeout);
        this.search.timeout = setTimeout(() => {
          this.getData();
        }, 1000);
      }
    },
    'search.key': function () {
      this.loading = true;
      this.items = [];
      clearTimeout(this.search.timeout);
      this.search.timeout = setTimeout(() => {
        this.getData();
      }, 1000);
    },
    '$route': function () {
      this.getData();
    }
  },
  created() {
    this.checkFilters(() => {
      this.getData();
    })
    if (this.actions !== {})
      this.defaultActions = {...this.actions, ...this.defaultActions};
  },
  methods: {
    getSelectedFiltersCount(){
      let count = 0;
      Object.keys(this.filters).forEach((key) => {
        if(this.filters[key].value){
          count++;
        }
      });
      return count;
    },
    getFilterLabel(filter){
      if(this.typeFilters[filter.type] && typeof this.typeFilters[filter.type] !== 'undefined')
        return this.typeFilters[filter.type](filter.value);
      else
        return this.typeFilters.default(filter.value)
    },
    setFilters(){
      let filters = {};
      Object.keys(this.$route.query).forEach(item => {
        this.filters[item] = this.$route.query[item];
      })
      /*Object.keys(this.filters).forEach((item) => {
        if (this.filters[item].value !== '' && this.filters[item].value)
         {
          filters[item] = this.filters[item].value;
         }
      });*/
      //this.$router.push({ path: this.$route.path, query: filters});
    },
    checkFilters(handle = () => {}){
      Object.keys(this.filters).forEach(key => {
        if(this.filters[key].required)
        {
          this.requiredFilters.push(this.filters[key]);
        }
      });
      if(this.requiredFilters.length === 0){
        this.hasRequiredFilters = false;
        handle();
      } else {
        this.hasRequiredFilters = true;
      }
    },
    handleAction(data){
      this.selected = [data.item]
      this.actionModal(data.key)
    },
    changeArchived(status) {
      this.archived = status;
    },
    flattenData(items) {
      let results = [];
      for (const i in items) {
        results[i]={};
        for (const ii in items[i]) {
          if ((typeof items[i][ii]) === 'object' && !Array.isArray(items[i][ii])) {
            const temp = this.flattenData([items[i][ii]]);
            for (const j in temp[0]) {
              results[i][ii+"_"+j] = temp[0][j];
            }
          }
          else {
            results[i][ii] = items[i][ii];
          }
        }
      }
      return results;
    },
    downloadData(data){
      const fileName = this.$t('menu.modules.' + this.$route.meta.key + '.title') + ' ' + new Date().toISOString().substring(0, 10) + '.xlsx';
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, this.$t('menu.modules.' + this.$route.meta.key + '.title'));
      XLSX.writeFile(wb, fileName);
    },
    download(all = false) {
      this.excelLoading=true;
      if(all) {
        this.fetchData(true, (response) => {
          let data = response.data.data;
          if(this.beforeDownload) {
            data = this.beforeDownload(data);
          }
          this.downloadData(this.flattenData(data));
          this.excelLoading=false;
        });
      }
      else {
        let data = this.selected;
        if(this.beforeDownload) {
          data = this.beforeDownload(data);
        }
        this.downloadData(this.flattenData(data));
        this.excelLoading=false;
      }
    },
    close() {
      this.action.modalVisible = false;
      this.errors = [];
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.selected = val;
    },
    archivedChange() {
      this.selectAll = false;
      this.selected = [];
      this.getData();
    },
    actionModal(action) {
      this.action.percent = 0;
      this.action.active = action;
      this.action.modalVisible = true;
    },
    cancelAction() {
      this.action.modalVisible = false;
    },
    async runAction() {
      this.action.status = true;
      this.action.count = this.selected.length;
      this.i = 0;
      for (const item of this.selected) {
        /*
        * Run Action
        * */
        let id = item.id
        let selectedAction = this.defaultActions[this.action.active];
        this.i++;
        this.$api[selectedAction.method](this.endpoint + selectedAction.endpoint.replace(':id', id), selectedAction.parameters, (response) => {
          this.setPercent(this.i);
        }, (status, response) => {
          this.setError(id, response);
          this.setPercent(this.i);
        });
        await this.sleep(600);
      }
    },
    setError(id, error) {
      let item = this.items.find(item => {
        return item.id === id;
      })
      this.errors.push({
        field: item,
        data: error,
      });
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    setPercent(i) {
      let percent = Math.ceil(((i / this.action.count) * 100));
      if (percent === 100) {
        this.refresh();
        this.selectAll = false;
        this.selected = [];
        setTimeout(() => {
          this.action.status = false;
          if (this.errors.length === 0) {
            this.action.modalVisible = false;
          }
        }, 1000);
      }
      this.action.percent = percent;
    },
    isSelected(id) {
      return this.selected.includes(id)
    },
    handleCheckAll(value) {
      if (this.selectAll) {
        this.selected = [];
        this.items.forEach((item) => {
          this.selected.push(item.id)
        })
      } else {
        this.selected = [];
      }
    },
    handleCheck(id) {
      if (this.selected.includes(id)) {
        //this.selected.slice(id, 1)
      } else {
        this.selected.push(id);
      }
    },
    analysis() {

    },
    clearFilters(){
      Object.keys(this.filters).forEach((key) => {
        this.filters[key].value = null;
      });
    },
    fetchData(all = false, callback = (data) => {}) {
      let filters = {};
      let self = this;
      Object.keys(self.filters).forEach((item) => {
        if(typeof self.filters[item].value === 'object' && !Array.isArray(self.filters[item].value) && self.filters[item].value)
        {
          console.log("Object",self.filters[item].value);
          filters[item] = self.filters[item].value.id;
        }
        else if (self.filters[item].value !== '' && self.filters[item].value)
        {
          console.log("String",item);
          filters[item] = self.filters[item].value;
        }
      });
      console.log("Filtre",self.filters,filters);
      let endpoint = this.endpoint;
      Object.keys(this.filters).forEach((key) => {
        endpoint = endpoint.replace(':' + key, this.filters[key].value);
      });
      this.$api.get(endpoint, {
        ...filters,
        page: all ? 1 : this.pagination.current_page,
        per_page: all ? 10000 : this.pagination.per_page,
        q: this.search.key,
        archived: this.archived,
      }, callback );
    },
    getData() {
      let self = this;
      self.loading = true;
      this.items = [];
      this.fetchData(false, (response) => {
        this.loadData(response.data);
      });
    },
    loadData(response) {
      this.loading = false;
      this.items = response.data;
      this.$emit("loaded", response);
      if (typeof response.meta !== 'undefined') {
        this.pagination.total = response.meta.total;
      } else {
        this.pagination.total = response.data.length;
      }
    },
    setUrl() {

    },
    refresh() {
      this.getData();
    }
  }
}
</script>
<style lang="scss">
.el-table__body-wrapper tr:not(.el-table__row) td{
  border-radius: 8px !important;
}

.el-pagination {
  text-align: right;
  padding:0 !important;
}
.el-pagination__sizes{
  margin-right: 0 !important;
}

.app-table {
  position: relative;
  padding-bottom: 30px;
  min-height: calc(100vh - 170px);
  padding-bottom:40px;
}

.app-table-loading {
  height: auto;
  position: absolute;
  top: calc(50vh - 175px);
  left: 50%;
  font-size: 25px;
}

.loading {
  height: 32px !important;
  width: 32px !important;
}

.app-table .el-checkbox__inner {
  height: 17px;
  width: 17px;
  border-radius: 4px;
}

.app-table .el-checkbox__inner::after {
  height: 9px;
  left: 5px;
}

.app-table .el-checkbox {
  margin-bottom: 0 !important;
}

.app-table .app-table-landing {
  text-align: center;
}

.app-table .app-table-landing-left {
  width: 50%;
  float: left;
}

.app-table .app-table-landing-left div > img {
  max-width: 100%;
}

.app-table .app-table-landing-right {
  padding-top: 100px;
  width: 50%;
  float: left;
  color: #99A0AC;
  font-weight: 400;
}

.app-table .app-table-landing-cover {
  width: 350px;
}

.app-table-landing-right .app-table-landing-cover {
  float: left;
  text-align: left;
  padding-left: 20px;
}

.app-table-landing-left .app-table-landing-cover {
  float: right;
}

.app-table-pagination {
  position: absolute;
  bottom:0;
  left:0;
  display: block;
  width: 100%;
  background: rgba(249, 249, 249, 1);
  padding: 1rem 0 0.2rem 0;
  z-index: 9;
}

.app-table-pagination .el-input__icon {
  line-height: 28px !important;
}

.app-table-pagination .el-input__inner,  .app-table-pagination .el-button{
  background-color: #f4f4f5;
  border: 0 !important;
}

.app-module-toolbar .el-input__inner {
  background: #FFF !important;
}

.app-table .avatar {
  background-size: cover !important;
  background-position: center !important;
}

.app-table-create {
  position: absolute;
  top: -83px;
  right: -2px;
}

.app-table-create .el-button.el-button--primary {

}

.app-module-modal.app-module-modal-settings .page-hero {
  width: 320px !important;
}

.app-table .el-checkbox__label {
  display: none;
}

.app-table .el-date-range-picker {
  z-index: 99999 !important;
}

.el-select-dropdown {
  z-index: 99999 !important;
}

.el-table {
  background: inherit !important;
}

.app-table .el-table__body {
  border-collapse: separate !important;
  border-spacing: 0 15px !important;
}

.app-table .el-table__row {
  background-color: #FFF;
  transform: scale(1);
}

.app-table .el-table__fixed, .el-table__fixed-right {
  box-shadow: 0 0 20px -7px rgba(0, 0, 0, 0.06);
}

.app-table .el-table th {
  padding-bottom: 0 !important;
}

.app-table .el-table th:first-child .cell {
  padding-right: 0 !important;
}

.app-table .el-table th:first-child {
  padding-left: 5px !important;
}

.app-table .el-table th:last-child {
  padding-right: 5px !important;
}
.app-table .el-table__row td {
  padding: .60rem 0 .60rem .75rem;
  font-size: 14px;
  border:0;
}

.app-table .el-table__row td:first-child .cell {
  padding-right: 0 !important;
}

.app-table .el-table__row td:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-left: 1rem;
}

.app-table .el-table__row td:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-right: 1rem;
}
.app-table .el-table .cell{
  padding-top:0.2rem !important;
  padding-bottom:0.2rem !important;
}
.app-table .el-table .el-table__header thead tr {
  background-color: #F7F8FA;
}




.bg-dark .el-table__row.hover-row td{
  background: #27292C!important
}
.el-table__row.hover-row td {
  background: #FFF !important;
}

.app-table .el-table th {
  background: inherit !important;
  font-size: 12px !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 400;
}

.app-table .el-table th.is-leaf {
  border-bottom: 0 !important;
}

.app-table .el-table .cell {
  padding: 0;
}

.sub-item {
  margin-top: -5px;
  display: block;
}

.app-table .el-table__empty-block {
  display: none;
}

.app-table .el-table::before {
  visibility: hidden;
}

.app-table .app-table-toolbar {

}

.app-table .el-pagination .el-pager li {
  border-radius: 8px !important;
  border:0;
}

.app-table .el-pagination button {
  border-radius: 8px !important;
}

.app-table-filter-bar .app-module-toolbar {
  border-radius: 10px;
  padding: 5px;
  box-sizing: border-box !important;
  margin: 0;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.05);
}

.app-module-toolbar .el-radio-button:first-child .el-radio-button__inner {
  box-shadow: none !important;
}

.app-table-filter-bar .app-module-toolbar .el-radio-button__inner {
  box-shadow: none !important;
  border: 0;
  border-radius: 8px !important;
}

.app-table-filter-bar .app-module-toolbar > * {
  padding: 5px 0 5px 0;
}

.app-table-filter-bar button.btn-white {
  border: 1px solid transparent !important;
}

.app-table-filter-bar .btn-icon{
  border-radius: 100px !important;
}
.app-table-filter-bar button {
  border-radius: 8px;
  box-shadow: none !important;
}

.app-table-filter-search .el-input__inner, .app-table-filter-search .el-input__inner:active, .app-table-filter-search .el-input__inner:focus {
  border: 1px solid transparent !important;
  background: inherit !important;
  box-shadow: none !important;
}

.app-table-filter {
  padding: 1.5rem 1rem;
  border-radius: 8px !important;
  box-shadow: 0px 10px 70px rgb(0 0 0 / 15%) !important;
  border:1px solid transparent !important;
  border-radius: 12px !important;
  .el-input__inner{
    border-width:2px;
  }
  input{
    background-color: inherit;
  }
}

.app-table-filter .app-form-row {
  width: calc(100% + 24px);
  margin-left: -12px;
  padding: 0 12px;
}

.actions button {
  height: 38px;
  border-radius: 8px;
  box-sizing: border-box !important;
  margin: 0;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.05);
}
.app-table .el-table__expanded-cell{
  padding:1rem 1rem !important;
}
.app-table .el-table__row.expanded{
  margin-bottom: -20px !important;
}
.app-table .el-table__fixed-right::before, .el-table__fixed::before{
  background-color: transparent !important;
}
.btn-toolbar .btn-icon {
  line-height: 18px;
  height: 18px;
  width: 18px;
  font-size:10px;
  padding:0 !important;
  margin-left:5px;
}
.btn-toolbar {
  height: 28px !important;
  line-height: 28px !important;
  width: auto !important;
  border:0 !important;
  padding: 0 0.50rem 0 0.75rem !important;
  font-size:12px;
  display: inline-block;
  cursor: pointer;
  overflow:hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
  margin-bottom:0 !important;
}
.btn-toolbar:hover{

}
</style>
