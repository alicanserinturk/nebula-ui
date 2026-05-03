<template>
  <ul class="mb-0">
    <li class="nav-header d-flex nav-fold pl-4 pr-3 pb-0">
      <span class="pt-1 text-muted hidden-folded text-xs" v-if="currentUser.settings.favorites.length > 0">{{
          $t('menu.my_favorites')
        }}</span>
      <span class="flex hidden-folded"></span>
      <el-popover
          placement="bottom"
          width="300"
          v-model="successPopoverVisible"
          trigger="manual">
        <div class="i-con-h-a p-2 active">
          <i class="el-icon-star-off mr-1"></i> Bu sayfayı favorilerinize eklediniz.
        </div>
        <div class="text-right mt-1">
          <el-popover
              placement="right"
              width="350"
              v-model="formPopoverVisible"
              trigger="manual">
            <div class="p-2 pt-0">
              <template v-if="formPopoverVisible">
                <app-form-row label="Bağlantı Türü">
                  <el-radio-group v-model="form.type" size="small">
                    <el-radio v-model="form" label="internal" border>Dahili Bağlantı</el-radio>
                    <el-radio label="external" border>Harici Bağlantı</el-radio>
                  </el-radio-group>
                </app-form-row>
                <app-form-row label="Bağlatı">
                  <el-input v-if="form.type === 'internal'" size="small" v-model="form.url"></el-input>
                  <el-input v-else size="small" v-model="form.url" @change="setName(0)">
                    <template slot="suffix">
                      <img class="el-input__image" :src="getFavicon(form.url)" alt="">
                    </template>
                  </el-input>
                </app-form-row>
                <app-form-row label="Başlık">
                  <el-input v-model="form.title" size="small"></el-input>
                </app-form-row>
                <app-form-row v-if="form.type === 'internal'" label="Icon">
                  <app-form-icon-input v-model="form.icon"></app-form-icon-input>
                </app-form-row>
                <app-form-row v-if="form.type === 'internal'" label="Yeni Sekmede Aç">
                  <el-switch size="small"></el-switch>
                </app-form-row>
              </template>
            </div>
            <div class="text-right mt-1">
              <el-button type="text" size="mini" class="mr-1" @click="formPopoverVisible = false">Vazgeç
              </el-button>
              <el-button type="primary" size="mini" @click="saveCustomizeFavorite">Kaydet</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini" class="mr-2" @click="customizeFavorite">
              Özelleştir
            </el-button>
          </el-popover>
          <el-button type="primary" size="mini" @click="successPopoverVisible = false">Tamam</el-button>
        </div>
        <span v-if="!is_favorite" class="text-md pointer i-con-h-a" slot="reference" @click="addFavorite">
                    <el-tooltip effect="dark" content="Bu Sayfayı Favorilerime Ekle" placement="top">
                        <i class="el-icon-star-off"></i>
                    </el-tooltip>
                </span>
                </span>
        <span v-else class="text-md pointer i-con-h-a active-favorite" slot="reference" @click="removeFavorite">
                    <el-tooltip effect="dark" content="Bu Sayfayı Favorilerimden Çıkar" placement="top">
                        <i class="el-icon-star-on "></i>
                    </el-tooltip>
                </span>
      </el-popover>
    </li>
    <li class="open pb-2">
      <div class="px-2" data-nav>
      <ul class="nav">
        <li v-for="favorite in currentUser.settings.favorites" class="">
          <router-link v-if="favorite.type === 'internal'" :to="favorite.url" class="px-2 to-hover" :target="{'_target': favorite.blank}">
            <span class="nav-icon"><ion-icon style="font-size:14px" :name="favorite.icon"></ion-icon> </span>
            <span class="nav-text"><small style="font-size:14px">{{ favorite.title }}</small></span>
           <!-- <span class="nav-icon pointer to-show"><small><i class="el-icon-delete"></i></small></span>-->
          </router-link>
          <a class="to-hover" v-else :href="favorite.url" target="_blank">
            <span class="nav-icon"><img style="width: 14px; height: 14px;" :src="getFavicon(favorite.url)" alt=""></span>
            <span class="nav-text">{{ favorite.title }}</span>
            <!--<span class="nav-icon pointer to-show">
              <el-popconfirm
                  title="Are you sure to delete this?"
              >
                <small slot="reference"><i class="el-icon-delete"></i></small>
</el-popconfirm>

            </span>-->
          </a>
        </li>
      </ul>
      </div>
    </li>
  </ul>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      is_favorite: false,
      successPopoverVisible: false,
      formPopoverVisible: false,
      form: {
        type: 'internal',
        title: '',
        url: '',
        blank: false,
        icon: '',
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  watch: {
    '$route': function (value) {
      this.checkFavorite();
    }
  },
  created() {
    this.checkFavorite();
  },
  methods: {
    ...mapActions(['updateCurrentUser']),
    getFavicon(url) {
      return 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + url;
    },
    setName(key) {
      if (this.ifValidURL(this.form.url)) {
        this.form.name = this.getUrlBaseName(this.form.url);
      } else {
        this.form.name = 'Özel Bağlantı';
      }
    },
    getUrlBaseName(str) {
      let core = str.split('//');
      let base = '';
      if (typeof core[1] !== 'undefined') {
        base = core[1].split('/');
        if (typeof base[1] !== 'undefined' > 0) {
          base = base[0];
        } else {
          base = core[1];
        }
      }
      base = base.split('.');
      base = base[1];
      return base;
    },
    ifValidURL(str) {
      let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      return !!pattern.test(str);
    },
    checkFavorite() {
      let check = false;
      this.currentUser.settings.favorites.forEach((item) => {
        if (item.url === this.$route.fullPath) check = true;
      })
      this.is_favorite = check;
    },
    removeFavorite() {
      let favoriteKey = null;
      this.currentUser.settings.favorites.forEach((item, key) => {
        if (item.url === this.$route.fullPath) favoriteKey = key;
      })
      if (favoriteKey !== null) this.currentUser.settings.favorites.splice(favoriteKey, 1)
      this.checkFavorite();
      this.successPopoverVisible = false;
      this.updateCurrentUser();
    },
    addFavorite() {
      let favorite = {
        type: 'internal',
        title: this.$t('menu.modules.' + this.$route.meta.key + '.title'),
        url: this.$route.fullPath,
        blank: false,
        icon: this.$route.meta.icon,
      };
      this.currentUser.settings.favorites.unshift(favorite);
      this.successPopoverVisible = true;
      this.checkFavorite();
      this.updateCurrentUser();
    },
    customizeFavorite() {
      this.form = this.currentUser.settings.favorites[0];
      this.formPopoverVisible = true;
    },
    saveCustomizeFavorite() {
      if (this.form.type !== 'internal') {
        if (!this.form.url.startsWith("http://") && !this.form.url.startsWith("https://")) {
          this.form.url = 'http://' + this.form.url;
        }
      }
      this.currentUser.settings.favorites[0] = this.form;
      this.formPopoverVisible = false;
      this.successPopoverVisible = false;
      this.checkFavorite();
      this.updateCurrentUser();
    },
  }
}
</script>
<style>
.to-show {
  display: hidden;
}

.to-hover:hover .to-show {
  display: flex !important;
}

.active-favorite i {
  color: var(--primary-color);
  font-size: 18px !important;
}

.el-radio-group {
  display: flex;
}

.el-input__image {
  height: 16px;
  width: 16px;
  margin-top: 8px;
  margin-right: 5px;
}

.el-radio-group label {
  flex: 1;
  margin: 0;
}
</style>