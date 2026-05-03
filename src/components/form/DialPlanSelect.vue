<template>
  <div class="d-block position-relative">
    <div v-if="dataLoading" style="position:absolute; right: 30px; z-index:9; top:10px;"><i class="el-icon-loading"></i></div>
    <el-select size="medium" :disabled="dataLoading" v-model="itemID" :placeholder="placeholder">
      <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        {{ item.name }}
        <span class="float-left">{{ item.label }}</span>
        <small class="float-right text-muted">
          {{item.application_name}} <span v-if="item.application === 'dial'">kullanıcısına</span><span v-else>kuyruğuna</span> yönlendiriliyor
        </small>
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: {required: true}
  },
  data() {
    return {
      placeholder: '',
      dataLoading: false,
      options: [],
    }
  },
  created() {
   
    this.itemID = null;
    this.dataLoading = true;
    this.placeholder = 'Yükleniyor...';
    this.$api.get('settings/dialplans', {}, (result) => {
      this.options = result.data.data;
      this.dataLoading = false;
      this.placeholder = 'Arama Planı Seçin';
      this.itemID = this.value;
    });
  },
  computed: {
    itemID: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
<style>
.el-select {
  width: 100%;
}
</style>