<template>
    <div class="app-label mb-3">
        <div class="mb-1">
            <small class="text-label d-block text-muted mb-2"> {{label}}:</small>
             <i v-if="icon" :class="icon" class="mr-1"></i> <slot></slot>
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
    .app-label:last-child{
        margin-bottom:0 !important;
    }
    .app-label .col-md-auto{
        min-width: 200px;
    }
</style>