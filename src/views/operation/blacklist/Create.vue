<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button @click="$router.back()" class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> Geri
        </button>
        <button @click="save" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('action.save') }} <i class="el-icon-loading ml-2" v-if="loading"></i> <i v-else
            class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-warning></app-warning>
        <div class="app-module-frame">
          <div class="app-module-main">
            <app-card title="Karaliste">
              <app-form-row label="Numara">
                <el-input autocomplete="false" auto-complete="false" v-model="form.number" prefix-icon="el-icon-phone" size="medium"></el-input>
              </app-form-row>
              <app-form-row label="Çağrı Yönü" description="Müşterinin hangi yöndeki aramalar için karalisteye alınacağını belirtir.">
                <el-radio-group v-model="form.direction" size="medium">
                  <el-radio label="all" border>Tüm Aramalar</el-radio>
                  <el-radio label="in" border>Gelen Aramalar</el-radio>
                  <el-radio label="out" border>Giden Aramalar</el-radio>
                </el-radio-group>
              </app-form-row>
              <app-form-row label="Yorum" description="Müşterinin neden karalisteye alınması gerektiğini detaylı olarak belirtin.">
                <el-input type="textarea" v-model="form.comment" size="medium"></el-input>
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
        direction: 'all',
        comment: '',
      },
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('operation/blacklist/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form = response.data.data
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
      this.$api.post('operation/blacklist', this.form, (response) => {
        this.$router.push('/operation/blacklist/' + response.data.data.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
    update() {
      this.loading = true;
      this.$api.put('operation/blacklist/' + this.form.id, this.form, (response) => {
        this.$router.push('/operation/blacklist/' + this.$route.params.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
  },
}
</script>