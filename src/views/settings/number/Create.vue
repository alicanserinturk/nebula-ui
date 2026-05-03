<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button @click="$router.back()" class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> Geri
        </button>
        <button @click="save" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('action.save') }} <i class="el-icon-loading ml-2" v-if="loading"></i>
          <i v-else class="i-con i-con-arrow-right float-right ml-2"><i></i></i></button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-warning></app-warning>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card title="Numara Bilgileri">
            <app-form-row label="Numara">
              <el-input v-model="form.number" prefix-icon="el-icon-phone-outline" size="medium"></el-input>
            </app-form-row>
            <app-form-row label="Numara Tanımı" description="Numaraları adlandırarak sistem içinde daha kolay tanınmalarını sağlayabilirsiniz.">
              <el-input v-model="form.name" prefix-icon="el-icon-phone-outline" size="medium"></el-input>
            </app-form-row>
            <app-form-row label="Santral">
              <app-form-pbx-select v-model="form.pbx.id"></app-form-pbx-select>
            </app-form-row>
            <app-form-row label="Gelen Arama Planı" description="Numaraya gelen aramaların hangi arama planıyla karşılanacağını belirtin.">
              <app-form-dial-plan-select key="dial_plan_select_for_create_number" v-model="form.dialplan.id"></app-form-dial-plan-select>
            </app-form-row>
            <app-form-row label="Giden Arama Yetkili Kullanıcılar" description="Bu numaradan giden arama yapabilecek kullanıcıları belirleyin.">
              <app-form-user-select key="user_select_for_create_number" v-model="form.users" :multiple="true"></app-form-user-select>
            </app-form-row>
            <app-form-row label="Açıklama">
              <el-input v-model="form.description" type="textarea" size="medium"></el-input>
            </app-form-row>
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
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      loading: false,
      form: {
        number: '',
        name: '',
        dialplan:{
          id: null
        },
        pbx:{
          id:null
        },
        users: [],
        description: '',
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('settings/numbers/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form = response.data.data;
        });
      })
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  created() {
    this.form.pbx.id = this.$route.query.pbx_id ? parseInt(this.$route.query.pbx_id) : null;
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
      this.$api.post('settings/numbers', this.form, (response) => {
        if (this.$route.query.back) {
          this.$router.back();
        } else {
          this.$router.push('/settings/number/' + response.data.data.id)
        }
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
    update() {
      this.loading = true;
      this.$api.put('settings/numbers/' + this.form.id, this.form, (response) => {
        if (this.$route.query.back) {
          this.$router.back();
        } else {
          this.$router.push('/settings/number/' + this.$route.params.id);
        }
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
  },
}
</script>