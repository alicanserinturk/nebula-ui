<template>
    

</template>
<script>
export default {
    props:{
        type: { required: false, default: 'text' }, //text, paragraph, number, rate, date, time, datetime,
        value :{ required: true, default: false },
    },
    data(){

    },
    computed:{
        val:{
            get(){
                return this.value;
            },
            set(){
                this.$emit('input',val);
            }
        }
    }
}
</script>