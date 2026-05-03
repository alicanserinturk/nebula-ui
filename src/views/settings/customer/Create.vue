<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button @click="$router.back()" class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> {{ $t('action.back') }}
        </button>
        <button @click="save" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('action.save') }} <i class="el-icon-loading ml-2" v-if="loading"></i>
          <i v-else class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-information :errors="errors"></app-information>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card :title="$t('view.customer.customer_detail')">
            <app-form-row :label="$t('view.customer.field_name')">
              <el-input v-model="form.name" prefix-icon="el-icon-office-building" size="medium"></el-input>
            </app-form-row>
            <app-form-row :label="$t('view.customer.field_responsible_name')" :description="$t('view.customer.field_responsible_name_description')">
              <el-input v-model="form.responsible_name" prefix-icon="el-icon-user" size="medium"></el-input>
            </app-form-row>
            <app-form-row :label="$t('view.customer.field_email')">
              <el-input v-model="form.email" prefix-icon="el-icon-message" size="medium"></el-input>
            </app-form-row>
            <app-form-row v-if="!$route.params.id" label="Sunucu" description="Bu müşterinin SIP trafiğini yönetecek sunucuyu seçin.">
              <el-select v-model="form.server_id" filterable size="medium" style="width:100%" placeholder="Sunucu seçin">
                <el-option
                  v-for="server in servers"
                  :key="server.id"
                  :label="server.name + ' (' + server.public_ip + ')'"
                  :value="server.id"
                ></el-option>
              </el-select>
            </app-form-row>
          </app-card>

          <app-card title="Faturalama">
            <app-form-row label="Faturalama Dönemi">
              <el-select v-model="form.billing_period" size="medium" style="width:100%">
                <el-option label="Aylık" value="monthly"></el-option>
                <el-option label="Yıllık" value="annual"></el-option>
              </el-select>
            </app-form-row>
            <app-form-row label="Dakika Limiti" description="Aylık toplam konuşma dakikası kotası. Boş bırakılırsa limitsiz.">
              <el-input v-model.number="form.minute_limit" type="number" :min="0" size="medium" placeholder="Limitsiz"></el-input>
            </app-form-row>
            <app-form-row label="Kayıt Saklama Süresi (Gün)" description="Ses kayıtlarının sistemde saklanacağı gün sayısı.">
              <el-input v-model.number="form.recording_retention_days" type="number" :min="1" size="medium"></el-input>
            </app-form-row>
          </app-card>

          <app-card title="Özellikler">
            <app-form-row label="Giden Çağrı">
              <el-switch v-model="form.outbound_enabled"></el-switch>
            </app-form-row>
            <app-form-row label="Kayıt">
              <el-switch v-model="form.recording_enabled"></el-switch>
            </app-form-row>
            <app-form-row label="API Erişimi">
              <el-switch v-model="form.api_access_enabled"></el-switch>
            </app-form-row>
          </app-card>
        </div>
      </div>
    </app-module-body>
  </app-module>
</template>
<style></style>
<script>
import API from "../../../utils/API";
import EventBus from "../../../utils/EventBus";

export default {
  data() {
    return {
      errors: [],
      loading: false,
      servers: [],
      form: {
        name: '',
        responsible_name: '',
        email: '',
        server_id: null,
        billing_period: 'monthly',
        minute_limit: null,
        recording_retention_days: 90,
        outbound_enabled: true,
        recording_enabled: true,
        api_access_enabled: false,
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('settings/customers/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form = response.data.data
        });
      })
    } else {
      next()
    }
  },
  created() {
    if (!this.$route.params.id) {
      this.$api.get('settings/servers', {}, (response) => {
        this.servers = response.data.data
      })
    }
  },
  methods: {
    save() {
      if (this.$route.params.id) {
        this.update();
      } else {
        this.store();
      }
    },
    store() {
      this.loading = true;
      this.$api.post('settings/customers', this.form, (response) => {
        EventBus.$emit('addCustomer');
        this.$router.push('/settings/customer/' + response.data.data.id)
        this.errors = []
        this.loading = false;
      }, (status, errors) => {
        this.errors = errors
        this.loading = false;
      });
    },
    update() {
      this.loading = true;
      this.$api.put('settings/customers/' + this.form.id, this.form, (response) => {
        this.$router.push('/settings/customer/' + this.$route.params.id)
        this.errors = []
        this.loading = false;
      }, (status, errors) => {
        this.errors = errors
        this.loading = false;
      })
    },
  },
}
</script>
