<template>
    <div class="d-flex align-items-center pl-4 pr-4 py-3 b-t app-item-action">
        <div v-if="disabled" class="app-item-action-disabled"></div>
        <span v-if="icon"><ion-icon class="text-muted" style="font-size:16px;" :name="icon"></ion-icon></span>
        <div class="px-3">
            <h6 class="app-item-action-label mb-1 font-weight-bold">{{label}}</h6>
            <div v-if="description" class="text-sm text-muted">{{description}}</div>
        </div>
        <div class="flex"></div>
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script>
    export default {
        props: {
            label: {required: true, default: false},
            description: {required: false, default: false},
            icon: {required: false, default: false},
            disabled: {required: false, default: false},
        },
        data() {
            return {}
        }
    }
</script>
<style>
    .app-item-action{
        position: relative;
        display: block;
    }
    
    .app-item-action-disabled{
        position: absolute;
        top:0;
        right: 0;
        left:0;
        bottom:0;
        background: rgba(255,255,255,0.5);
        z-index: 999999;
    }
</style>