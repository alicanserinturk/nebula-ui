<template>

  <div class="row row-sm">
    <div v-for="item in items" class="col-3">
      <div class="app-form-pbx text-center px-1 py-3 border pointer r-2x mb-3" :class="{'active': itemID === item.id}" @click="setValue(item.id)">
        <h6 class="mb-1">{{ item.name }}</h6>
        <small>{{ item.host }}</small>
      </div>
    </div>
    <div v-if="items.length === 0 && loading" class="col-3 app-form-pbx text-center px-1 py-3 border pointer r-2x mb-3">
      <h6 class="mb-1"><i class="el-icon-loading"></i></h6>
      <small class="text-muted">Yükleniyor...</small>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      items: [],
      loading: false,
    }
  },
  created() {
    this.getItems();
  },
  computed: {
    itemID: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    },
  },
  methods: {
    setValue(id) {
      this.itemID = id;
    },
    getItems() {
      this.loading = true;
      this.$api.get('settings/pbx', {}, (result) => {
        this.items = result.data.data;
        if (this.items.length > 0 && this.itemID === null) {
          this.itemID = this.items[0].id;
        }
        this.loading = false;
      });
    }
  }
}
</script>
<style>
.app-form-pbx.active {
  border: 1px solid #448bff !important;
  outline: 0 !important;
  box-shadow: 0 0 0 .2rem rgba(68, 139, 255, .25) !important;
}

.app-form-pbx.active h6 {
  color: var(--primary-color);
}

.app-form-pbx {
  min-height: 60px;
}
</style>