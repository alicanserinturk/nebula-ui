<template>
    <app-module>
        <app-module-header>
            <template slot="action">
                <button v-if="$api.has('crm_form_create')" @click="$router.push($route.path + '/create')" class="btn btn-sm btn-rounded btn-primary i-con-h-a">
                    {{$t('menu.modules.crm_form_create.title')}} <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
                </button>
            </template>
        </app-module-header>
        <app-module-body>
            <app-table  :selectable="true" endpoint="operation/crm/forms" :options="options" vector="crm-custom" primary="title">
                <template slot-scope="item">
                    <el-table-column
                            label="Ad">
                        <template slot-scope="scope">
                            <router-link :to="$route.path + '/' + scope.row.id">{{scope.row.name}}</router-link>
                            <span class="sub-item"><span v-if="scope.row.description">{{scope.row.description}} &#183; </span><app-date-text :text="scope.row.created_at"></app-date-text> önce oluşturuldu</span>
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