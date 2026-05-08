<template>
  <div class="row no-gutters h-100">
    <div class="col-md-6 bg-white" style="height: 100vh; overflow-y: auto">
      <div class="float-right home-form">
        <div v-if="warning && (!cache && !robot)">
          <div class="alert bg-white b-b-warning px-0 b-b-2x" role="alert"><h5 class="alert-heading font-weight-bold">Uyarı</h5>
            <p class="mb-0">{{warning}}</p>
          </div>
        </div>
        <div>
          <img src="/assets/img/favicon.png" class="w-56 mb-3" alt="Nebula">
          <div style="height: 100px" v-if="!cache && !robot">
            <h3 class="font-weight-bold mb-1">Giriş Yap</h3>
            <p class="d-block mb-5">Giriş yaparak kesintisiz iletişime başla.</p>
          </div>
          <div style="height: 100px" v-else>
            <h3 class="font-weight-bold mb-1">Önce Güvenlik</h3>
            <h6 class="mb-4">Güvenliğiniz önceliğimiz, bu yüzden robotların sistem üzerinde denemeler yapmasına ve
              kişisel verilerinize erişmesine engel oluyoruz.</h6>
          </div>
          <div v-if="cache || robot">
            <div @click="cache = false" class="last-user border pointer">
              <div class="row row-sm">
                <div class="col-md-auto">
                    <span class="w-40 avatar circle bg-secondary--lt">
                      <i class="el-icon-arrow-left"></i>
                    </span>
                </div>
                <div class="col-md pt-1">
                  <h6 class="mb-0">Geri Dön</h6>
                  <small class="d-block text-muted">Giriş bilgilerinizi değiştirin</small>
                </div>
              </div>
            </div>
            <h6 class="pt-2 pb-1 font-weight-bold">Lütfen Doğrulayın</h6>
            <div v-if="!ready" class="bg-white border" style=" padding-top:20px; padding-left:12px; width: 100%; height:78px; border-radius: 3px; box-shadow:0 0 6px -3px rgba(0,0,0,0.1)">
              <SkeletonTheme :highlight="'#FFF'" :color="'#F2F2F2'">
                <div class="row row-xs">
                  <div class="col-auto">
                    <Skeleton height="30px" width="30px"></Skeleton>
                  </div>
                  <div class="col" style="padding-top:8px; padding-left:8px;">
                    <Skeleton height="16px" width="120px"></Skeleton>
                  </div>
                </div>
              </SkeletonTheme>
            </div>
            <div ref="turnstileWidget" class="mb-3"></div>
          </div>
          <div v-else @keyup.enter="setCache">
            <app-information :errors="loginErrors"></app-information>
            <div class="" v-if="lastUsers.length > 0 && newUser">
              <div @click="newUser = false" class="last-user border pointer bg-light">
                <div class="row row-sm">
                  <div class="col-md-auto">
                          <span class="w-40 avatar circle bg-secondary--lt"><i
                              class=" el-icon-user"></i></span>
                  </div>
                  <div class="col-md pt-1">
                    <h6 class="mb-0">Başka Hesap</h6>
                    <small class="d-block text-muted">ile giriş yap</small>
                  </div>
                  <div class="col-md-auto pt-2">
                    <i class="el-icon-right pointer"></i>
                  </div>
                </div>
              </div>
              <h6 class="pt-2 pb-1 font-weight-bold">Kayıtlı Hesaplar</h6>
              <div class="last-user border pointer" @click="setActiveUser(lastUser)" v-for="lastUser in lastUsers"
                  :class="{'active': activeUser.id === lastUser.id}">
                <div class="row row-sm">
                  <div class="col-md-auto">
                          <span v-if="activeUser.id === lastUser.id" class="w-40 avatar circle bg-primary-lt"><i
                              class="text-primary el-icon-success"></i></span>
                    <span v-else
                        class="w-40 avatar circle bg-secondary--lt"> {{
                        lastUser.name[0]
                      }}{{ lastUser.surname[0] }}</span>
                  </div>
                  <div class="col-md pt-1">
                    <h6 class="mb-0">{{ lastUser.name }} {{ lastUser.surname }}</h6>
                    <small class="d-block text-muted">{{ lastUser.email }}</small>
                  </div>
                  <div class="col-md-auto pt-2" @click="removeUser(lastUser.id)">
                    <ion-icon name="trash-outline"></ion-icon>
                  </div>
                </div>
              </div>
              <div class="mb-3 mt-2">
                <el-input autocomplete="login-username" name="login-username" id="login-usernamee" v-model="activeUser.email" style="display: none"></el-input>
                <el-input autocomplete="login-password" name="login-password" id="login-passwordd" v-model="form.password" placeholder="Şifrenizi Girin" type="password" show-password></el-input>
              </div>
            </div>
            <template v-else>
              <div @click="newUser = true" v-if="lastUsers.length > 0" class="last-user border pointer">
                <div class="row row-sm">
                  <div class="col-md-auto">
                          <span class="w-40 avatar circle bg-secondary--lt"><i
                              class=" el-icon-user"></i></span>
                  </div>
                  <div class="col-md pt-1">
                    <h6 class="mb-0">Kayıtlı Hesaplar</h6>
                    <small class="d-block text-muted">ile giriş yap</small>
                  </div>
                  <div class="col-md-auto pt-2">
                    <i class="el-icon-right pointer"></i>
                  </div>
                </div>
              </div>
              <div class="form-group pt-2">
                <h6 class="mb-1 pb-1 font-weight-bold">E-posta Adresi</h6>
                <el-input placeholder="E-posta adresinizi Girin" autocomplete="login-username" id="login-username" name="login-username" v-model="form.email"></el-input>
              </div>
              <div class="form-group">
                <h6 class="mb-1 pt-2 pb-1 font-weight-bold">Şifre</h6>
                <el-input placeholder="Şifrenizi girin" autocomplete="login-password" id="login-password" name="login-password" v-model="form.password" type="password" show-password></el-input>
              </div>
              <div class="mb-3">
                <el-checkbox size="small" v-model="form.remember_me">Beni Hatırla</el-checkbox>
              </div>
            </template>
            <el-button class="col-md-12" @click="setCache()" type="primary" :disabled="loading">Giriş <i
                v-if="loading" class="el-icon-loading"></i></el-button>
          </div>
        </div>
        <div class="mt-5 pb-4">
          <span class="text-muted">Tüm Hakları Saklıdır © 2021</span>
        </div>
      </div>
    </div>
    <div class="col-md-6 bg-dark" style="height: 100vh; background: #5145CD !important">
      <div class="comment-form">
        <h1 class="mb-3 font-weight-bold">Güvenli,<br>esnek ve özelleştirilebilir<br>bir deneyim.</h1>
        <p class="mb-4">Dökümantasyonu inceleyerek Nebula'nın sınırlarını keşfedebilirsiniz.</p>
        <a class="btn btn-white r-3x btn-outline-white" href="https://docs.nebulavpbx.com/" target="_blank">Dökümantasyonu İncele</a>
      </div>
    </div>
  </div>
