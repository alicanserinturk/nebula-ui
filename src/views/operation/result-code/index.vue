<template>
    <app-module>
        <app-module-header>
            <template slot="action">
                <button v-if="$api.has('announcement_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
                    {{$t('menu.modules.result_code_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
                </button>
            </template>
        </app-module-header>
        <app-module-body>
            <app-table  :selectable="true" endpoint="operation/result-codes" :options="options" vector="result-code" primary="title">
                <template slot-scope="item">
                    <el-table-column
                            label="Ad">
                        <template slot-scope="scope">
                            <router-link v-if="!scope.row.is_system" :to="$route.path + '/' + scope.row.id"><span>{{scope.row.name}}</span></router-link>
                            <span v-else>{{scope.row.name}}</span>
                            <small class="d-block sub-item text-muted">
                                <app-date-text :text="scope.row.created_at"></app-date-text><span v-if="scope.row.is_system"> sistem tarafından</span> oluşturuldu
                            </small>
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