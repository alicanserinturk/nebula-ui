<template>
  <div class="app-selector d-inline-block">
    <button @click="showDialog"
        class="btn btn-sm btn-rounded btn-primary i-con-h-a ">
      {{ name }} <i class="i-con i-con-plus"></i></button>
    <el-dialog v-if="modalVisible" custom-class="app-modal app-selector-modal" :append-to-body="true"
        :visible.sync="modalVisible">
      <div class="dialog-loading" v-if="loading">
        <i class="el-icon-loading"></i>
      </div>
      <template slot="title">
        <h5 class="font-weight-bold">{{ name }}</h5>
        <div class="mt-3">
          <el-input prefix-icon="el-icon-search" v-model="search" placeholder="Ara" size="small" @input="getSearchedItems"></el-input>
        </div>
      </template>
      <div><!-- v-if="hasItem(item.id)"-->
        <div class="row mb-4" v-for="(item, key) in items">
          <div class="col-md">
            <slot :row="item"></slot>
          </div>
          <div class="col-md-auto pt-1">
            <button v-if="!isSelected(item.id)" @click="selectItem(item)"
                class="btn btn-sm btn-rounded btn-light i-con-h-a float-right">
              Seç <i class="i-con i-con-ok float-right ml-2"><i></i></i>
            </button>
            <button v-else @click="remove(item.id)" class="btn btn-sm btn-rounded btn-primary i-con-h-a float-right">
              Seçildi <i class="i-con i-con-close float-right ml-2"><i></i></i>
            </button>
          </div>
        </div>
      </div>
      <template slot="footer">
        <div class="float-left pt-1">
          <button class="btn btn-light btn-sm btn-rounded mr-2" :disabled="loading" @click="selectAll()">
            <span v-if="this.selected.length !== this.items.length">Tümünü Seç</span>
            <span v-else>Tüm Seçimleri Kaldır</span>
          </button>
          <small class="text-muted" v-if="selected.length > 0">{{ selected.length }} seçim yapıldı</small>
        </div>
        <button class="btn btn-light btn-sm btn-rounded mr-2" :disabled="loading" @click="modalVisible = false">Vazgeç</button>
        <button class="btn btn-primary btn-sm btn-rounded" :disabled="loading" @click="add()">
          Kaydet <i v-if="loading" class="el-icon-loading ml-2"></i>
        </button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {Skeleton} from 'vue-loading-skeleton';

export default {
  components: {
    Skeleton,
  },
  props: {
    'name': {
      required: false,
      default: false,
    },
    'title': {
      required: false,
      default: false,
    },
    'card': {
      required: false,
      default: false,
    },
    'endpoint': {
      required: false,
      default: false,
    },
    'value': {
      required: false,
      default: {},
    },
    'actionEndpoint': {
      required: false,
      default: false,
    },
    'actionMethod': {
      required: false,
      default: 'put',
    },
    'actionField': {
      required: false,
      default: false,
    },
  },
  data() {
    return {
      search: '',
      timeout: false,
      modalVisible: false,
      items: [],
      selected: [],
      loading: false,
      cache: [],
    }
  },
  created() {
    
  },
  computed: {
    values: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    selectItem(item) {
      this.selected.push(item);
    },
    add() {
      if (this.actionEndpoint && this.actionField && this.actionMethod) {
        this.loading = true;
        let form = {}
        let data = [];
        this.selected.forEach(item => {
          data.push(item.id);
        });
        form[this.actionField] = data;
        this.$api.put(this.actionEndpoint, form, () => {
          this.values = this.selected;
          this.selected = [];
          this.modalVisible = false;
          this.loading = false;
          this.$emit('change', this.values);
        }, () => {
          console.log(this.cache)
          this.values = this.cache;
          this.selected = this.cache;
          this.$emit('change', this.cache);
          this.modalVisible = false;
          this.loading = false;
        });
      } else {
        this.selected = [];
        this.modalVisible = false;
      }
    },
    remove(id) {
      let findKey = null;
      this.selected.forEach((item, key) => {
        if (item.id === id) findKey = key;
      })
      return this.selected.splice(findKey, 1);
    },
    isSelected(id) {
      let find = false;
      this.selected.forEach(item => {
        if (item.id === id) find = true;
      })
      return find;
    },
    hasValue(id) {
      let find = false;
      this.values.forEach(item => {
        if (item.id === id) find = true;
      })
      return find;
    },
    getSearchedItems() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.getItems();
      }, 600);
    },
    getItems() {
      this.loading = true;
      this.$api.get(this.endpoint, {q: this.search}, (response) => {
        this.items = response.data.data;
        this.loading = false;
      })
    },
    hasItem(id) {
      let find = this.values.find((item) => {
        return item.id === id;
      })
      console.log(find);
    },
    selectedIncludes(id) {

    },
    showDialog() {
      this.cache = [...this.value];
      this.selected = [...this.value];
      this.getItems();
      this.modalVisible = true;
    },
    selectAll() {
      if (this.selected.length === this.items.length) {
        this.selected = [];
      } else {
        this.selected = this.items;
      }
    },
  }
}
</script>
<style>
.app-modal.app-selector-modal .el-dialog__body {
  height: calc(90vh - 180px) !important
}

.dialog-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
  padding-top: 35%;
  text-align: center;
  z-index:9;
}

.dialog-loading i {
  font-size: 24px;
}
</style>