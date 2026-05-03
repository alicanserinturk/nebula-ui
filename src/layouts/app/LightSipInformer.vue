<template>
  <div class="pt-0">
    <app-crm :visible.sync="crm.status"></app-crm>
    <div class="ui-sip-panel b-t" :class="{'drag':dialerDrag}" ref="draggableContainer" id="draggable-container">
      <template v-if="!informer.status">
        <button class="btn btn-sm btn-rounded btn-white i-con-h-a d-block col-12" @click="connect">
          Hatta Gir <i class="i-con i-con-radio i-con-border float-right"><i class="i-con"></i></i>
        </button>
      </template>
      <template v-if="informer.status">
        <button @click="showCrm" type="button" class="btn btn-sm mb-2 col-12 btn-rounded btn-white">
          Crm
        </button>
        <button class="btn btn-sm btn-rounded btn-white col-12 " @click="disconnect">
          Hattan Çık
        </button>
      </template>
      <!--<div v-if="informer.status" :class="{'active':dialWarningVisible,'success': informer.status, 'wait': !sip.connectedCall && !sip.ringing}"
           class="dial-warning"></div>-->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      informer: {
        status: false,
      },
      crm: {
        status: false,
        form: {}
      },
      dialWarningInterval: false,
      dialWarningVisible: true,
      dialerDrag: false,
      dialerPosition: 'fixed',
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      },
    }
  },
  created() {
    this.startDialWarning();
  },
  methods: {
    connect(){
      this.informer.status = true;
    },
    disconnect() {
      this.informer.status = false;
    },
    showCrm() {
      this.crm.status = true;
    },
    startDialWarning() {
      this.dialWarningInterval = setInterval(() => {
        this.dialWarningVisible = !this.dialWarningVisible;
      }, 1000)
    },
    stopDialWarning() {
      clearInterval(this.dialWarningInterval);
    },
    resetDrag() {
      this.dialerDrag = false;
      this.positions.clientX = undefined;
      this.positions.clientY = undefined;
      this.positions.movementX = 0;
      this.positions.movementY = 0;
      this.$refs.draggableContainer.style.top = 'unset';
      this.$refs.draggableContainer.style.left = 'unset';
      this.$refs.draggableContainer.style.bottom = '50px';
    },
    dragMouseDown: function (event) {
      this.dialerDrag = true;
      event.preventDefault()
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
      this.$refs.draggableContainer.style.bottom = 'unset'
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}
</script>
<style>
#draggable-container {

}

#draggable-header {
  z-index: 10;
}

.ui-sip-panel {
  z-index: 9;
  border-radius: 6px;
  padding: 1rem;
  width: 218px;
  height: auto;
}

.ui-sip-panel.drag {
  position: fixed;
  background: #202225;
  border-radius: 8px;
  bottom: 50px;
}

.ui-sip-panel .dial-info span {
  display: block;
  font-size: 13px;
}

.ui-sip-panel .dial-info i {
  font-size: 10px;
  margin-right: 5px;
}

.dial-icons .dial-icon i {
  font-size: 18px;
  color: #FFF;
  border-width: 3px;
}

.dial-icons .dial-icon.yes {
  background: #2DD256;
}

.dial-icons .dial-icon.no {
  background: #FE4635;
  transform: rotate(135deg);
}

.dial-icons .dial-icon {
  cursor: pointer;
  height: 30px;
  width: 30px;
  display: inline-block;
  border-radius: 40px;
  background: #DADADA;
  text-align: center;
  padding-top: 6px;
  transition: all 0.4s;
}

.dial-time {
  text-align: right;
  width: 100%;
  display: inline-block;
  font-size: 12px;
  margin-bottom: 15px;
}

.skill {
  margin-bottom: 15px;
}

.dial-warning {
  height: 5px;
  border-radius: 12px;
  background: #2DD256 !important;
  width: 100%;
  margin-top: 15px;
  opacity: 0.2;
  transition: .2s;
}

.dial-warning.success {
  background: #2DD256 !important;
  transition: 0.8s;
  opacity: 0.7;
}

.dial-warning.end {
  background: #FE4635 !important;
  transition: 0.8s;
  opacity: 0.7;
}

.dial-warning.wait {
  background: var(--primary-color) !important;
  transition: 0.8s;
  opacity: 0.2;
}

.dial-warning.success.active {

}

.dial-warning.active {
  opacity: 1;
}

.phone {
  font-size: 12px !important;
}

.session-actions i {
  font-size: 20px;
  cursor: pointer;
}
</style>