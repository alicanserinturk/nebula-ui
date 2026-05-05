<template>
  <el-tooltip class="item" effect="dark" :content="$options.filters.moment(startDate) + ' - ' + $options.filters.moment(endDate)" placement="top">
    <span v-if="filter">{{ filter }}</span>
    <span v-else><i class="el-icon-minus"></i></span>
  </el-tooltip>
</template>
<script>
import moment from "moment";

export default {
  props: {
    startDate: {
      required: false,
      default: false,
    },
    endDate: {
      required: false,
      default: false,
    }
  },
  data() {
    return {}
  },
  methods:{
    moment: function () {
      return moment();
    }
  },
  filters: {
    moment: function (date) {
      date = new Date(date);
      moment.locale('tr');
      return moment(date).format('Do MMMM YYYY ddd hh:mm:ss');
    }
  },
  computed: {
    filter() {
      if (!this.startDate || !this.endDate) {
        return false;
      }

      const range = Math.max(0, Math.floor((new Date(this.endDate) - new Date(this.startDate)) / 1000));
      const hours   = Math.floor(range / 3600);
      const minutes = Math.floor((range % 3600) / 60);
      const seconds = range % 60;
      const pad = n => ('0' + n).slice(-2);

      return hours > 0
          ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
          : `${pad(minutes)}:${pad(seconds)}`;
    }
  }
}
</script>