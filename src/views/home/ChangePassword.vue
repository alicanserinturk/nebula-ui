<template>
  <div class="row no-gutters h-100">
    <div class="col-md-6 bg-white" style="height: 100vh; overflow-y: auto">
      <div class="float-right home-form">
        <div>
          <img src="/assets/img/vectors/change-password.svg" class="mb-4 w-128" alt="">
          <h3 class="font-weight-bold mb-1">Şifrenizi Güncelleyin</h3>
          <p class="mb-4">Hoş geldiniz, şu an ilk kez giriş yapıyorsunuz, güvenli bir şifre belirleyerek devam edin.
            Lütfen yeni şifrenizi oluşturun.</p>
          <app-warning></app-warning>
          <app-form-row label="Güncel Şifreniz">
            <el-input v-model="form.password" show-password placeholder="Güncel Şifreniz" type="password"></el-input>
          </app-form-row>
          <app-form-row label="Yeni Şifreniz">
            <app-form-password-input v-model="form.new_password"></app-form-password-input>
          </app-form-row>
          <app-form-row label="Yeni Şifrenizi Tekrar Edin">
            <el-input v-model="form.new_password_repeat" placeholder="Yeni Şifrenizi Tekrar Edin" type="password" show-password></el-input>
          </app-form-row>
          <div class="row px-3">
            <button class="btn btn-primary btn-full" :disabled="loading" @click="changePassword">Şifreyi Değiştir
              <i v-if="loading" class="el-icon-loading"></i></button>
          </div>
        </div>
        <div class="text-center mt-4">
          <small>Tüm Hakları Saklıdır © 2020</small>
        </div>
      </div>
    </div>
    <div class="col-md-6 bg-dark" style="height: 100vh; background: #5145CD !important; overflow-y: scroll">
      <div class="comment-form">
        <h1 class="mb-3 font-weight-bold">Neden<br>şifrenizi güncellemeniz<br>gerekiyor?</h1>
        <p class="mb-4">Hesabınız oluşturulurken sizin için bir şifre belirlendi, ancak bu şifre yeteri kadar güvenli
          olmayabilir. Yalnızca sizin bildiğiniz yeni bir şifre oluşturmanız hesabınızı güvene almamız konusunda
          yardımcı olacaktır.</p>
        <button class="btn btn-white btn-outline-white" @click="logout">Vazgeç ve Çıkış Yap
          <i class="el-icon-right ml-2"></i></button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      loading: false,
      form: {
        password: '',
        new_password_repeat: '',
        new_password: '',
      },
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'loading']),
  },
  created() {

  },
  methods: {
    ...mapActions(['updateCurrentUser']),
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    changePassword() {
      this.loading = true;
      this.$api.patch('profile/change-password', this.form, (response) => {
        this.loading = false;
        this.currentUser.password_change_required = false;
        this.updateCurrentUser();
        this.$router.push('/');
      }, () => {
        this.loading = false;
      });
    }
  }
}
</script>
<style>
.last-user.active {
  border: 1px solid #4298FF;
  background: #FFF !important;
}

.last-user {
  border: 1px solid #EAEAEA;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 10px;
  margin-top: 10px;
  background: #FFF !important;
}

.home-form {
  margin-top: calc(50vh - 275px);
  width: 320px;
  margin-right: 80px;
}

.comment-form {
  margin-top: calc(50vh - 110px);
  width: 80%;
  margin-left: 80px;
}

.comment-form .btn-white {
  border: 1px solid #FFF;
  background: transparent !important;
  padding: 12px 20px;
  font-weight: 700;
}

.btn-full.btn-primary {
  padding: 12px 20px;
  width: 100%;
}
</style>