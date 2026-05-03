<template>
    <div :class="{'active': modalVisible}" class="app-modern-modal">
        <div class="app-modern-modal-header">
            <slot name="header"></slot>
            <div v-if="closable" class="app-moder-modal-close" @click="modalVisible = false">
                <i class="el-icon-close"></i>
            </div>
        </div>
        <div class="app-page-widget-modal-body">
            <slot></slot>
        </div>
        <div class="app-modern-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            'visible': {
                required: false,
                default: false,
            },
            'closable': {
                required: false,
                default: true,
            }
        },
        data(){
            return {

            }
        },
        computed:{
            modalVisible:{
                set(value){
                    this.$emit('update:visible', value)
                },
                get(){
                    return this.visible;
                }
            }
        }
    }
</script>
<style>
    .app-modern-modal{
        display: none;
        position: fixed;
        top:0;
        bottom:0;
        left:0;
        width: 100%;
        background: rgba(0,0,0,0.15);
        z-index: 9999;
        transition: 0.5s;
        backdrop-filter: blur(0);
        padding:20px 30px 30px 30px;
    }
    .app-modern-modal *{
      color:rgba(0,0,0,0.8);
    }
    .app-modern-modal-header{
        font-size:20px;
        font-weight: 300;
        color:#FFF;
    }
    .app-modern-modal.active{
        display: block;
        backdrop-filter: blur(10px);
    }
    .app-moder-modal-close{
        position: fixed;
        right:32px;
        top:20px;
        cursor: pointer;
        color:#FFF
    }
    .app-moder-modal-close i{
        font-size:22px;
        color:#FFF;

    }
</style>