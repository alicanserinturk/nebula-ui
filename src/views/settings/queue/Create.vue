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
            <app-form-row label="Arama Grubu Dağıtma Stratejisi" description="Dağıtma stratejisi, arama grubundaki çağrıların kullanıcılara hangi öncelikle bağlanacağını temsil eder.">
              <el-select v-model="form.strategy">
                <el-option value="random" label="Rastgele bağla"></el-option>
                <el-option value="fewestcalls" label="Hatta en az çağrı alan kullanıcıya bağla"></el-option>
                <el-option value="leastrecent" label="Hatta en uzun süredir bekleyen kullanıcıya bağla">
                  <span class="float-left">Hatta müsait durumda en uzun süredir bekleyen kullanıcıya bağla</span>
                  <span class="float-right"><small class="text-muted">Önerilen</small></span>
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