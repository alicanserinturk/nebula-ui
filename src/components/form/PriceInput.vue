<template>
    <div>
        <el-input @keyup="$emit('keyup')" class="app-money-input" type="text" v-model="displayValue" @blur="isInputActive = false"
                  @focus="isInputActive = true"/>
    </div>
</template>
<style>
    .app-money-input .el-input__inner {
        font-family: monospace !important;
        color:#111;
    }
</style>
<script>
    export default {
        props: ["value","symbol"],
        data: function () {
            return {
                isInputActive: false
            }
        },
        computed: {
            displayValue: {
                get: function (test) {
                    if (this.isInputActive) {
                        return this.value.toString()
                    } else {
                        let newValue = this.value.toString().replace(',', '.');

                        newValue = parseFloat(newValue);
                        if (isNaN(newValue)) {
                            newValue = 0
                        }
                        let parts = newValue.toString().split('.');
                        let secondValue;
                        if (parts.length > 1) {
                            secondValue = (parts[parts.length - 1]);
                            parts.pop();
                        } else {
                            secondValue = '00'
                        }
                        let firstValue = parseFloat(parts.join('.').toString().replace(/[^\d\.]/g, ""))


                        //console.log('First: ' + firstValue + ' Second: ' + secondValue)
                        this.$emit('input', parseFloat(firstValue + "." + secondValue))
                        return firstValue.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.") + "," + secondValue + " " + this.symbol
                    }
                },
                set: function (modifiedValue) {
                    this.$emit('input', modifiedValue)
                }
            }
        }
    }
</script>