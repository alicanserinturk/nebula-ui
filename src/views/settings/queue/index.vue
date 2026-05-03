<template>
  <app-module>
    <app-module-header>
      <template slot="action">
        <button v-if="$api.has('queue_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('menu.modules.queue_create.title') }} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </template>
    </app-module-header>
    <app-module-body>
      <app-table :selectable="true" endpoint="settings/queues" :options="options" @select="handleSelect" vector="queues"  primary="name">
        <template slot-scope="item">
          <el-table-column
              label="Arama Grubu">
            <template slot-scope="scope">
              <router-link :to="$route.path + '/' + scope.row.id"><span>{{ scope.row.name }}</span></router-link>
              <span class="sub-item text-muted">
                <span v-if="scope.row.strategy === 'random'">Rastgele bağla</span>
              <span v-else-if="scope.row.strategy === 'fewestcalls'">Hatta en az çağrı alan kullanıcıya bağla</span>
              <span v-else-if="scope.row.strategy === 'leastrecent'">Hatta en uzun süredir bekleyen kullanıcıya bağla</span>
                 &#183; <app-date-text :text="scope.row.created_at"></app-date-text> önce oluşturuldu</span>
              </span>
              
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              width="120px"
              label="Nefes Süresi">
            <template slot-scope="scope">
              {{ scope.row.wrap_up_time }} saniye
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              width="120px"
              label="Zaman Aşımı">
            <template slot-scope="scope">
              {{ scope.row.timeout }} saniye
            </template>
          </el-table-column>
        </template>
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