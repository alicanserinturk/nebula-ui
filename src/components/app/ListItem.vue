<template>
    <div class="app-item-list d-flex align-items-center px-4 py-3 pointer">
        <slot v-if="!label" name="label"></slot>
        <ion-icon v-if="icon" class="app-item-list-icon" :name="icon"></ion-icon>
        <div v-if="label" class="px-3 pt-2">
            <h6 class="app-item-list-label font-weight-bold">{{label}}</h6>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            label:{ required:false, default:false },
            icon:{ required:false, default:false },
        },
        data(){
            return {}
        }
    }
</script>
<style>
    .app-item-list{

    }
    .app-item-list-label{

    }
    .app-item-list-icon{

    }
</style>