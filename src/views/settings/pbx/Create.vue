<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button @click="$router.back()" class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> {{ $t('action.back') }}
        </button>
        <button @click="save" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('action.save') }} <i class="el-icon-loading ml-2" v-if="loading"></i> <i v-else class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-warning></app-warning>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card title="Santral Bilgileri">
            <app-form-row label="Santral Adı" description="Dilediğiniz bir santral adı belirleyebilirsiniz.">
              <el-input v-model="form.name" prefix-icon="el-icon-service" size="medium"></el-input>
            </app-form-row>
            <app-form-row label="Sunucu Adresi">
              <el-input v-model="form.host" prefix-icon="el-icon-coin" size="medium"></el-input>
            </app-form-row>
            <app-form-row label="Kullanıcı Adı">
              <el-input v-model="form.username" prefix-icon="el-icon-user" size="medium"></el-input>
            </app-form-row>
            <app-form-row label="Şifre">
              <el-input type="password" show-password v-model="form.secret" prefix-icon="el-icon-lock" size="medium"></el-input>
            </app-form-row>
            <!--<app-form-row label="Numaralar" description="Santrale bağlı birden fazla numara tanımlayabilirsiniz.">
              <div class="row row-sm mb-3" v-for="(item,key) in form.numbers">
                <div class="col-md">
                  <el-input placeholder="Numara" prefix-icon="el-icon-phone-outline" v-model="item.number"
                            size="medium"></el-input>
                </div>
                <div class="col-md">
                  <el-input placeholder="Açıklama" prefix-icon="el-icon-chat-line-square" v-model="item.description"
                            size="medium"></el-input>
                </div>
                <div class="col-md-auto" @click="removeNumber(key)">
                  <el-button size="medium"><i class="el-icon-delete"></i></el-button>
                </div>
              </div>
              <el-button size="mini" @click="addNumber"><i class="el-icon-plus"></i> Numara Ekle</el-button>
            </app-form-row>-->
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
      loading: false,
      form: {
        name: '',
        username: '',
        secret: '',
        host: '',
        sippy_host: 'https://voip.elitelekom.com/xmlapi/xmlapi',
        sippy_account: '',
        sippy_username: '',
        sippy_password: '',
        numbers: [
          {number: '', description: ''},
        ],
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('settings/pbx/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form = response.data.data
        });
      })
    } else {
      next()
    }
  },
  created() {

  },
  methods: {
    addNumber() {
      this.form.numbers.push(
          {number: '', description: ''},
      );
    },
    removeNumber(key) {
      this.form.numbers.splice(key, 1);
    },
    setNumber() {
      let number = parseInt(this.form.username);
      let att = false;
      let add = false;
      if (this.form.numbers.length > 1)
        return;
      if (this.form.numbers.length === 0) {
        this.addNumber();
      }
      if (number.toString().length === 10) {
        att = "0" + number.toString();
        add = true;
      } else if (number.toString().length === 11) {
        if (this.form.numbers.length > 0) {
          if (this.form.numbers[this.form.numbers.length - 1].number === number.toString().substr(0, 10)) {
            att = number;
            add = true;
          } else {
            add = false;
          }
        }
      }
      if (att && add) {
        if (this.form.numbers[this.form.numbers.length - 1].number === '' && this.form.numbers[this.form.numbers.length - 1].description === '') {
          this.form.numbers[this.form.numbers.length - 1].number = att;
        } else {
          //this.form.numbers.push({number: att, description: ''})
        }
      }
    },
    save() {
      if (this.$route.params.id) {
        this.update();
      } else {
        this.store();
      }
    },
    store() {
      this.loading = true;
      this.$api.post('settings/pbx', this.form, (response) => {
        this.$router.push('/settings/pbx/' + response.data.data.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
    update() {
      this.loading = true;
      this.$api.put('settings/pbx/' + this.form.id, this.form, (response) => {
        this.$router.push('/settings/pbx/' + this.$route.params.id)
        this.loading = false;
      }, () => {
        this.loading = false;
      })
    },
  },
}
</script>