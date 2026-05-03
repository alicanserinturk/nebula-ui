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

      let startDate = new Date(this.startDate);
      let endDate = new Date(this.endDate);
      let range = (endDate - startDate) / 1000;

      return ("0" + Math.floor(range / 60)).slice(-2) + ':' + ("0" + (range % 60)).slice(-2);
    }
  }
}
</script>