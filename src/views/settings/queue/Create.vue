<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button @click="$router.back()" class="mr-2 btn btn-sm btn-rounded btn-light i-con-h-a">
          <i class="i-con i-con-arrow-left float-left mr-2"><i></i></i> {{ $t('action.back') }}
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
          <app-card title="Arama Grubu Bilgileri">
            <app-form-row label="Arama Grubu Adı">
              <el-input v-model="form.name" prefix-icon="el-icon-position" size="medium"></el-input>
            </app-form-row>
            <app-form-row label="Nefes Alma Süresi" description="Nefes alma süresi, kullanıcıların çağrı sona erdikten sonra, yeni çağrı için kaç saniye bekleyeceğini temsil eder.">
              <el-input v-model="form.wrap_up_time" prefix-icon="el-icon-video-pause">
                <span class="el-input__icon mr-2" slot="suffix">Saniye</span>
              </el-input>
            </app-form-row>
            <app-form-row label="Zaman Aşımı" description="Kullanının çağrıyı cevaplayamadığı durumlarda, müşterinin ne zaman tekrar kuyruğa yönlendirileceğini temsil eder.">
              <el-input v-model="form.timeout" prefix-icon="el-icon-refresh-right">
                <span class="el-input__icon mr-2" slot="suffix">Saniye</span>
              </el-input>
            </app-form-row>
            <app-form-row label="Arama Grubu Dağıtma Stratejisi" description="Gelen çağrının kuyruktaki kullanıcılara nasıl dağıtılacağını belirler.">
              <el-select v-model="form.strategy" popper-class="strategy-select-popper" class="strategy-select">
                <el-option
                  v-for="opt in strategyOptions"
                  :key="opt.value"
                  :value="opt.value"
                  :label="opt.title"
                >
                  <div class="strategy-option">
                    <div class="strategy-option__head">
                      <span class="strategy-option__title">{{ opt.title }}</span>
                      <small v-if="opt.recommended" class="strategy-option__badge">Önerilen</small>
                    </div>
                    <small class="strategy-option__desc">{{ opt.description }}</small>
                  </div>
                </el-option>
              </el-select>
            </app-form-row>
            <app-form-row label="SLA Eşiği" description="Çağrıların kaç saniye içinde cevaplanması gerektiğini belirler. Bu süre içinde cevaplanan çağrılar SLA'ya uygun sayılır. Örneğin 20 saniye girilirse, 20 saniye içinde cevaplanan çağrılar başarılı kabul edilir.">
              <el-input v-model="form.service_level" prefix-icon="el-icon-timer">
                <span class="el-input__icon mr-2" slot="suffix">Saniye</span>
              </el-input>
            </app-form-row>
          </app-card>
        </div>
      </div>
    </app-module-body>
    <!--<app-form-row label="Numara" description="Santrale bağlı bir numara seçin.">
        <el-cascader
                size="medium"
                filterable
                v-model="form.number_id"
                :options="pbxs">
            <template slot-scope="{ node, data }">
                <span>{{ data.label }} <small v-if="data.description !== ''"> - {{ data.description }}</small></span>
            </template>
        </el-cascader>
    </app-form-row>-->
  </app-module>
</template>
<style>
.strategy-select-popper .el-select-dropdown__item {
  height: auto;
  line-height: 1.4;
  padding: 10px 20px;
}
.strategy-option__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.strategy-option__title {
  font-weight: 500;
  color: #1f2d3d;
}
.strategy-option__desc {
  display: block;
  color: #909399;
  font-size: 12px;
  margin-top: 2px;
  white-space: normal;
}
.strategy-option__badge {
  background: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
  border-radius: 10px;
  padding: 1px 8px;
  font-size: 11px;
  line-height: 1.4;
}
.el-select-dropdown__item.selected .strategy-option__title {
  color: #409eff;
}
</style>
<script>
import API from "../../../utils/API";

export default {
  data() {
    return {
      loading: false,
      form: {
        name: '',
        timeout: 30,
        strategy: 'leastrecent',
        wrap_up_time: 10,
        service_level: 20,
      },
      pbxs: [],
      strategyOptions: [
        {
          value: 'leastrecent',
          title: 'En uzun süredir çağrı almamış kullanıcıya bağla',
          description: 'Üyeler arasında en adil yük dağıtımı — çoğu durumda en iyi seçim.',
          recommended: true,
        },
        {
          value: 'rrmemory',
          title: 'Sırayla dağıt, kaldığı yerden devam et',
          description: 'Her gelen çağrı sıradaki bir sonraki kullanıcıya gider (klasik round-robin).',
        },
        {
          value: 'fewestcalls',
          title: 'Bugün en az çağrı almış kullanıcıya bağla',
          description: 'Gün içindeki toplam çağrı sayısını kullanıcılar arasında dengelemek için.',
        },
        {
          value: 'ringall',
          title: 'Tüm kullanıcıları aynı anda çaldır',
          description: 'Telefon herkeste birden çalar, ilk cevaplayan alır. Küçük ekipler için uygun.',
        },
        {
          value: 'linear',
          title: 'Listedeki sıraya göre dene',
          description: 'Her çağrı en üstteki kullanıcıdan başlar, cevap yoksa alttakine düşer. Sıra kuyruk detay sayfasından düzenlenir.',
        },
        {
          value: 'random',
          title: 'Rastgele bir kullanıcıya bağla',
          description: 'Yük dağılımının nasıl olduğu önemli değilse uygundur.',
        },
      ],
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.id) {
      API.get('settings/queues/' + to.params.id, {}, (response) => {
        next(wm => {
          wm.form = response.data
          delete wm.form.users;
        });
      })
    } else {
      next()
    }
  },
  created() {

  },
  methods: {
    /*getPbxs() {
      this.$api.get('settings/pbx', {}, (response) => {
        let data = [];
        response.data.data.forEach(pbx => {
          let children = [];
          pbx.numbers.forEach(item => {
            children.push(
                {value: item.id, label: item.number, description: item.description},
            );
          })
          data.push({
            value: pbx.id,
            label: pbx.name,
            description: '',
            children: children
          });
        })
        this.pbxs = data;
      })
    },*/
    save() {
      if (this.$route.params.id) {
        this.update();
      } else {
        this.store();
      }
    },
    store() {
      this.$api.post('settings/queues', this.form, (response) => {
        this.$router.push('/settings/queue/' + response.data.data.id)
      }, () => {
        this.loading = false;
      })
    },
    update() {
      this.$api.put('settings/queues/' + this.form.id, this.form, (response) => {
        this.$router.push('/settings/queue/' + this.$route.params.id)
      }, () => {
        this.loading = false;
      })
    },
  },
}
</script>