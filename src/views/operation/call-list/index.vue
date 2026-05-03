<template>
  <app-module>
    <app-module-header>
      <template slot="action">
        <button  v-if="$api.has('call_list_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('menu.modules.call_list_create.title') }} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </template>
    </app-module-header>
    <app-module-body>
      <app-table :archivable="true"  :selectable="true" endpoint="operation/calling-lists" :actions="actions" vector="data" primary="name">
        <template slot-scope="item">
          <el-table-column label="Başlık">
            <template slot-scope="scope">
              <router-link :to="$route.path + '/' + scope.row.id">{{ scope.row.name }}</router-link>
              <small class="sub-item text-muted">
                <span>
                  Pzt, Sal, Çrş, Prş, Cuma
                </span>
                <span> - {{ scope.row.retry_days }} gün, günde {{ scope.row.retry_per_day }} sefer</span>
              </small>
            </template>
          </el-table-column>
          <!--<el-table-column
              width="100px"
              align="right"
              label="Durum">
            <template slot-scope="scope">
              <span class="badge badge-default badge-xs" v-if="!scope.row.is_active">Pasif</span>
              <span v-else-if="scope.row.status === 'working'" class="badge badge-primary badge-xs">Aranıyor</span>
              <span v-else-if="scope.row.status === 'loading'" class="badge badge-light badge-xs">Yükleniyor</span>
              <span v-else-if="scope.row.status === 'wait'" class="badge badge-light badge-xs">Beklemede</span>
              <span v-else-if="scope.row.status === 'completed'" class="badge badge-success badge-xs">Tamamlandı</span>
            </template>
          </el-table-column>-->
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
          confirmTitle: 'Arama listesini pasifleştirmek istiyor musunuz?',
          confirmText: 'Pasifleştirelen arama listelerinin devam eden aramaları varsa durdurulur ve tekrar aktifleştirilene kadar herhangi bir arama yapılamaz ve listeler kullanıcılar tarafından görülemez.',
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
          confirmTitle: 'Arama listesini aktifleştirmek istiyor musunuz?',
          confirmText: 'Arama listeleri tekrar görünür olacak ve arama türü otomatikse aranmaya devam edecek.',
          description: '',
          icon: 'el-icon-video-play',
        },
      }
    }
  },
  created() {

  },
  methods: {
    handleSelect() {

    },
    filterDays(days) {
      if (days === [0, 1, 2, 3, 4]) {
        return 'Hafa içi';
      } else if (days === [5, 6]) {
        return 'Hafa sonu';
      } else if (days === [0, 1, 2, 3, 4, 5, 6]) {
        return 'Her gün'
      }
    },
  },
}
</script>