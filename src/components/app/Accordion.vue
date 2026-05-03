<template>
    <el-collapse accordion>
        <el-collapse-item name="1">
            <template slot="title">
                <slot name="header"></slot>
            </template>
            <div class="px-4 pb-3">
                <slot></slot>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<style>
.el-collapse-item__arrow{
  padding-right: 20px;
}
    .el-collapse-item__header{
        height: auto;
        line-height: normal;
    }
    .card .el-collapse{
        border-bottom:0 !important;
        border-top:0 !important;
        border-radius: 5px;
    }
    .card .el-collapse-item__header{
        border-bottom:0;
        font-weight: 400 !important;
        color:#5E676F !important;
        font-size:14px !important;
        border-bottom:0;
    }
    .card .el-collapse:first-child .el-collapse-item__header{
        border-top:0 !important;
    }
    .card .el-collapse-item{
        border:0 !important;
    }
    .card .el-collapse-item__wrap{
        border:0 !important;
    }
    .card .el-collapse-item__content{
        padding-bottom:0;
    }
    .card{
        overflow: hidden;
    }
    .card .el-icon-arrow-right{
        margin-right: 1.5rem;
    }
</style>