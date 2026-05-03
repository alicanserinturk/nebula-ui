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
          <app-card title="Genel">
            <app-form-row label="Endpoint Adı">
              <el-input prefix-icon="el-icon-tickets" v-model="form.name"></el-input>
            </app-form-row>
            <app-form-row label="Arama Yapılacak Numara">
              <app-form-number-select v-model="form.number.id"></app-form-number-select>
            </app-form-row>
            <app-form-row label="Aranma Türü" description='"Tıklayarak Arama", görevler listesinden arama yapmayı gerektirir. "Otomatik Arama" seçildiği taktirde liste otomatik aranır ve temsilciye aktarılır.'>
              <el-radio-group v-model="form.call_type" size="medium">
                <el-radio label="auto" border>Otomatik Arama</el-radio>
                <el-radio label="click" border>Tıklayarak Arama</el-radio>
              </el-radio-group>
            </app-form-row>
          </app-card>
          <app-card title="API Bağlantısı">
            <app-form-row label="Endpoint URL" description="Verilerin çekileceği API adresi.">
              <el-input prefix-icon="el-icon-link" v-model="form.url" placeholder="https://api.example.com/data"></el-input>
            </app-form-row>
            <app-form-row label="HTTP Metod">
              <el-radio-group v-model="form.http_method" size="medium">
                <el-radio label="GET" border>GET</el-radio>
                <el-radio label="POST" border>POST</el-radio>
              </el-radio-group>
            </app-form-row>
            <app-form-row label="Auth Token" description="API erişimi için yetkilendirme anahtarı. Boş bırakılabilir.">
              <el-input prefix-icon="el-icon-key" v-model="form.auth_token" placeholder="Bearer token veya API key" show-password></el-input>
            </app-form-row>
            <app-form-row label="Sorgulama Sıklığı" description="API'nin ne sıklıkla kontrol edileceğini belirler (dakika).">
              <el-input-number v-model="form.poll_interval" :min="10" :max="1440" :step="10"></el-input-number>
              <span class="ml-2 text-muted">dakika</span>
            </app-form-row>
            <app-form-row label="Headers" description="API isteğinde gönderilecek ek HTTP başlıkları. JSON formatında giriniz.">
              <el-input
                  type="textarea"
                  :rows="3"
                  v-model="headersRaw"
                  placeholder='{"X-Custom-Header": "value"}'
              ></el-input>
              <small v-if="headersError" class="text-danger">Geçersiz JSON formatı</small>
            </app-form-row>
            <app-form-row label="Payload / Parametreler" description="GET için query string, POST için body olarak gönderilir. JSON formatında giriniz.">
              <el-alert type="info" :closable="false" class="mb-2">
                <small>
                  <strong>Kullanılabilir değişkenler:</strong><br>
                  <code v-pre>{{last_polled_at}}</code> — Son başarılı sorgu zamanı<br>
                  <code v-pre>{{cursor}}</code> — Son alınan pozisyon değeri (ID, token vb.)<br>
                  <code v-pre>{{date_now}}</code> — Şu anki zaman
                </small>
              </el-alert>
              <el-input
                  type="textarea"
                  :rows="5"
                  v-model="payloadRaw"
                  placeholder='{"after_id": "{{cursor}}", "limit": 100}'
              ></el-input>
              <small v-if="payloadError" class="text-danger">Geçersiz JSON formatı</small>
            </app-form-row>
          </app-card>
          <app-card title="Response Mapping">
            <app-form-row label="Data Yolu" description="API yanıtındaki data dizisinin JSON yolu. Boş bırakılırsa root array kabul edilir.">
              <el-input prefix-icon="el-icon-document" v-model="form.response_data_path" placeholder="data.items"></el-input>
            </app-form-row>
            <app-form-row label="Cursor Yolu" description="API yanıtındaki son pozisyon değerinin JSON yolu. Bir sonraki istekte {{cursor}} olarak kullanılır.">
              <el-input prefix-icon="el-icon-sort" v-model="form.response_cursor_path" placeholder="pagination.next_cursor"></el-input>
            </app-form-row>
          </app-card>
          <app-card title="Otomatik Arama" v-if="form.call_type === 'auto'">
            <app-form-row label="Arama Grubu" description="Otomatik olarak başlatılan çağrıların hangi kuyruğa yönlendirileceğini belirleyin.">
              <app-form-queue-select v-model="form.queue.id"></app-form-queue-select>
            </app-form-row>
            <app-form-row label="Arama Önceliği" description="Önceliği yüksek olan endpoint'ler düşük ve normal öncelikli olanlardan daha öncelikli olarak başlatılacaktır.">
              <el-select v-model="form.priority">
                <el-option value="low" label="Düşük">Düşük</el-option>
                <el-option value="normal" label="Normal">Normal</el-option>
                <el-option value="high" label="Yüksek">Yüksek</el-option>
              </el-select>
            </app-form-row>
          </app-card>
        </div>
        <div class="app-module-sidebar">
          <app-card title="Planlama">
            <app-form-row label="Başlangıç Tarihi" description="Veri çekme seçilen tarih itibariyle başlatılacaktır.">
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
<script>
import API from "../../../utils/API";

export default {
  data() {
    return {
      headersRaw: '',
      payloadRaw: '',
      headersError: false,
      payloadError: false,
      form: {
        name: '',
        url: '',
        http_method: 'GET',
        auth_token: '',
        headers: null,
        payload: null,
        response_data_path: '',
        response_cursor_path: '',
        poll_interval: 60,
        starts_at: '',
        priority: 'normal',
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
      },
    }
  },
  watch: {
    headersRaw(val) {
      if (!val || !val.trim()) { this.form.headers = null; this.headersError = false; return; }
      try { this.form.headers = JSON.parse(val); this.headersError = false; } catch (e) { this.headersError = true; }
    },
    payloadRaw(val) {
      if (!val || !val.trim()) { this.form.payload = null; this.payloadError = false; return; }
      try { this.form.payload = JSON.parse(val); this.payloadError = false; } catch (e) { this.payloadError = true; }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('operation/call-endpoints/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form = response.data.data;
          wm.form.allowed_weekdays = wm.form.allowed_weekdays || [];
          if (!wm.form.queue) wm.form.queue = { id: null };
          if (!wm.form.number) wm.form.number = { id: null };
          wm.headersRaw = wm.form.headers ? JSON.stringify(wm.form.headers, null, 2) : '';
          wm.payloadRaw = wm.form.payload ? JSON.stringify(wm.form.payload, null, 2) : '';
        });
      })
    } else {
      next()
    }
  },
  methods: {
    save() {
      if (this.headersError || this.payloadError) {
        this.$message.error('Headers veya Payload alanında geçersiz JSON var.');
        return;
      }
      if (this.$route.params.id) {
        this.update();
      } else {
        this.store();
      }
    },
    store() {
      this.$api.post('operation/call-endpoints', this.form, (response) => {
        this.$router.push('/operation/call-endpoint/' + response.data.data.id)
      })
    },
    update() {
      this.$api.put('operation/call-endpoints/' + this.form.id, this.form, () => {
        this.$router.push('/operation/call-endpoint/' + this.$route.params.id)
      })
    },
  },
}
</script>
