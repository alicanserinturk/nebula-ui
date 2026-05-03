<template>
  <el-dialog v-if="!loading" custom-class="app-modal app-crm-modal" :append-to-body="true" :visible.sync="modalVisible">
    <template slot="title">
      <div class="row">
        <div class="col-md">
          <div class="d-md-flex">
            <div class="pb-2 pl-1">
              <div class="d-flex">
             <span class="avatar bg-light w-40">
                 <span class="avatar-status avatar-right" style="background: transparent; border:0;" v-if="crm.customer.is_risky">
                   <i class="text-warning el-icon-warning-outline"></i>
                 </span>
                 <i class="el-icon-user"></i>
              </span>
                <div class="mx-3">
                  <h6 class="mt-1 mb-0">
                    <span v-if="crm.customer.name === null">Yeni Müşteri</span>
                    <span v-else>{{ crm.customer.name }} {{ crm.customer.surname }}</span>
                  </h6>
                  <div class="text-muted"><small>{{ crm.customer.number }}</small></div>
                </div>
              </div>
            </div>
            <span class="flex"></span>
          </div>
        </div>
      </div>
      <div class="pt-1">
        <div class="nav-active-border b-primary bottom">
          <ul class="nav pl-0" id="myTab" role="tablist" style="margin-left:-10px">
            <li class="nav-item">
              <a class="nav-link active show" @click="activeTab = 'crm'" data-toggle="tab" role="tab" aria-controls="home" aria-selected="true">Geçmiş</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="activeTab = 'sms'" data-toggle="tab" role="tab" aria-controls="contact" aria-selected="false">SMS</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="activeTab = 'customer'" data-toggle="tab" role="tab" aria-controls="profile" aria-selected="false">Müşteri
                Bilgileri</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" @click="activeTab = 'other'" data-toggle="tab" role="tab" aria-controls="contact" aria-selected="false">Diğer</a>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <el-dialog
        width="450px"
        title="Çağrı Kalitesi"
        :visible.sync="ratingModalVisible"
        append-to-body>
      <div class="row mb-2">
        <div class="col-md-4"><img src="/assets/img/vectors/rate-call.svg"></div>
        <div class="col-md-8 pt-3">
          <small>Çağrı kalitesini değerlendirmeniz oldukça önemli. Çağrıda oluşan kesintiler veya diğer problemleri
            değerlendirerek çağrıyı sonlandırın.</small>
        </div>
      </div>
      <div class="app-crm-rating hover">
        <div class="app-crm-rate pointer" :class="{'bg-primary': form.rating === 1}" @click="form.rating = 1">
          <i class="el-icon-alarm-clock"></i>
          <span class="d-block">Çok Kötü</span>
        </div>
        <div class="app-crm-rate pointer" :class="{'bg-primary': form.rating === 2}" @click="form.rating = 2">
          <i class="el-icon-alarm-clock"></i>
          <span class="d-block">Kötü</span>
        </div>
        <div class="app-crm-rate pointer" :class="{'bg-primary': form.rating === 3}" @click="form.rating = 3">
          <i class="el-icon-alarm-clock"></i>
          <span class="d-block">Normal</span>
        </div>
        <div class="app-crm-rate pointer" :class="{'bg-primary': form.rating === 4}" @click="form.rating = 4">
          <i class="el-icon-alarm-clock"></i>
          <span class="d-block">İyi</span>
        </div>
        <div class="app-crm-rate pointer" :class="{'bg-primary': form.rating === 5}" @click="form.rating = 5">
          <i class="el-icon-alarm-clock"></i>
          <span class="d-block">Çok İyi</span>
        </div>
      </div>
      <div slot="footer">
        <el-button type="text" size="small" @click="ratingModalVisible = false">Vazgeç</el-button>
        <el-button type="primary" size="small" @click="save">Crm'i Sonlandır</el-button>
      </div>
    </el-dialog>
    <div v-if="activeTab === 'crm'" class="mb-4">
      <div class="timeline mb-4">
        <template v-for="item in history">
          <div class="tl-item active">
            <div class="tl-dot">
              <span class="w-28 avatar circle bg-light">
                <i v-if="item.direction === 'out'" class="el-icon-top-right"></i>
                <i v-else class="el-icon-bottom-left"></i>
              </span>
            </div>
            <div class="tl-date">
              <small v-if="item.direction === 'out'">Giden Arama</small>
              <small v-else>Gelen Arama</small>
              <small class="text-muted d-block">
                <app-date-text :text="item.start_at"></app-date-text>
              </small>
            </div>
            <div class="tl-content">
              <small class="text-muted">{{ item.to }}</small>
            </div>
          </div>
          <div class="tl-item active" v-if="item.comments">
            <div class="tl-dot">
            <span class="w-28 avatar circle bg-light">
              <i class="el-icon-message"></i>
            </span>
            </div>
            <div class="tl-date">
              <small>Görüş Bildirimi </small>
              <small class="text-muted d-block">
                <app-date-text :text="item.start_at"></app-date-text>
              </small>
            </div>
            <div class="tl-content">
              <small class="text-muted">{{ item.comments }}</small>
            </div>
          </div>
        </template>
        <div class="tl-item active" v-if="crm.comment !== '' && crm.comment !== null">
          <div class="tl-dot">
            <span class="w-28 avatar circle bg-light">
              <i class="el-icon-message"></i>
            </span>
          </div>
          <div class="tl-date">
            <small>Görüş Bildirimi </small>
            <small class="text-muted d-block">
              Şimdi
            </small>
          </div>
          <div class="tl-content">
            <small class="text-muted">{{
                crm.comment
              }}</small><small class="text-muted ml-2 pointer" @click="editComment"><i class="el-icon-edit-outline"></i>Düzenle</small>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'customer'" class="mb-4">
      <app-warning></app-warning>
      <app-form-row label="Adı">
        <el-input type="text" size="medium" v-model="form.name"></el-input>
      </app-form-row>
      <app-form-row label="Soyadı">
        <el-input type="text" size="medium" v-model="form.surname"></el-input>
      </app-form-row>
      <el-button type="primary" size="mini" @click="saveCustomer">Kaydet</el-button>
    </div>
    <div v-if="activeTab === 'sms'" class="mb-4">
      <div class="text-center">
        <app-svg class="col-6 mx-auto" src="/assets/img/vectors/crm-messages.svg"></app-svg>
        <small><h6>Görüşme Bulunamadı</h6></small>
        <small>Müşteriyle herhangi bir SMS geçmişi bulunmuyor.</small>
      </div>
    </div>
    <div v-if="activeTab === 'other'" class="mb-4">
      <p class="text-center">Ek CRM bilgisi bulunamadı.</p>
    </div>
    <div slot="footer" v-if="activeTab === 'crm'">
      <div class="text-center b-b py-2" style="width: calc(100% + 40px); margin-left:-20px;">
        <div class="d-inline-block">
          <el-popover
              v-model="appointmentFormVisible"
              placement="top"
              width="300">
            <template v-if="!crm.is_appointment">
              <app-form-row label="Randevu Tarihi" description="Randevu tarihini belirleyin.">
                <el-date-picker
                    v-model="form.appointment_date"
                    size="medium"
                    type="datetime"
                    default-time="12:00:00">
                </el-date-picker>
              </app-form-row>
              <div class="text-right">
                <el-button type="text" size="mini" @click="cancelAppointment">Vazgeç</el-button>
                <el-button type="primary" size="mini" @click="saveAppointment">Kaydet</el-button>
              </div>
            </template>
            <template v-else>
              <el-button type="default" size="small" class="w-100" @click="resetAppointment">
                <i class="el-icon-warning-outline"></i> Randevuyu İptal Et
              </el-button>
            </template>

            <el-button slot="reference" type="text" size="small">
              <span v-if="!crm.is_appointment"><i class="el-icon-alarm-clock"></i> Randevu Oluştur</span>
              <span class="text-muted" v-else><i class="el-icon-alarm-clock"></i> <app-date-text :text="form.appointment_date"></app-date-text>ya randevu oluşturuldu.</span>
            </el-button>
          </el-popover>
        </div>
        <div class="ml-3 d-inline-block">
          <el-popover
              v-model="riskFormVisible"
              placement="top"
              width="300">
            <template v-if="!crm.customer.is_risky">
              <app-form-row label="Risk Yorumu"
                            description="Müşterinin neden riskli olduğunu belirtin.">
                <el-input type="textarea" size="medium" v-model="form.risk_comment"></el-input>
              </app-form-row>
              <div class="text-right">
                <el-button type="text" size="mini" @click="cancelRisk">Vazgeç</el-button>
                <el-button type="primary" size="mini" @click="saveRisk">Kaydet</el-button>
              </div>
            </template>
            <template v-else>
              <el-button type="default" size="small" class="w-100" @click="resetRisk">
                <i class="el-icon-warning-outline"></i> Risk Bildirimini Geri Al
              </el-button>
            </template>

            <el-button slot="reference" type="text" size="small">
              <span v-if="!crm.customer.is_risky"><i class="el-icon-warning-outline"></i> Riskli Müşteri Bildir</span>
              <span v-else class="text-warning"><i class="el-icon-warning-outline"></i> Riskli olarak bildirildi.</span>
            </el-button>
          </el-popover>
        </div>
        <div class="ml-3 d-inline-block">
          <el-popover
              v-model="blockFormVisible"
              placement="top"
              width="300">

            <template v-if="!crm.customer.is_block">
              <app-form-row label="Engel Yorumu"
                            description="Müşterinin neden engellendiği belirtin.">
                <el-input type="textarea" size="medium" v-model="form.block_comment"></el-input>
              </app-form-row>
              <div class="text-right">
                <el-button type="text" size="mini" @click="cancelBlock">Vazgeç</el-button>
                <el-button type="primary" size="mini" @click="saveBlock">Kaydet</el-button>
              </div>
            </template>
            <template v-else>
              <el-button type="default" size="small" class="w-100" @click="resetBlock">
                <i class="el-icon-warning-outline"></i> Talebi İptal Et
              </el-button>
            </template>
            <el-button slot="reference" type="text" size="small">
              <span v-if="!crm.customer.is_block"><i class="el-icon-warning-outline"></i> Müşteriyi Engelle</span>
              <span class="text-danger" v-else><i class="el-icon-warning-outline"></i> Engel talebi oluşturuldu.</span>
            </el-button>
          </el-popover>
        </div>
      </div>
      <!--<el-button @click="cancelSave" type="text" size="small">Pencereyi Küçült</el-button>-->
      <!--<div class="text-right py-3">
        <el-button type="primary" size="small" @click="next">Kaydet</el-button>
      </div>-->
      <div class="py-3"><!--@keyup.enter.native="sendMessages"-->
        <el-input @keyup.enter="saveComment" :disabled="crm.comment !== '' && crm.comment !== null" v-model="form.comment" placeholder="Görüşmeyle ilgili görüşlerinizi bildirin..." class="input-with-select">
          <el-popover
              slot="prefix"
              popper-class="app-emoji-popper"
              placement="top"
              trigger="click">
            <VEmojiPicker :i18n="i18n" @select="selectEmoji"></VEmojiPicker>
            <i class="el-icon-cloudy-and-sunny el-input__icon pointer" slot="reference"></i>
          </el-popover>
          <span @click="saveComment" slot="suffix" class="pointer text-primary"><small> Görüş Bildir</small><i class="el-icon-top el-input__icon "></i></span>
        </el-input>
      </div>
    </div>
    <div slot="footer" v-else-if="activeTab === 'sms'">
      <div class="px-2 pt-3 pb-0 text-left">
        <small>Sms son görüşme yaptığınız 03127860055 numaralı hattan gönderilecek. </small>
        <el-popover
            trigger="click"
            placement="top"
            width="300">
          <app-form-row label="Varsayılan Numara" description="SMS'in gönderileceği numarayı son görüşme yaptığınız numara olarak belirler.">
            <el-switch></el-switch>
          </app-form-row>
          <app-form-row label="Gönderici Numara">
            <el-select value="1">
              <el-option value="1" label="03127860056">03127860056</el-option>
            </el-select>
          </app-form-row>
          <el-button slot="reference" type="text" size="small" class="ml-2">
            <span class="text-primary"><i class="el-icon-edit"></i> Numarayı Değiştir</span>
          </el-button>
        </el-popover>
      </div>
      <div class="py-3"><!--@keyup.enter.native="sendMessages"-->
        <el-input v-model="form.comment" placeholder="Mesaj yazın..." class="input-with-select">
          <span slot="suffix" class="pointer text-primary"><small> Gönder</small><i class="el-icon-position el-input__icon "></i></span>
        </el-input>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import VEmojiPicker from "v-emoji-picker";

