<template>
    <el-input prefix-icon="el-icon-link" size="medium" v-model="val"></el-input>
</template>
<script>
    export default {
        props: {
            'value': {required: false, default: ''},
            'text': {required: false, default: ''},
        },
        computed: {
            val: {
                get() {
                    return this.value
                },
                set(newVal) {
                    let trMap = {
                        'çÇ':'c',
                        'ğĞ':'g',
                        'şŞ':'s',
                        'üÜ':'u',
                        'ıİ':'i',
                        'öÖ':'o'
                    };
                    for(let key in trMap) {
                        newVal = newVal.replace(new RegExp('['+key+']','g'), trMap[key]);
                    }
                    newVal = newVal.replace(/[^-a-zA-Z0-9\s]+/ig, '')
                        .replace(/\s/gi, "-")
                        .replace(/[-]+/gi, "-")
                        .toLowerCase();

                    this.$emit('input', newVal)
                }
            }
        },
        data(){
            return {}
        },
        watch:{
            text(text){
                this.val = text
            }
        }
    }
</script>