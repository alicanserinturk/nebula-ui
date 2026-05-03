<template>
  <div>
    <div v-if="show" class="card position-relative i-con-h-a">
      <div class="p-4 position-relative">
        <div class="line"></div>
        <div class="row">
          <!--<div class="col-md-auto">
              <span class="warning-icon"><i class="i-con i-con-warning"><i></i></i></span>
          </div>-->
          <div class="col-md ml-2 pl-4 i-con-h-a">
            <h5 class="alert-heading"><i class="mr-2 i-con i-con-warning"><i class="i-con-border"></i></i>Uyarı</h5>
            <p>Bir şeyler yolunda gitmedi, bazı alanları gözden geçirip tekrar deneyin.</p>
            <div v-for="item in displayedErrors">
              <div class="mb-1">{{ item.message }}</div>
            </div>
            <button class="app-warning-close" @click="close"><i class="el-icon-close"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from "../../utils/EventBus";

export default {
  props: {},
  data() {
    return {
      show: false,
      displayedErrors: {},
      type: '',
    }
  },
  mounted() {
    let self = this;
    EventBus.$on('apiWarning',  (warning) =>  {
      console.log("apiWarning");
      self.displayedErrors = warning;
      self.show = true;
    });
    EventBus.$on('apiWarningClear', function () {
      console.log("apiWarningClear");
      self.show = false;
      self.displayedErrors = [];
    });
  },
  beforeDestroy() {
    EventBus.$off('apiWarning');
    EventBus.$off('apiWarningClear');
  },
  watch: {
    displayedErrors(value) {
      window.scrollTo(0, 0);
    }
  },
  methods: {
    close() {
      this.show = false;
    }
  }
}
</script>
<style>
.line {
  position: absolute;
  top: 1rem;
  left: 1rem;
  bottom: 1rem;
  width: 5px;
  border-radius: 10px;
  background: #DA2953;
}

.warning-icon {
  background: #DA2953;
  color: #FFF;
  margin-left: 10px;
  height: 35px;
  width: 35px;
  border-radius: 100px;
  display: block;
  text-align: center;;
}

.warning-icon i {
  width: 30px;
  height: 30px;
}

.app-warning-close {
  cursor: pointer;
  border: 0;
  box-shadow: none;
  padding: 6px 12px;
  background: transparent;
  position: absolute;
  right: 0;
  top: -15px;
  font-size: 20px;
}

.app-warning-close:hover {
  opacity: 0.8;
}
</style>