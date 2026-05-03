<template>
    <app-module>
        <app-module-header>
            <template slot="action">
              <button v-if="$api.has('dialplan_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
                {{$t('menu.modules.dialplan_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
              </button>
            </template>
        </app-module-header>
        <app-module-body>
            <app-table  :selectable="true"  endpoint="settings/dialplans" :options="options" vector="dial-plans" primary="name">
                <template slot-scope="item">
                    <el-table-column
                            label="Ad">
                        <template slot-scope="scope">
                            <router-link :to="$route.path + '/' + scope.row.id">{{scope.row.name}}</router-link>
                            <span class="sub-item"><span v-if="scope.row.description">{{scope.row.description}} &#183; </span><app-date-text :text="scope.row.created_at"></app-date-text> önce oluşturuldu</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="right"
                            label="Yönlendirme">
                        <template slot-scope="scope">
                            <span class="">
                              <span v-if="scope.row.application === 'dial'"><i class="el-icon-user mr-2"></i> {{scope.row.application_name}}</span>
                              <span v-else><i class="el-icon-position mr-2"></i>{{scope.row.application_name}}</span>
                            </span>
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