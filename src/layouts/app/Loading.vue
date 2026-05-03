<template>
  <div  class="app-layout-loading bg-light" :class="{'processing': visible, 'fade-in': fadeClass === 'in', 'fade-out': fadeClass === 'out'}">
    <a href="#" class="intro-banner-vdo-play-btn" target="_blank">
      <span class="ripple pinkBg"></span>
      <span class="ripple pinkBg"></span>
    </a>
  </div>
</template>
<script>
import EventBus from "@/utils/EventBus";

export default {
  data() {
    return {
      visible: false,
      fadeClass: '',
    }
  },
  created() {
    EventBus.$on('startLoading', () => {
      console.log('startLoading');
      this.fadeClass = 'in';
      this.visible = true;
    })
    EventBus.$on('stopLoading', () => {
      console.log('stopLoading');
      this.fadeClass = 'out';
      setTimeout(() => {
        this.visible = false;
        console.log('false');
      },300);
    })
  },
  beforeDestroy() {
    EventBus.$off('startLoading');
    EventBus.$off('stopLoading');
  }
}
</script>
<style scoped>
.fade-in{
  animation: fadeIn ease .5s;
  -webkit-animation: fadeIn ease .5s;
  -moz-animation: fadeIn ease .5s;
  -o-animation: fadeIn ease .5s;
  -ms-animation: fadeIn ease .5s;
}
.fade-out{
  animation: fadeOut ease .5s;
  -webkit-animation: fadeOut ease .5s;
  -moz-animation: fadeOut ease .5s;
  -o-animation: fadeOut ease .5s;
  -ms-animation: fadeOut ease .5s;
}
.app-layout-loading.processing{
  display: block;
}
.app-layout-loading{
  display: none;
  position: fixed;
  top:0;
  bottom:0;
  left:0;
  width: 100%;
  z-index: 9999;
  padding:20px 30px 30px 30px;
}
.app-layout-loading *{
  color:rgba(0,0,0,0.8);
}
.pinkBg {
  background-color: var(--primary-color) !important;
}
.intro-banner-vdo-play-btn {
  height: 60px;
  width: 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  margin: -30px 0 0 -30px;
  border-radius: 100px;
  z-index: 99;
}
.intro-banner-vdo-play-btn i {
  line-height: 56px;
  font-size: 30px;
}
.intro-banner-vdo-play-btn .ripple {
  position: absolute;
  width: 160px;
  height: 160px;
  left: 50%;
  top: 50%;
  opacity: 0;
  margin: -80px 0 0 -80px;
  border-radius: 100px;
  -webkit-animation: ripple 1.8s infinite;
  animation: ripple 1.8s infinite;
  z-index: -1;
}

@-webkit-keyframes ripple {
  0% {
    opacity: 1;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes ripple {
  0% {
    opacity: 1;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.intro-banner-vdo-play-btn .ripple:nth-child(2) {
  animation-delay: 0.3s;
  -webkit-animation-delay: 0.3s;
}
.intro-banner-vdo-play-btn .ripple:nth-child(3) {
  animation-delay: 0.6s;
  -webkit-animation-delay: 0.6s;
}

@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-moz-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-webkit-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-o-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@-ms-keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@keyframes fadeOut {
  0% {opacity:1;}
  100% {opacity:0;}
}

@-moz-keyframes fadeOut {
  0% {opacity:1;}
  100% {opacity:0;}
}

@-webkit-keyframes fadeOut {
  0% {opacity:1;}
  100% {opacity:0;}
}

@-o-keyframes fadeOut {
  0% {opacity:1;}
  100% {opacity:0;}
}

@-ms-keyframes fadeOut {
  0% {opacity:1;}
  100% {opacity:0;}
}

</style>