export default {
  components: {
    VEmojiPicker
  },
  props: {
    'visible': {
      required: false,
      default: false,
    },
    'id': {
      required: false,
      default: false,
    },
  },
  data() {
    return {
      i18n: {
        search: 'Ara ...',
        categories: {
          Activity: "Sık Kullanılanlar",
          Flags: "Baylaklar",
          Foods: "Yemekler",
          Frequently: "Spor",
          Objects: "Objeler",
          Nature: "Doğa",
          Peoples: "İnsanlar",
          Symbols: "Semboller",
          Places: "Ülkeler"
        }
      },
      history: [],
      loading: false,
      riskFormVisible: false,
      appointmentFormVisible: false,
      blockFormVisible: false,
      customerFormVisible: false,
      activeTab: 'crm',
      ratingModalVisible: false,
      riskForm: {
        risk_comment: '',
      },
      appointmentForm: {
        appointment_date: '',
      },
      customerForm: {
        name: '',
        surname: '',
      },
      blockForm: {
        block_comment: '',
      },
      crm: {},
      calls: [],
      form: {
        rating: 5,
        appointment_date: '',
        comment: '',
        is_appointment: '',
        is_risky: false,
        name: null,
        risk_comment: null,
        surname: null,
        is_block: false,
        block_comment: '',
      },
      pickerOptions: {
        shortcuts: [
          {
            text: 'Bugün Saat 5\'te',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: 'Bugün Saat 6\'da',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: 'Yarın Sabah Saat 10\'da',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },
          {
            text: 'Yarın Öğleden Sonra Saat 2\'de',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }
        ]
      },
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
  },
  created() {
    console.log('created');
    this.getCrm();
  },
  methods: {
    next() {
      this.ratingModalVisible = true;
    },
    save() {
      this.$api.put('crms/' + this.id, this.form, (success) => {

        this.customerFormVisible = false;
        this.$message.success('Kaydedildi.');
      });
    },
    saveCustomer() {
      this.crm.customer.name = this.form.name;
      this.crm.customer.surname = this.form.surname;
      this.save();
    },
    saveRisk() {
      this.crm.customer.risk_comment = this.form.risk_comment;
      this.crm.customer.is_risky = true;
      this.form.is_risky = true;
      this.riskFormVisible = false;
      this.save();
    },
    resetRisk() {
      this.crm.customer.risk_comment = '';
      this.crm.customer.is_risky = false;
      this.form.risk_comment = '';
      this.form.is_risky = false;
      this.riskFormVisible = false;
      this.save();
    },
    cancelRisk() {
      this.riskFormVisible = false;
    },
    saveBlock() {
      this.crm.customer.block_comment = this.form.block_comment;
      this.crm.customer.is_block = true;
      this.form.is_block = true;
      this.blockFormVisible = false;
      this.save();
    },
    resetBlock() {
      this.crm.customer.block_comment = '';
      this.crm.customer.is_block = false;
      this.form.block_comment = '';
      this.form.is_block = false;
      this.blockFormVisible = false;
      this.save();
    },
    cancelBlock() {
      this.blockFormVisible = false;
    },
    saveAppointment() {
      this.crm.appointment_date = this.appointmentForm.appointment_date;
      this.crm.is_appointment = true;
      this.form.is_appointment = true;
      this.appointmentFormVisible = false;
      this.save();
    },
    cancelAppointment() {
      this.appointmentFormVisible = false;
    },
    resetAppointment() {
      this.crm.appointment_date = '';
      this.crm.is_appointment = false;
      this.form.appointment_date = '';
      this.form.is_appointment = false;
      this.appointmentFormVisible = false;
      this.save();
    },
    cancelSave() {
      this.ratingModalVisible = false;
    },
    saveComment() {
      console.log("Save Comment");
      this.crm.comment = this.form.comment;
      this.save();
      this.$nextTick(() => {this.scrollToBottom();})
    },
    editComment() {
      this.form.comment = this.crm.comment;
      this.crm.comment = null;
    },
    getCrm() {
      this.loading = true;
      this.$api.get('crms/' + this.id, {}, (response) => {
        this.loading = false;
        this.form.comment = response.data.comment;
        this.form.is_risky = response.data.customer.is_risky;
        this.form.risk_comment = response.data.customer.risk_comment;
        this.form.name = response.data.customer.name;
        this.form.surname = response.data.customer.surname;
        this.crm = response.data;
        this.history = response.data.history.reverse();
        this.$nextTick(() => {
          this.scrollToBottom();
        })
      });
    },
    scrollToBottom() {
      let element = document.querySelector(".app-crm-modal .el-dialog__body")
      element.scrollTo(0,element.scrollHeight);
    },
    selectEmoji(emoji) {
      this.form.comment = this.form.comment + emoji.data;
    },
  }
}
</script>
<style>
.app-crm-modal.app-modal .el-dialog__body {
  height: calc(90vh - 230px) !important;
  overflow-y:scroll;
}

.app-crm-modal.app-modal .el-dialog__footer {
  padding-top: 0;
  padding-bottom: 0;
}

.app-modal .el-radio-group {
  width: 100%;
}

.app-modal .el-radio-button {
  width: auto !important;
}

.app-crm-rating {
  width: 100%;
  display: flex;
}

.app-crm-rate {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  border-radius: 8px;
}

.app-crm-rate i {
  font-size: 24px;
  margin-bottom: 10px;
}

.app-crm-rate span {
  font-size: 12px;
}

.app-crm-modal .el-dialog__header {
  padding-bottom: 0 !important;
}
</style>