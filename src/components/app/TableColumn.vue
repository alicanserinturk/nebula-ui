<template>
    <td>{{row}}<slot></slot></td>
</template>
<script>
    export default {
        props:{
            label: {required:false,},
            width: {required:false,},
            prop: {required:false,prop:false},
            row: {required:false,default:() => {return []}},
        },
        data(){
            return {}
        },
    }
</script>