<template>
  <div class="d-block position-relative">
    <div v-if="dataLoading" style="position:absolute; right: 30px; z-index:9; top:10px;"><i class="el-icon-loading"></i></div>
    <el-select size="medium" :disabled="dataLoading" v-model="itemID" :placeholder="placeholder" :clearable="clearable">
      <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        {{ item.name }}
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: {required: true},
    clearable: {type: Boolean, default: false}
  },
  data() {
    return {
      placeholder: '',
      dataLoading: false,
      options: [],
    }
  },
  created() {
    let id = this.itemID;
    this.dataLoading = true;
    this.placeholder = 'Yükleniyor...';
    this.itemID = null;
    this.$api.get('settings/queues', {}, (result) => {
      this.options = result.data.data;
      this.dataLoading = false;
      this.placeholder = 'Arama Grubu Seçin';
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