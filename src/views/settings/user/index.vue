<template>
    <app-module>
        <app-module-header>
            <template slot="action">
                <button v-if="$api.has('user_create')" @click="$router.push('/settings/user/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
                    {{$t('menu.modules.user_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
                </button>
            </template>
        </app-module-header>
        <app-module-body>
            <app-table :selectable="true" :downloadable="false"  endpoint="settings/users" vector="users" :actions="actions" primary="name">
                <template slot-scope="item">
                  <el-table-column
                      width="45px">
                    <template slot-scope="scope">
                     <span class="w-32 avatar circle bg-light">
                  <span v-if="scope.row.is_online" class="avatar-status on b-white avatar-right"></span>
                  {{scope.row.name[0]}}{{scope.row.surname[0]}}
                       </span>
                    </template>
                  </el-table-column>
                    <el-table-column
                            label="Kullanıcı">
                        <template slot-scope="scope">
                            <router-link :to="$route.path + '/' + scope.row.id">{{scope.row.name}} {{scope.row.surname}}</router-link>
                            <span class="sub-item text-muted">{{scope.row.email}} &bull; <app-date-text :text="scope.row.created_at"></app-date-text></span></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="right"></el-table-column>
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
                block: {
                  method: 'put',
                  endpoint: '/:id',
                  parameters: {
                    is_active: false,
                  },
                  name: 'Pasif Et',
                  confirmTitle: 'Pasif Et',
                  confirmText: 'Seçilen kullanıcılar pasife alınacak, aktif oturumları sonlandırılacak ve SIP dahilileri Asterisk\'ten kaldırılacak.',
                  description: '',
                  icon: 'el-icon-lock',
                },
                unblock: {
                  method: 'put',
                  endpoint: '/:id',
                  parameters: {
                    is_active: true,
                  },
                  name: 'Aktif Et',
                  confirmTitle: 'Aktif Et',
                  confirmText: 'Seçilen kullanıcılar aktif edilecek ve SIP dahilileri Asterisk\'e eklenecek.',
                  description: '',
                  icon: 'el-icon-unlock',
                },
                clear_session: {
                  method: 'patch',
                  endpoint: '/:id/pending-session',
                  parameters: {},
                  name: 'Aktif Oturumu Sonlandır',
                  confirmTitle: 'Oturumu Sonlandır',
                  confirmText: 'Seçili kullanıcıların aktif oturumlarını sonlandırmak istediğinize emin misiniz?',
                  description: '',
                  icon: 'el-icon-unlock',
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