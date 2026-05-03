<template>
  <div class="pt-0">
    <el-dialog @close="reconnectModalVisible = false" :append-to-body="true" title="Aktif Bir Oturmunuz Var" :visible.sync="reconnectModalVisible">
      <div class="row">
        <div class="col-md-5"><img src="/assets/img/vectors/sip-settings.svg" alt=""></div>
        <div class="col-md-7 pt-4">
          <p>
            Bilgisayarınızda çalışan aktif sip istemcisi bulunamadı. Sip istemcinizin ayarlarını kontrol edip tekrar
            bağlanmayı
            deneyebilirsiniz.
          </p>
          <app-label icon="el-icon-phone-outline" label="Sip Sunucusu">{{ currentUser.server.uri }}</app-label>
          <app-label icon="el-icon-phone-outline" label="Sip Kullanıcısı">{{ currentUser.sip }}</app-label>
          <app-label icon="el-icon-lock" label="Sip Şifresi">{{ currentUser.sip_password }}</app-label>
        </div>
      </div>
      <div slot="footer" style="margin-top:-20px;">
        <el-button type="primary" size="small" @click="reconnect()">Aktif Oturumu Sonlandır ve Tekrar Bağlan</el-button>
      </div>
    </el-dialog>
    <app-crm :visible.sync="crm.visible" :id="crm.id" @save="handleSaveCrm"></app-crm>
    <div class="ui-sip-panel b-t" :class="{'drag':dialerDrag}" ref="draggableContainer" id="draggable-container">
      <div ref="test" class="row row-xs">
        <div v-if="sip.active" class="col-md dial-info">
          <el-dropdown placement="top" size="small" @command="handleChangeState">
            <span class="skill pointer text-muted">
              <small v-if="!activeState.id">Pasif Durum <i class="text-muted el-icon-arrow-down"></i></small>
              <small v-else>{{ activeState.name }} <i class="text-muted el-icon-arrow-down"></i></small>
            </span>
            <el-dropdown-menu v-if="!sip.calling" slot="dropdown">
              <el-dropdown-item :command="state.id" :disabled="activeState.id === state.id"
                  v-for="state in details.states" :key="state.id">
                {{ state.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-else slot="dropdown">
              <div class="text-center p-3 pt-0">
                <div class="">
                  Konuşma sırasında durum<br> değiştiremezsiniz.
                </div>
                <div class="mt-2">
                  <el-button type="danger" size="mini" @click="sipNoAction">
                    <i class="el-icon-phone mr-1" style="transform: rotate(135deg)"></i>
                    Görüşmeyi Sonlandır
                  </el-button>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
          <template v-if="sip.calling || sip.ringing || sip.connectedCall">
            <span class="name">Yeni Müşteri</span>
            <span class="phone">+90**********</span>
          </template>
        </div>
        <div v-if="sip.active" class="col-md-auto dial-action">
          <div class="dial-time">
            <span v-if="sip.connectedCall">{{ sip.time }}</span>
            <el-tooltip :open-delay="1000" v-if="dialerDrag" class="item" effect="dark" content="Sabitle"
                placement="top">
              <span class="i-con-h-a pointer ml-1" @click="resetDrag"><i class="el-icon-coordinate"></i></span>
            </el-tooltip>
            <el-tooltip :open-delay="1000" class="item" effect="dark" content="Sürükle" :disabled="dialerDrag"
                placement="top">
              <span class="i-con-h-a pointer ml-1" style="cursor:move;" id="draggable-header"
                  @mousedown="dragMouseDown"><i class="el-icon-rank"></i></span>
            </el-tooltip>
          </div>
          <div class="dial-icons text-right" v-if="sip.connectedCall || sip.ringing">
            <div class="dial-icon pointer no" v-if="sip.connectedCall || sip.ringing" @click="sipNoAction">
              <el-tooltip :open-delay="1000" class="item" effect="dark" content="Sonlandır" placement="top">
                <i class="el-icon-phone"></i>
              </el-tooltip>
            </div>
            <div class="dial-icon pointer yes ml-2" v-if="sip.ringing && sip.direction === 'incoming'"
                @click="sipYesAction">
              <el-tooltip :open-delay="1000" class="item" effect="dark" content="Cevapla" placement="top">
                <i class="el-icon-phone"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div v-if="sip.active && activeState.id === 2 && !sip.connectedCall && !sip.ringing"
          class="dialer-form b-b b-t px-3 mb-3 py-2"
          style="width: calc(100% + 30px); margin-left:-15px;">
        <el-input size="mini" @keyup.enter="call(outbound.number)" v-model="outbound.number" placeholder="Numara Girin"
            class="input-with-select">
          <span slot="suffix" style="margin-right: -10px !important" class="pointer text-primary pr-0 mr-0" @click="call(outbound.number)">
            <el-dropdown placement="top" size="small" @command="handleChangeNumber">
            <small>Ara</small><i class="el-icon-phone-outline el-input__icon"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="number.id" :disabled="activeNumber.id === number.id" v-for="number in details.numbers" :key="number.id">
                {{ number.number }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          </span>
        </el-input>
      </div>
      <div v-if="sip.calling" class="pt-2 text-right session-actions">
                 <span class="float-left">
                   <span>
                        <el-tooltip :open-delay="1000" class="item" effect="dark" content="Crm" placement="top">
                            <i @click="showCrm" class="el-icon-user"></i> <small>Görüşme Detayları</small>
                        </el-tooltip>
                    </span>
                </span>
        <span class="d-inline-block active">
                    <el-tooltip :open-delay="1000" v-if="!sip.onHold" class="item" effect="dark" content="Beklemeye Al"
                        placement="top">
                        <i @click="sipHoldCall" class="el-icon-video-pause"></i>
                    </el-tooltip>
                     <el-tooltip :open-delay="1000" v-else class="item" effect="dark" content="Beklemeden Çıkar"
                         placement="top">
                        <i @click="sipUnHoldCall" class="el-icon-video-play"></i>
                    </el-tooltip>
                </span>
        <span class="d-inline-block active ml-1">
                    <el-tooltip :open-delay="1000" v-if="!sip.isMuted" class="item" effect="dark"
                        content="Mikrofonu Sustur" placement="top">
                        <i @click="sipMuteCall" class="el-icon-microphone"></i>
                    </el-tooltip>
                     <el-tooltip :open-delay="1000" v-else class="item" effect="dark" content="Mikrofonu Aktif Et"
                         placement="top">
                        <i @click="sipUnMuteCall" class="el-icon-turn-off-microphone"></i>
                    </el-tooltip>
                </span>
      </div>
      <template v-if="!sip.active">
        <button :disabled="loading || sipLock.active || !socketId" class="btn btn-sm btn-rounded btn-white i-con-h-a d-block col-12" @click="connect">
          <template v-if="sipLock.active">
            Başka Sekmede Aktif <i class="i-con i-con-lock float-right"></i>
          </template>
          <template v-else>
            Hatta Gir <i class="i-con i-con-radio i-con-border float-right"><i class="i-con"></i></i>
          </template>
        </button>
        <small v-if="sipLock.active" class="text-muted d-block text-center mt-1">
          SIP bu hesap için başka bir sekmede zaten açık.
        </small>
      </template>
      <template v-if="sip.active && !sip.ringing && !sip.calling && !sip.connectedCall">
        <div class="mb-2 i-con-h-a">
          <button :disabled="loading" class="col-md-12 btn btn-sm btn-rounded btn-white" @click="disconnect()">
            Hattan Çık <i class="i-con i-con-radio i-con-border float-right"><i class="i-con"></i></i>
          </button>
        </div>
      </template>
      <div v-if="sip.active"
          :class="{'active':dialWarningVisible,'success': sip.connectedCall, 'wait': !sip.connectedCall && !sip.ringing}"
          class="dial-warning"></div>
      <div v-if="loading" class="text-muted mt-2">
        <i class="el-icon-loading"></i> <small>{{ loadingText }} ...</small>
      </div>
    </div>
  </div>
</template>
<script>

import JsSIP from 'jssip';
import EventBus from "../../utils/EventBus";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      reconnectModalVisible: false,
      isLogout: false,
      outbound: {
        number: ''
      },
      loading: false,
      loadingText: '',
      showPassword: false,
      crm: {
        status: true,
        visible: false,
        form: {},
        id: 1,
      },
      sip: {
        skills: [
          '02323120020',
        ],
        activeSkill: '02323120020',
        calling: false,
        ringing: false,
        connectedCall: false,
        active: false,
        isMuted: false,
        onHold: false,
        time: '00:00',
        direction: false,
      },
      details: {},
      activeState: {},
      activeNumber: {},
      audio: {
        incomingCallAudio: null,
        remoteCallAudio: null,
        holdOnAudio: null,
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
      socket: false,
      phone: false,
      session: false,
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'sipLock', 'socketId']),
  },
  created() {
    this.startDialWarning();
    this.audio.incomingCallAudio = new window.Audio('/assets/sound/calling.mp3')
    this.audio.holdOnAudio = new window.Audio('/assets/sound/hold-on.mp3')
    this.audio.remoteCallAudio = new window.Audio()
    this.audio.incomingCallAudio.loop = true;
    this.audio.holdOnAudio.loop = true;
    this.audio.remoteCallAudio.autoplay = true;

    EventBus.$on('sipCall', () => {
      this.call('05416693399');
    })

    EventBus.$on('logout', () => {
      this.isLogout = true;
      if (this.sip.active) {
        this.disconnect();
      } else {
        EventBus.$emit('sipDisconnected', false);
      }
    })
  },
  beforeDestroy() {
    EventBus.$off('sipCall');
    EventBus.$off('logout');
  },
  methods: {
    reconnect() {
      this.reconnectModalVisible = false;
      this.setLoading(true, 'Atkif oturum sonlandırılıyor')
      // Try Connect
      this.$api.get('soft-phone/exit-line', {}, (response) => {
        // Set Variables
        this.setLoading();
        // Connect Sip
        this.connectSip();
      });
    },
    handleChangeState(id) {
      this.$api.patch('soft-phone/change-state/' + id, {}, () => {
        this.activeState = this.details.states.find((item) => {
          return item.id === id;
        });
      })
    },
    handleChangeNumber(id) {
      this.$api.patch('soft-phone/outbound-number/' + id, {}, () => {
        this.activeNumber = this.details.numbers.find((item) => {
          return item.id === id;
        });
      })
    },
    connect() {
      // Başka sekmede SIP aktifse bu tab'den girmeye izin verme.
      if (this.sipLock.active) {
        return;
      }
      // Socket bağlantısı henüz kurulmamışsa enter-line isteği gönderilemez —
      // back-end SIP sahipliği için socket_id bekliyor.
      if (!this.socketId) {
        this.$message.warning('Bağlantı kuruluyor, lütfen birkaç saniye bekleyin.');
        return;
      }

      this.setLoading(true, 'Hatta giriliyor')
      // Try Connect
      this.$api.patch('soft-phone/enter-line', {
        socket_id: this.socketId,
        // TODO: state_id buradan gönderilecek — state seçim UI'si eklenince.
      }, (response) => {
        // Set Variables
        this.details = response.data.data;
        // Connect Sip
        this.connectSip();
      }, (statusCode, errors) => {
        this.setLoading(false);
        if (statusCode === 409 && errors && errors.key === 'sip_host_taken') {
          // Başka sekme hattı tuttu — kilidi aktifleştir, kullanıcıyı uyar.
          this.$store.commit('setSipLock', { active: true, lockedBy: null });
        } else if (statusCode === 409) {
          // Eski "aktif oturum var" akışı.
          this.reconnectModalVisible = true;
        }
      });
    },
    disconnect(soft = false) {
      this.setLoading(true, 'Sonlandırılıyor');
      this.$api.get('soft-phone/exit-line', {}, (response) => {
        if (!soft) {
          this.disconnectSip();
        } else {
          this.setLoading();
        }
      }, (response) => {
        if (!soft) {
          this.disconnectSip();
        } else {
          this.setLoading();
        }
      })
    },
    showCrm() {
      this.crm.visible = true;
    },
    handleSaveCrm() {
      this.crm = {
        status: false,
        visible: false,
        form: {},
        id: false,
      };
    },
    beforeunloadListener(event) {
      event.returnValue = 'Çağrı hattından çıkarılacaksınız ve devam eden çağrılarınız sonlanacak, devam etmek istiyor musunuz?';
      this.disconnect();
    },
    disconnectSip() {
      console.log('disconnectSip');
      if (this.sip.active) {
        this.phone.stop();
      }
    },
    reset() {
      console.log('reset');
      // Set Variables
      this.sip.calling = false;
      this.sip.ringing = false;
      this.sip.connectedCall = false;
      this.sip.isMuted = false;
      this.sip.onHold = false;
      this.sip.time = '00:00';
      this.sip.direction = false;
      this.setLoading(false);
    },
    setLoading(loading, loadingText = '') {
      this.loading = loading;
      this.loadingText = loadingText;
    },
    connectSip() {
      this.setLoading(true, 'Bağlantı kontrol ediliyor');
      // Set Self For This
      let self = this;
      // JsSIP.debug.enable('JsSIP:*'); wss://pbx1.nebulavpbx.com:8089/ws
      this.socket = new JsSIP.WebSocketInterface('wss://' + this.currentUser.server.uri + ':8089/ws');
      this.socket.via_transport = "udp";
      // Configuration

      let configuration = {
        sockets: [this.socket],
        uri: 'sip:' + this.currentUser.sip + '@' + this.currentUser.server.uri + ':5060',
        password: this.currentUser.sip_password,
        mediaConstraints: {'audio': true, 'video': false},
        pcConfig:
            {
              iceServers:
                  [
                    {urls: ['stun:stun.l.google.com:19302']}
                  ]
            }
      };
      console.log(configuration);
      // Start Phone
      this.phone = new JsSIP.UA(configuration);
      this.phone.start();
      // Set Events
      this.phone.on('connected', function (e) {
        console.log('Connected Sip');
      });
      this.phone.on('disconnected', function (e) {
        console.log('disconnected');
        self.sip.active = false;
        self.reset();
        window.removeEventListener('beforeunload', this.beforeunloadListener);
        if (self.isLogout) {
          EventBus.$emit('sipDisconnected', true);
        }
      });
      this.phone.on('registrationFailed', function (e) {
        console.log('registrationFailed');
        self.setLoading(false);
        self.reset();
      });
      this.phone.on('registered', function (e) {
        console.log('registered');
        // Set Confirm
        window.addEventListener('beforeunload', self.beforeunloadListener);
        self.sip.active = true;
        self.setLoading(false);
      });
      this.phone.on('unregistered', function (e) {
        console.log('unregistered');
        self.setLoading(true, 'Çıkış yapılıyor');
      });
      this.phone.on('newRTCSession', function (e) {
        console.log('newRTCSession', e);
        self.session = e.session;

        self.sip.ringing = true;
        self.session = e.session;
        self.sip.connectedCall = true;

        self.session.on('peerconnection', (data) => {
          console.log('peerconnection');
          self.sip.direction = 'outgoing'
          self.session.connection.addEventListener('addstream', (e) => {
            self.sip.calling = true;
            self.sip.ringing = false;
            self.sip.connectedCall = true;
            self.audio.remoteCallAudio.srcObject = e.stream;
            self.audio.remoteCallAudio.play();
          });
        })

        if (self.session.direction === 'incoming') {
          self.audio.incomingCallAudio.play();
          self.sip.direction = 'incoming'
        } else {
          self.sip.direction = 'outgoing'
          self.session.connection.addEventListener('addstream', (e) => {
            self.sip.calling = true;
            self.sip.ringing = false;
            self.sip.connectedCall = true;
            self.audio.remoteCallAudio.srcObject = e.stream;
            self.audio.remoteCallAudio.play();
          });
        }
        /*
        * Events
        * */
        /**/
        self.session.on('failed', (e) => {
          self.sip.connectedCall = false;
          self.sip.calling = false;
          self.sip.ringing = false;
        })
        self.session.on('connecting', (e) => {
          console.log('connecting', e);
          self.audio.incomingCallAudio.pause();
        })
        self.session.on('ended', (e) => {
          console.log('ended', e);
          self.sip.connectedCall = false;
          self.sip.calling = false;
          self.sip.ringing = false;
        })
        self.session.on('progress', (e) => {
          console.log('progress');
        })
      });
    },
    sipYesAction() {
      this.session.answer({
        mediaConstraints: {'audio': true, 'video': false},
        pcConfig: {
          iceServers:
              [
                {urls: ['stun:stun.l.google.com:19302']}
              ]
        }
      });
      this.showCrm();
    },
    sipNoAction() {
      this.sipTerminateCall();
    },
    sipSkillChange(command) {
      this.sip.activeSkill = command;
    },
    sipTerminateCall() {
      // Terminate Session
      if (!this.session.isEnded()) {
        this.session.terminate();
      }
      // Stop Audios
      this.audio.incomingCallAudio.pause();
      this.audio.holdOnAudio.pause();
      // Set Variables
      this.sip.connectedCall = false;
      this.sip.calling = false;
      this.sip.ringing = false;
    },
    sipHoldCall() {
      this.session.hold();
      //this.audio.holdOnAudio.play();
      // Set Variables
      this.sip.onHold = true;
    },
    sipUnHoldCall() {
      this.session.unhold();
      this.audio.holdOnAudio.pause();
      // Set Variables
      this.sip.onHold = false;
    },
    sipMuteCall() {
      this.session.mute();
      // Set Variables
      this.sip.isMuted = true;
    },
    sipUnMuteCall() {
      this.session.unmute();
      // Set Variables
      this.sip.isMuted = false;
    },
    call(number) {
      this.phone.call(number, {
        mediaConstraints: {'audio': true, 'video': false},
        pcConfig: {
          iceServers:
              [
                {urls: ['stun:stun.l.google.com:19302']}
              ]
        }
      });
    },
    calculateTime() {
      let today = new Date();
      let Christmas = new Date("2012-12-25");
      let diffMs = (Christmas - today);
      this.sip.time = Math.round(((diffMs % 86400000) % 3600000) / 60000);
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

.dialer-form .el-dropdown {
  width: 47px;
}
</style>