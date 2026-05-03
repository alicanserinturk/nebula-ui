<template>
    <div>
        <h2>Preview</h2>
    </div>
</template>
<script>
export default {
    props:{
        permit:{
            required:false,
            default: false,
        },
        id:{
            required:false,
            default: false,
        },
        widget:{
            required:true
        },
        size:{
            required:false,
            default: 'medium',
        }
    },
    data(){
        return {}
    },
    created(){

    }
}
</script>