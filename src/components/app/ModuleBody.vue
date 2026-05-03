<template>
    <div class="page-content" id="page-content">
        <div class="page-content-inner">
            <div v-if="card" class="card">
                <div class="card-body p-0">
                    <slot></slot>
                </div>
            </div>
            <slot v-else></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            'card': {
                required: false,
                default: false,
            }
        }
    }
</script>
<style>

</style>