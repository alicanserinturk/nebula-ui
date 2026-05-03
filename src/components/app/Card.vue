<template>
    <div>
        <template v-if="type === 'simple'">
            <p v-if="title" class="text-muted">
                <strong>{{title}}</strong>
            </p>
            <div class="card">
                <slot></slot>
            </div>
        </template>
        <div v-else class="card border no-shadow" :class="{'hide-description':showDescriptions,'bg-light':backgroundColor}">
            <div v-if="title" class="text-label px-4 pt-4 text-muted">
                {{title}}
            </div>
            <!--<div v-if="title" class="card-header">
                {{title}}
                <span style="float:right; cursor: pointer">
                <el-dropdown trigger="click" @command="handleCommand">
                        <i style="color: #BBB;" class="el-icon-more ml-2"></i>
                        <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="!showDescriptions" command="hideDescription">Açıklamaları Kapat</el-dropdown-item>
                        <el-dropdown-item v-if="showDescriptions" command="hideDescription">Açıklamaları Aç</el-dropdown-item>
                        <el-dropdown-item v-if="!showMore" command="hideMore">Daha Fazla Göster Özelliğini Aç</el-dropdown-item>
                        <el-dropdown-item v-if="showMore" command="hideMore">Daha Fazla Göster Özelliğini Kapat</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </span>
            </div>-->
           <!-- <div v-else class="card-header">
                <slot v-if="title" name="header"></slot>
            </div>-->
            <template v-else>
                <div v-if="$slots['header']" class="p-4 b-b"><slot name="header"></slot></div>
            </template>
            <div class="card-body" :class="{'p-0': removeBodyPadding}">
                <slot></slot>
                <div class="app-body-show-more">
                    <slot name="more" v-if="(collapse && showMore) || !showMore" :class="{'active':collapse}"></slot>
                </div>
            </div>
          <div class="p-2 b-t mb-2 text-center text-muted" v-if="showMore">
            <small class="pointer" @click="collapse = false" v-if="collapse">Detayları Gizle <i class="el-icon-arrow-up"></i></small>
            <small class="pointer" @click="collapse = true" v-else>Daha Fazla Göster <i class="el-icon-arrow-down"></i></small>
          </div>
        </div>
    </div>

</template>
<style>
    .card .card-header {
        font-weight: 600;
        line-height: 22px;
    }

    .card .card-header > * {
        line-height: 22px;
        font-weight: 400;
        color: #BBB;
    }

    .card .card-header .el-switch {
        margin-top: -5px;
        display: inline-block;
    }

    .card.hide-description .app-form-row-description {
        display: none;
    }

    .app-body-show-more-action {
        cursor: pointer;
        border-top: 1px solid #EAEAEA;
        padding: 0.5rem 0 0 0;
        text-align: center;
        color: #BBB;
        font-size: 11px;
        width: calc(100% + 2.5rem);
        margin-left: -1.25rem;
    }

    .card-body{
        padding-left:1.5rem;
        padding-right:1.5rem;
    }
</style>
<script>
    export default {
        props: {
            title: {required: false},
            more: {required: false, default: false},
            type: {required: false, default: false},
            removeBodyPadding: {required: false, default: false},
            removeHeaderPadding: {required: false, default: false},
            backgroundColor: {required: false, default: false},
        },
        data() {
            return {
                showDescriptions: false,
                showMore: true,
                collapse: false
            }
        },
        created() {
          if(!this.more){
            this.showMore = false;
          }
        },
        methods: {
            handleCommand(command) {
                if (command === 'hideDescription') {
                    this.showDescriptions = !this.showDescriptions;
                }
                if (command === 'hideMore') {
                    this.showMore = !this.showMore;
                }
            }
        }
    }
</script>