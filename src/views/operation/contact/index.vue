<template>
  <app-module>
    <app-module-header>
      <template slot="action">
        <button  v-if="$api.has('call_list_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
          {{ $t('menu.modules.contact_create.title') }} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </template>
    </app-module-header>
    <app-module-body>
      <app-table :archivable="true"  :selectable="true" endpoint="operation/contacts" :actions="actions" vector="contact" primary="name">
        <template slot-scope="item">
            <el-table-column
                width="45px">
              <template slot-scope="scope">
                <span class="w-32 avatar circle bg-light">
                  <template v-if="scope.row.name || scope.row.surname">
                    <span v-if="scope.row.name">{{scope.row.name[0]}}</span>
                    <span v-if="scope.row.surname">{{scope.row.surname[0]}}</span>
                  </template>
                  <template v-else>
                    <ion-icon name="person"></ion-icon>
                  </template>
                </span>
              </template>
            </el-table-column>
            <el-table-column
                    label="Müşteri">
                <template slot-scope="scope">
                    <router-link :to="$route.path + '/' + scope.row.id">
                      <template v-if="scope.row.name || scope.row.surname">
                       {{scope.row.name}} {{scope.row.surname}}
                      </template>
                      <template v-else>
                        İsimsiz Müşteri
                      </template>
                    </router-link>
                    <span class="sub-item text-muted"><small class="text-muted"><app-date-text :text="scope.row.created_at"></app-date-text> oluşturuldu</small></span>
                </template>
            </el-table-column>
            <el-table-column
                align="right"
                width="125px"
                label="Oluşturma Tarihi">
              <template slot-scope="scope">
                
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
        
      }
    }
  },
  created() {

  },
  methods: {
    handleSelect() {

    },
  },
}
</script>