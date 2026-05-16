<template>
  <app-module>
    <app-module-header>

    </app-module-header>
    <app-module-body>
      <div class="app-main">
        <app-warning></app-warning>
        <app-card>
          <div class="py-3 px-2">
            <div class="row">
              <div class="col-md-4">
                <h6>Hesap Bilgileri</h6>
                <small class="text-muted">Hesap bilgilerinizi değiştirebilirsiniz.</small>
              </div>
              <div class="col-md-8">
                <div class="row mb-4">
                  <div class="col-md-6">
                    <el-input v-model="currentUser.name" size="medium" placeholder="Ad"></el-input>
                  </div>
                  <div class="col-md-6">
                    <el-input v-model="currentUser.surname" size="medium" placeholder="Soyad"></el-input>
                  </div>
                </div>
                <el-input v-model="currentUser.email" size="medium" placeholder="E-posta Adresi"></el-input>
                <div class="mt-4">
                  <el-button type="primary" size="small" class="mr-2" @click="setProfile" :disabled="loading">
                    Bilgilerimi Güncelle <i class="el-icon-loading ml-2" v-if="loading"></i>
                  </el-button>
                  <el-button type="default" size="small" @click="passwordResetModalVisible = true">
                    <i class="el-icon-lock mr-1"></i> Şifrenizi Değiştirin
                  </el-button>
                </div>
                <el-dialog :append-to-body="true" title="Şifre Değiştir" :visible.sync="passwordResetModalVisible">
                  <app-warning></app-warning>
                  <app-form-row label="Şifreniz">
                    <el-input prefix-icon="el-icon-lock" size="medium" v-model="passwordChangeForm.password"
                              type="password" show-password></el-input>
                  </app-form-row>
                  <div class="row">
                    <div class="col-md-6">
                      <app-form-row label="Yeni Şifresiniz">
                        <app-form-password-input v-model="passwordChangeForm.new_password"></app-form-password-input>
                      </app-form-row>
                    </div>
                    <div class="col-md-6">
                      <app-form-row label="Şifrenizi Onaylayın">
                        <el-input prefix-icon="el-icon-lock" v-model="passwordChangeForm.new_password_repeat"
                                  size="medium" type="password" show-password></el-input>
                      </app-form-row>
                    </div>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="passwordResetModalVisible = false" size="small" type="text">
                      Vazgeç
                    </el-button>
                    <el-button type="primary" size="small" @click="changePassword">Değiştir</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="row">
              <div class="col-md-4">
                <h6>Tema</h6>
                <small class="text-muted">Koyu mod çalışmanıza ve odaklanmanıza yardımcı olur.</small>
              </div>
              <div class="col-md-8">
                <img @click="setTheme(false)" style="border:1px solid #EAEAEA; width: 100px; margin-right: 15px;"
                     :class="{'active-theme': this.currentUser.settings['interface_dark_mode'] === false}"
                     class="r-3x pointer" src="/assets/img/interface-light.png">
                <img @click="setTheme(true)"
                     :class="{'active-theme': this.currentUser.settings['interface_dark_mode'] === true}"
                     style="border:1px solid #EAEAEA; width: 100px;" class="r-3x pointer"
                     src="/assets/img/interface-dark.png">
              </div>
            </div>
            <el-divider></el-divider>
            <div class="row">
              <div class="col-md-4">
                <h6>Boyut</h6>
                <small class="text-muted">Uygulama boyutunu ekranınıza göre ayarlayabilirsiniz.</small>
              </div>
              <div class="col-md-8">
                <el-slider @change="updateCurrentUser" v-model="currentUser.settings['interface_zoom']" :min="85" :max="115" :step="5"></el-slider>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="row">
              <div class="col-md-4">
                <h6>Dil</h6>
                <p></p>
              </div>
              <div class="col-md-8">
                <el-select size="medium" v-model="currentUser.settings['interface_language']" @change="setLang">
                  <el-option value="tr" label="Türkçe" @click="setLang('tr')">Türkçe</el-option>
                  <el-option value="en" label="English" @click="setLang('en')">English</el-option>
                </el-select>
              </div>
            </div>
          </div>
        </app-card>
      </div>
    </app-module-body>
  </app-module>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import Password from 'vue-password-strength-meter'

export default {
  components: {Password},
  data() {
    return {
      passwordResetModalVisible: false,
      passwordChangeForm: {
        password: '',
        new_password_repeat: '',
        new_password: '',
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser','loading']),
  },
  methods: {
    ...mapActions(['updateCurrentUser']),
    setProfile(){
      this.updateCurrentUser();
      this.$message.success('Bilgileriniz güncellendi.');
    },
    setTheme(dark) {
      this.currentUser.settings['interface_dark_mode'] = dark;
      this.updateCurrentUser()
      this.$message.success('Temanız değiştirildi.');
    },
    changePassword() {
      this.$api.patch('profile/change-password', this.passwordChangeForm, (response) => {
        this.passwordChangeForm.password = '';
        this.passwordChangeForm.new_password_repeat = '';
        this.passwordChangeForm.new_password = '';
        this.passwordResetModalVisible = false;
        this.$message.success('Şifreniz güncellendi.');
      });
    },
    setLang() {
      this.currentUser.settings.interface_language = this.currentUser.settings['interface_language']
      this.$i18n.locale = this.currentUser.settings['interface_language']
      this.updateCurrentUser()
      this.$message.success('Varsayılan dil değiştirildi.');
    },
  }
}
</script>
<style>
.active-theme{
  border:1px solid #409EFF !important;
}
</style>