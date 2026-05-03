<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <app-log owner-type="customers" :owner-id="form.id" :labels="['name','responsible_name','email']"></app-log>
        <button v-if="$api.has('customer_edit')" @click="$router.push($route.path + '/edit')" class="btn btn-sm ml-2 btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-edit float-right ml-2"><i></i></i> {{ $t('action.edit') }}
        </button>
        <button
          v-if="$api.has('customer_create')"
          @click="$router.push('/settings/customer/create')"
          class="btn btn-sm btn-rounded btn-primary ml-2 i-con-h-a"
        >
          {{ $t("menu.modules.customer_create.title") }}
          <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-warning></app-warning>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card>
            <div slot="header">
              <h5 class="mb-0 font-weight-500">{{ form.name }}</h5>
              <small class="text-muted"><app-date-text :text="form.created_at"></app-date-text> önce oluşturuldu</small>
            </div>
            <app-label icon="el-icon-message" label="E-posta Adresi">{{ form.email }}</app-label>
            <app-label icon="el-icon-user" label="Yetkili Kişi">{{ form.responsible_name }}</app-label>
          </app-card>

          <app-card title="Faturalama">
            <app-label icon="el-icon-date" label="Faturalama Dönemi">
              {{ form.billing_period === 'monthly' ? 'Aylık' : 'Yıllık' }}
            </app-label>
            <app-label icon="el-icon-phone" label="Dakika Limiti">
              {{ form.minute_limit !== null ? form.minute_limit + ' dk' : 'Limitsiz' }}
            </app-label>
            <app-label icon="el-icon-time" label="Kayıt Saklama Süresi">
              {{ form.recording_retention_days !== null ? form.recording_retention_days + ' gün' : '-' }}
            </app-label>
          </app-card>

          <app-card title="Özellikler">
            <app-label icon="el-icon-phone-outline" label="Giden Çağrı">
              <el-tag :type="form.outbound_enabled ? 'success' : 'danger'" size="mini">
                {{ form.outbound_enabled ? 'Açık' : 'Kapalı' }}
              </el-tag>
            </app-label>
            <app-label icon="el-icon-microphone" label="Kayıt">
              <el-tag :type="form.recording_enabled ? 'success' : 'danger'" size="mini">
                {{ form.recording_enabled ? 'Açık' : 'Kapalı' }}
              </el-tag>
            </app-label>
            <app-label icon="el-icon-connection" label="API Erişimi">
              <el-tag :type="form.api_access_enabled ? 'success' : 'danger'" size="mini">
                {{ form.api_access_enabled ? 'Açık' : 'Kapalı' }}
              </el-tag>
            </app-label>
          </app-card>
        </div>
      </div>
    </app-module-body>
  </app-module>
</template>
<style></style>
<script>
import API from "../../../utils/API";

export default {
  data() {
    return {
      form: {},
    }
  },
  beforeRouteEnter(to, from, next) {
    API.get('settings/customers/' + to.params.id, {}, (response) => {
      next(wm => {
        wm.form = response.data.data
      });
    })
  },
}
</script>
