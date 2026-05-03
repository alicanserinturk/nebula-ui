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
          <app-card title="Numara Bilgileri">
            <app-form-row :label="$t('view.announcement.field_title')">
              <el-input v-model="form.title" prefix-icon="el-icon-tickets" size="medium"></el-input>
            </app-form-row>
            <app-form-row :label="$t('view.announcement.field_description')">
              <app-form-editor-input v-model="form.description"></app-form-editor-input>
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
        is_global: 0,
        is_pinned: 0,
        expiration_date: ''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('settings/announcements/' + to.params.id, {}, (response) => {
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
      this.$api.post('settings/announcements', this.form, (response) => {
        this.$router.push('/settings/announcement/' + response.data.data.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
    update() {
      this.loading = true;
      this.$api.put('settings/announcements/' + this.form.id, this.form, (response) => {
        this.$router.push('/settings/announcement/' + this.$route.params.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
  },
}
</script>