</template>
<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import EventBus from "@/utils/EventBus";
import {Skeleton, SkeletonTheme} from 'vue-loading-skeleton';

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default {
  components: {
    Skeleton,
    SkeletonTheme
  },
  data() {
    return {
      newUser: true,
      robot: false,
      cache: false,
      ready: false,
      verifying: false,
      form: {
        email: "",
        password: "",
        remember_me: true,
        cf_turnstile_response: '',
      },
      turnstileSiteKey: process.env.VUE_APP_CF_TURNSTILE_SITE_KEY,
      turnstileWidgetId: null,
      warning: false,
      warnings: {
        'terminate': 'Sistemde yapılan çalışma sebebiyle operasyondan çıkarıldınız. Kısa bir süre sonra tekrar deneyebilirsiniz.',
        'timeout': 'Oturumunuz zaman aşımına uğradı, lütfen tekrar giriş yapın.',
        'connection-failed': 'Sunucuya bağlanırken bir hatayla karşılaşıldı, lütfen sistem yöneticinize danışın.',
      },
      lastUsers: localStorage.getItem('lastUsers') ? JSON.parse(localStorage.getItem('lastUsers')) : [],
      activeUser: {
        email: '',
        name: '',
        surname: '',
      },
    }
  },
  created() {
    if (this.$route.query.warning) {
      this.warning = decodeURIComponent(escape(window.atob(this.$route.query.warning)));
    }
    if (this.lastUsers && this.lastUsers.length > 0) {
      this.activeUser = this.lastUsers[0];
      this.form.email = this.activeUser.email;
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'loading','loginErrors']),
  },
  methods: {
    ...mapActions(['login']),
    ...mapMutations(['clearLoginErrors']),
    submit() {
      if (this.form.email !== '' && this.form.password !== '') {
        this.login(this.form);
      }
    },
    setCache() {
      if (this.form.email !== '' && this.form.password !== '') {
        const turnstileEnabled = process.env.VUE_APP_CF_TURNSTILE_ENABLED !== 'false';
        if (process.env.VUE_APP_ENV !== 'production' || !turnstileEnabled) {
          this.form.cf_turnstile_response = 'local-env';
          this.submit();
          return;
        }
        this.ready = false;
        this.clearLoginErrors();
        this.cache = true;
      }
    },
    loadTurnstileScript() {
      if (window.turnstile) {
        return Promise.resolve();
      }
      if (this._turnstileLoadPromise) {
        return this._turnstileLoadPromise;
      }
      this._turnstileLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-turnstile]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', reject);
          return;
        }
        const script = document.createElement('script');
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = '1';
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
      return this._turnstileLoadPromise;
    },
    async renderTurnstile() {
      try {
        await this.loadTurnstileScript();
        await this.$nextTick();
        if (!this.$refs.turnstileWidget || !window.turnstile) return;
        this.turnstileWidgetId = window.turnstile.render(this.$refs.turnstileWidget, {
          sitekey: this.turnstileSiteKey,
          callback: (token) => {
            this.robot = true;
            this.form.cf_turnstile_response = token;
            this.submit();
          },
          'error-callback': () => {
            this.$message.error('Cloudflare Turnstile doğrulaması başarısız.');
          },
          'expired-callback': () => {
            this.form.cf_turnstile_response = '';
          },
        });
        this.ready = true;
      } catch (e) {
        this.$message.error('Doğrulama servisi yüklenemedi.');
        this.cache = false;
      }
    },
    setActiveUser(user) {
      this.activeUser = user;
      this.form.email = user.email;
      this.form.password = '';
    },
    removeUser(id) {
      let cacheIndex = false;
      this.lastUsers.find((item, key) => {
        if (item.id === id)
          cacheIndex = key;
      })
      this.lastUsers.splice(cacheIndex, 1);
      localStorage.setItem('lastUsers', JSON.stringify(this.lastUsers));
    },
  },
  watch: {
    cache(val) {
      if (val) {
        this.renderTurnstile();
      } else {
        this.turnstileWidgetId = null;
      }
    },
    loading(val) {
      if (val) {
        this.cache = false;
      }
    },
    loginErrors(errors){
      if(errors){
        this.robot = false;
        this.cache = false;
      }
    },
    currentUser(val) {
      if (val && val.id && val.id > 0) {
        setTimeout(() => {
          this.$router.push("/");
        }, 200);
      }
    }
  }
}
</script>
<style>
.last-user.active {
  border: 2px solid var(--primary-color) !important;
  background: #FFF !important;
  box-shadow: 0 10px 30px -12px rgba(0,0,0,0.2);
}

.last-user {
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 15px;
  margin-top: 10px;
  background: #FFF !important;
  border-width: 2px !important;
}

.home-form {
  margin-top: calc(50vh - 275px);
  width: 320px;
  margin-right: 80px;
}

.home-form input{
  
}

.comment-form {
  margin-top: calc(50vh - 110px);
  width: 80%;
  margin-left: 80px;
}

.comment-form .btn-white {
  border: 2px solid #FFF;
  background: transparent !important;
  padding: 12px 20px;
  font-weight: 700;
}
</style>