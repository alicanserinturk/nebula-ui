<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button v-if="$api.has('result_code_edit') && !form.is_system" @click="$router.push($route.path + '/edit')" class="btn btn-sm btn-rounded btn-light i-con-h-a">
          Düzenle <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-warning></app-warning>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card>
            <div slot="header">
              <h5 class="mb-0">
                {{ form.name }}
                <span v-if="form.is_active === true" class="badge badge-pill ml-1 badge-primary">Aktif</span>
                <span v-else class="badge badge-pill ml-1 badge-light">Pasif</span>
              </h5>
               <small><app-date-text :text="form.created_at"></app-date-text> oluşturuldu.</small>
            </div>
            <app-label label="Durum Türü">
              <span class="badge badge-pill badge-light" v-if="form.is_success === null">Diğer</span>
              <span class="badge badge-pill badge-success text-white" v-else-if="form.is_success === true">Başarılı</span>
              <span class="badge badge-pill badge-warning text-white " v-else-if="form.is_success === false">Başarısız</span>
            </app-label>
            <app-label label="Açıklama">{{form.description}}</app-label>
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
      form: {
        name:'',
        description:'',
        is_system: false,
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    API.get('operation/result-codes/' + to.params.id, {}, (response) => {
      next(wm => {
        wm.form = response.data.data
      });
    })
  },
  created() {

  },
  methods: {},
}
</script>