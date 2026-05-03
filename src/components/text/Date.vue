<template>
  <el-tooltip class="item" effect="dark" :open-delay="500" :content="text | moment" placement="top">
    <span class="app-text-date" style="cursor: default">{{filter}}</span>
  </el-tooltip>
</template>
<style>

</style>
<script>
import moment from 'moment';

export default {
  props: {
    text: {
      require: false,
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
      moment.locale('tr');
      return moment(date).format('Do MMMM YYYY ddd hh:mm:ss');
    }
  },
  computed: {
    filter: function () {
      if(!this.text)
      return "Bilinmeyen zamanda"

      let date = new Date(this.text)

      if (date < new Date()) {
        let seconds = Math.floor((new Date() - date) / 1000);

        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
          return interval + " yıl önce";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          return interval + " ay önce";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          return interval + " gün önce";
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          return interval + " saat önce";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          return interval + " dakika önce";
        }
        if(seconds == 0)
          return "Şimdi";
        return seconds + " saniye önce";
      } else {
        let seconds = Math.floor((new Date() - date) / 1000);
        seconds = Math.abs(seconds);
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) {
          return interval + " yıl sonra";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          return interval + " ay sonra";
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          return interval + " gün sonra";
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          return interval + " saat sonra";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          return interval + " dakika sonra";
        }
        if(seconds == 0)
          return "Şimdi";
        return seconds + " saniye sonra";
      }
    }
  }
}
</script>