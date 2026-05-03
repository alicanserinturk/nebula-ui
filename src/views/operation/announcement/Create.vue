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
            <app-card :title="$t('view.announcement.announcement_detail')">
              <app-form-row :label="$t('view.announcement.field_title')">
                <el-input autocomplete="false"
                    auto-complete="false" v-model="form.title" prefix-icon="el-icon-tickets" size="medium"></el-input>
              </app-form-row>
              <app-form-row :label="$t('view.announcement.field_description')">
                <app-form-editor-input v-model="form.description"></app-form-editor-input>
              </app-form-row>
            </app-card>
          </div>
          <div class="app-module-sidebar">
            <app-card :title="$t('view.announcement.visibility')">
              <app-form-row label="Geçerlilik Tarihi Belirle">
                <el-radio-group v-model="form['expirations']" size="medium">
                  <el-radio :label="false" border>Süresiz</el-radio>
                  <el-radio :label="true" border>Tarih Belirle</el-radio>
                </el-radio-group>
              </app-form-row>
              <app-form-row v-show="form.expirations" :label="$t('view.announcement.field_expiration_date')">
                <el-date-picker
                    id="fake"
                    :pickerOptions="pickerOptions"
                    name="fake"
                    v-model="form.expiration_date"
                    type="datetime"
                    size="medium"
                    :placeholder="$t('view.announcement.field_expiration_date_placeholder')">
                </el-date-picker>
              </app-form-row>
              <app-form-row v-if="$api.has('announcement_create',true)" :label="$t('view.announcement.field_is_global')">
                <el-switch v-model="form.is_global"></el-switch>
              </app-form-row>
              <app-form-row :label="$t('view.announcement.field_is_pinned')">
                <el-switch v-model="form.is_pinned"></el-switch>
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
        title: '',
        description: '',
        is_global: false,
        is_pinned: false,
        expiration_date: null,
        expirations:false,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('operation/announcements/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form =  {
            ...response.data.data,
            expirations:  response.data.data === null,
          }
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
      this.$api.post('operation/announcements', this.form, (response) => {
        this.$router.push('/operation/announcement/' + response.data.data.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
    update() {
      this.loading = true;
      this.$api.put('operation/announcements/' + this.form.id, this.form, (response) => {
        this.$router.push('/operation/announcement/' + this.$route.params.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
  },
}
</script>