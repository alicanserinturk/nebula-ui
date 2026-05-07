<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button  @click="$router.back()" class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> Geri
        </button>
        <button @click="save" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('action.save') }} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-warning></app-warning>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card title="Data">
            <app-form-row label="Arama Liste Adı">
              <el-input prefix-icon="el-icon-tickets" v-model="form.name"></el-input>
            </app-form-row>
            <app-form-row label="Arama Yapılacak Numara">
              <app-form-number-select v-model="form.number.id"></app-form-number-select>
            </app-form-row>
            <app-form-row label="Aranma Türü" description='"Tıklayarak Arama", görevler listesinden arama yapmayı gerektirir. "Otomatik Arama" seçildiği taktirde liste otomatik aranır ve temsilciye aktarılır.'>
              <el-radio-group v-model="form.call_type" size="medium" @change="onCallTypeChange">
                <el-radio label="auto" border>Otomatik Arama</el-radio>
                <el-radio label="click" border>Tıklayarak Arama</el-radio>
              </el-radio-group>
            </app-form-row>
          </app-card>
          <app-card v-if="form.call_type === 'auto'" title="Otomatik Arama">
            <app-form-row label="Arama Grubu" description="Otomatik olarak başlatılan çağrıların hangi kuyruğa yönlendirileceğini belirleyin.">
              <app-form-queue-select v-model="form.queue.id"></app-form-queue-select>
            </app-form-row>
            <app-form-row label="Arama Önceliği" description="Önceliği yüksek olan arama listeleri düşük ve normal öncelikli listelerden daha öncelikli olarak başlatılacaktır.">
              <el-select v-model="form.priority">
                <el-option value="low" label="Düşük">Düşük</el-option>
                <el-option value="normal" label="Normal">Normal</el-option>
                <el-option value="high" label="Yüksek">Yüksek</el-option>
              </el-select>
            </app-form-row>
            <app-form-row v-if="$api.has('call_list_create',true) || $api.has('call_list_edit',true)" label="Çağrı Yoğunluğu" description="Kuyruğa dahil her müsait temsilci için fazladan kaç çağrı başlatılacağını yüzdesel olarak belirleyebilirsiniz. Böylece temsilci performansını en üst düzeye çıkarırken, arama grubunda bekleyen müşteri sayısınıysa arttırmış olacaksınız.">
              <div class="p-5 r-2x bg-light-lt border">
                <div class="px-3">
                  <el-slider v-model="form.manual_throttle" :marks="marks" :min="0" :max="100" :step="10"></el-slider>
                </div>
              </div>
            </app-form-row>
          </app-card>
        </div>
        <div class="app-module-sidebar">
          <app-card title="Planlama">
            <app-form-row label="Planlanan Tarih" description="Arama seçilen tarih itibariyle başlatılacaktır.">
              <el-date-picker
                  v-model="form.starts_at"
                  type="datetime">
              </el-date-picker>
            </app-form-row>
            <app-form-row label="Arama Günleri" description="Aramanın hangi günler yapılacağını temsil eder.">
              <el-select v-model="form.allowed_weekdays" multiple :reserve-keyword="true">
                <el-option :value="1" label="Pazartesi">Pazartesi</el-option>
                <el-option :value="2" label="Salı">Salı</el-option>
                <el-option :value="3" label="Çarşamba">Çarşamba</el-option>
                <el-option :value="4" label="Perşembe">Perşembe</el-option>
                <el-option :value="5" label="Cuma">Cuma</el-option>
                <el-option :value="6" label="Cumartesi">Cumartesi</el-option>
                <el-option :value="7" label="Pazar">Pazar</el-option>
              </el-select>
            </app-form-row>
            <template v-if="form.call_type === 'auto'">
              <el-divider><small>Cevapsız Aramalar</small></el-divider>
              <app-form-row label="Arama Tekrarı" description="Ulaşılamayan numaraların kaç gün daha aranacağını temsil eder.">
                <el-input v-model="form.retry_days" prefix-icon="el-icon-refresh">
                  <span class="el-input__icon mr-2" slot="suffix">Gün</span>
                </el-input>
              </app-form-row>
              <app-form-row label="Aynı Gün Arama Tekrarı" description="Ulaşılamayan numaraların aynı gün kaç kez tekrar aranacağını temsil eder.">
                <el-input v-model="form.retry_per_day" prefix-icon="el-icon-refresh">
                  <span class="el-input__icon mr-2" slot="suffix">Sefer</span>
                </el-input>
              </app-form-row>
            </template>
          </app-card>
        </div>
      </div>
    </app-module-body>
  </app-module>
</template>
<style>

</style>
<script>
import API from "../../../utils/API";

export default {
  data() {
    return {
      form: {
        name: '',
        starts_at: '',
        priority: 'low',
        manual_throttle: 0,
        is_active: true,
        queue: {
          id: null
        },
        number: {
          id: null
        },
        call_type: 'auto',
        allowed_weekdays: [],
        retry_per_day: 2,
        retry_days: 3,
        file: null,
      },
      originalCallType: null,
      marks: {
        0: 'Yoğun Değil',
        20: 'Yoğun',
        50: 'Çok Yoğun',
        100: 'Riskli'
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('operation/calling-lists/' + to.params.id, {}, (response) => {
        next(wm => {
          const data = response.data.data;
          wm.form = {
            ...data,
            allowed_weekdays: data.allowed_weekdays || [],
            queue: data.queue || { id: null },
            number: data.number || { id: null },
            manual_throttle: data.manual_throttle ?? 0,
          };
          wm.originalCallType = data.call_type;
        });
      })
    } else {
      next()
    }
  },
  methods: {
    onCallTypeChange(value) {
      if (this.originalCallType && value !== this.originalCallType) {
        this.$message.warning('Liste oluşturulduktan sonra arama türü değiştirilemez.');
        this.$nextTick(() => {
          this.form.call_type = this.originalCallType;
        });
      }
    },
    save() {
      if (this.$route.params.id) {
        this.update();
      } else {
        this.store();
      }
    },
    buildPayload() {
      const data = { ...this.form };
      data.manual_throttle = data.manual_throttle === 0 ? null : data.manual_throttle;
      return data;
    },
    store() {
      this.$api.post('operation/calling-lists', this.buildPayload(), (response) => {
        this.$router.push('/operation/call-list/' + response.data.data.id)
      })
    },
    update() {
      this.$api.put('operation/calling-lists/' + this.form.id, this.buildPayload(), (response) => {
        this.$router.push('/operation/call-list/' + this.$route.params.id)
      })
    },
  },
}
</script>
<style>
.el-slider__marks-text{
  font-size:12px;
}
</style>
