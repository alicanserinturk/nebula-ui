<template>
  <app-module>
    <app-module-header>
      <template slot="action">
        <button v-if="$api.has('number_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('menu.modules.number_create.title') }} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </template>
    </app-module-header>
    <app-module-body>
      <!--<div class="alert alert-light border">
        Numara oluşturmadan önce "Arama Planı" ve "Kuyruk" tanımlamalarınızı yapmanız gerekir.
      </div>-->
      <app-table :selectable="true" :downloadable="true" endpoint="settings/numbers" :options="options" text="Numara oluşturmadan önce birkaç adımı gözden geçirelim." vector="number"  primary="name">
        <template slot-scope="item">
          <el-table-column
              label="Başlık">
            <template slot-scope="scope">
              <router-link :to="$route.path + '/' + scope.row.id"><span>{{ scope.row.number }}</span></router-link>
              <span class="sub-item">
                 <span class="sub-item"><span v-if="scope.row.name">{{scope.row.name}} &#183; </span><app-date-text :text="scope.row.created_at"></app-date-text> önce oluşturuldu</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              label="Yetkili Kullanıcılar">
            <template slot-scope="scope">
              <template v-if="scope.row.users.length > 0">
                <app-avatar :items="scope.row.users"></app-avatar>
              </template>
              <span v-else class="badge badge-white badge-sm mr-2">Yetkili kullanıcı Yok</span>
            </template>
          </el-table-column>
        </template>
        <!--<template slot="action">
          <div class="bg-white text-dark r-2x px-4 mb-3 py-3 border shadow pointer">
            <i class="el-icon-service mr-1"></i> Arama Grubu Oluştur <i class="el-icon-right float-right mt-1"></i>
          </div>
          <div class="bg-white text-dark r-2x px-4 mb-3 py-3 border shadow pointer">
            <i class="el-icon-service mr-1"></i> Arama Planı Oluştur <i class="el-icon-right float-right mt-1"></i>
          </div>
        </template>-->
      </app-table>
    </app-module-body>
    <router-view></router-view>
  </app-module>
</template>
<script>
export default {
  data() {
    return {
      options: {}
    }
  },
  created() {

  },
  methods: {
    handleSelect() {

    }
  }
}
</script>