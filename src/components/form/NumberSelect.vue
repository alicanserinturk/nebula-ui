<template>
  <div class="d-block position-relative">
    <div v-if="dataLoading" style="position:absolute; right: 30px; z-index:9; top:10px;"><i class="el-icon-loading"></i></div>
    <el-select key="number_select" size="medium" :disabled="dataLoading" v-model="itemID" :placeholder="placeholder">
      <el-option
          v-for="item in options"
          :key="'number' + item.id"
          :label="item.name"
          :value="item.id">
        <span class="float-left">
          {{ item.number }}
        </span>
        <small class="float-right text-muted">
          {{ item.name }}
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
    this.dataLoading = true;
    this.placeholder = 'Yükleniyor...';
    this.itemID = null;
    this.$api.get('settings/numbers', {}, (result) => {
      this.options = result.data.data;
      this.dataLoading = false;
      this.placeholder = 'Numara Seçin';
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