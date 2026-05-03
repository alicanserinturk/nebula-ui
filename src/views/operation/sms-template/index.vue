<template>
    <app-module>
        <app-module-header>
            <template slot="action">
                <button v-if="$api.has('announcement_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
                    {{$t('menu.modules.sms_template_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
                </button>
            </template>
        </app-module-header>
        <app-module-body>
            <app-table  :selectable="true" endpoint="settings/announcements" :options="options" vector="sms-templates" primary="name">
                <template slot-scope="item">
                    <el-table-column
                            label="Başlık">
                        <template slot-scope="scope">
                            <router-link :to="$route.path + '/' + scope.row.id"><span>{{scope.row.title}}</span></router-link>
                            <span class="sub-item text-muted">
                                <span>{{scope.row.description.replace(/<\/?[^>]+(>|$)/g, "").substr(0,70)}}...</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="200"
                            label="">
                        <template slot-scope="scope">
                            <div class="text-right pr-2">
                                <span v-if="scope.row.is_global" class="badge badge-sm badge-secondary">Tüm Müşteriler İçin Görünür</span>
                                <span v-if="scope.row.is_pinned"><i class="el-icon-place"></i></span>
                            </div>
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
    </app-module>
</template>
<script>
    export default {
        data() {
            return {
                options: {

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