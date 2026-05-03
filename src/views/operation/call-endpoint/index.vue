<template>
  <app-module>
    <app-module-header>
      <template slot="action">
        <button  v-if="$api.has('call_endpoint_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('menu.modules.call_endpoint_create.title') }} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </template>
    </app-module-header>
    <app-module-body>
      <app-table :archivable="true" :selectable="true" endpoint="operation/call-endpoints" :actions="actions" vector="data" primary="name">
        <template slot-scope="item">
          <el-table-column label="Başlık">
            <template slot-scope="scope">
              <router-link :to="$route.path + '/' + scope.row.id">{{ scope.row.name }}</router-link>
              <small class="sub-item text-muted">
                <span>{{ scope.row.url }}</span>
                <span> - {{ scope.row.http_method }}</span>
                <span> - {{ scope.row.poll_interval }} dk</span>
              </small>
            </template>
          </el-table-column>
          <el-table-column
              width="100px"
              align="right"
              label="Durum">
            <template slot-scope="scope">
              <span class="badge badge-default badge-xs" v-if="!scope.row.is_active">Pasif</span>
              <span v-else-if="scope.row.status === 'working'" class="badge badge-primary badge-xs">Çalışıyor</span>
              <span v-else-if="scope.row.status === 'wait'" class="badge badge-light badge-xs">Beklemede</span>
              <span v-else-if="scope.row.status === 'completed'" class="badge badge-success badge-xs">Tamamlandı</span>
              <span v-else-if="scope.row.status === 'failed'" class="badge badge-danger badge-xs">Hata</span>
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              width="125px"
              label="Oluşturma Tarihi">
            <template slot-scope="scope">
              <small class="text-muted"><app-date-text :text="scope.row.created_at"></app-date-text></small>
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
      actions: {
        active: {
          method: 'put',
          endpoint: '/:id',
          parameters: {
            is_active: false,
          },
          name: 'Pasifleştir',
          confirmTitle: 'Endpoint\'i pasifleştirmek istiyor musunuz?',
          confirmText: 'Pasifleştirilen endpoint\'in devam eden aramaları varsa durdurulur ve tekrar aktifleştirilene kadar veri çekilmez.',
          description: '',
          icon: 'el-icon-video-pause',
        },
        passive: {
          method: 'put',
          endpoint: '/:id',
          parameters: {
            is_active: true,
          },
          name: 'Aktifleştir',
          confirmTitle: 'Endpoint\'i aktifleştirmek istiyor musunuz?',
          confirmText: 'Endpoint tekrar aktif olacak ve belirlenen aralıklarla veri çekilmeye devam edecek.',
          description: '',
          icon: 'el-icon-video-play',
        },
      }
    }
  },
}
</script>
