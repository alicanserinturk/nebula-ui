<template>
  <app-module>
    <app-module-header>
      <template slot="action">
        <button  v-if="$api.has('blacklist_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('menu.modules.blacklist_create.title') }}
          <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </template>
    </app-module-header>
    <app-module-body>
      <app-table  :selectable="true" :actions="actions" endpoint="operation/blacklist" :filters="filters" vector="notification" primary="number">
        <template slot-scope="item">
          <el-table-column label="Numara">
            <template slot-scope="scope">
              <router-link v-if="scope.row.number !== null" :to="$route.path + '/' + scope.row.id">
                {{ scope.row.number }}
              </router-link>
              <span v-else class="text-muted">Numara Yok</span>
              <span class="sub-item"><strong>{{ scope.row.user.name }} {{ scope.row.user.surname }}</strong>, <strong><app-date-text :text="scope.row.created_at"></app-date-text></strong> engelleme talebil oluşturdu. -<span class="text-muted">{{ scope.row.comment }}</span></span>
            </template>
          </el-table-column>
          <el-table-column
              align="right"
              width="125px"
              label="Durum">
            <template slot-scope="scope">
              <span v-if="!scope.row.is_confirmed" class="badge badge-pill badge-md badge-light">Onay Bekliyor</span>
              <span v-else class="badge badge-pill badge-md badge-success text-white">Onaylandı</span>
            </template>
          </el-table-column>
        </template>
      </app-table>
    </app-module-body>
  </app-module>
</template>
<script>
export default {
  data() {
    return {
      filters: {
        created_at: {
          name: 'Tarih',
          type: 'date_range',
          value: '',
          options: [],
        },
        is_confirmed: {
          name: 'Onay',
          type: 'primary',
          value: 'false',
          options: [
            {name: 'Onay Bekleyenler', value: 'false',},
            {name: 'Onaylananlar', value: 'true',},
            {name: 'Tümü', value: '',},
          ],
        },
      },
      actions: {
        confirm: {
          method: 'put',
          endpoint: '/:id',
          parameters: {
            is_confirmed: true,
          },
          name: 'Onayla',
          confirmTitle: 'Karaliste Numaralarını Onayla',
          confirmText: 'Onaylanan numaralar yönüne bağlı olarak engellenecek, ulaşım sağlanamayacak veya ulaşılamayacak.',
          description: '',
          icon: 'el-icon-circle-check',
        }
      }
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