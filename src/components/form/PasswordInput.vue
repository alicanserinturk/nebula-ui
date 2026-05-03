<template>
    <div class="d-block position-relative">
        <el-input prefix-icon="el-icon-lock" size="medium" type="password" v-model="password" show-password/>
        <ul class="password-list text-muted">
            <li :class="{ 'is_valid text-success font-weight-500': contains_eight_characters }"><span ><i :class="{'el-icon-circle-check':!contains_eight_characters,'el-icon-success':contains_eight_characters,}" class=" mr-1"></i> Şifreniz en az 8 karakter
                içermelidir.</span></li>
            <li :class="{ 'is_valid text-success font-weight-500': contains_number }"><span><i :class="{'el-icon-circle-check':!contains_number,'el-icon-success':contains_number,}" class="mr-1"></i> Şifreniz rakam içermelidir.</span>
            </li>
            <li :class="{ 'is_valid text-success font-weight-500': contains_uppercase }"><span><i :class="{'el-icon-circle-check':!contains_uppercase,'el-icon-success':contains_uppercase,}" class="mr-1"></i> Şifreniz büyük ve küçük harf içermelidir.</span></li>
        </ul>
        <div class="checkmark_container" :class="{ show_checkmark: valid_password }">
            <i class="text-success el-icon-success"></i>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            value: {
                required: false,
                default: '',
            }
        },
        data() {
            return {
                password_length: 0,
                contains_eight_characters: false,
                contains_number: false,
                contains_uppercase: false,
                contains_special_character: false,
                valid_password: false,
            }
        },
        computed: {
            password: {
                set(value) {
                    this.$emit('input', value);
                },
                get() {
                    return this.value;
                }
            }
        },
        watch: {
            password() {
                this.password_length = this.password.length;
                const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

                this.contains_eight_characters = this.password_length > 7;

                this.contains_number = /\d/.test(this.password);
                this.contains_uppercase = /[A-Z]/.test(this.password) && /[a-z]/.test(this.password);
                this.contains_special_character = format.test(this.password);

                if (this.contains_eight_characters === true &&
                    this.contains_uppercase === true &&
                    this.contains_number === true) {
                    this.valid_password = true;
                } else {
                    this.valid_password = false;
                }
            }
        }
    }
</script>
<style>
    ul.password-list {

        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 15px 0 0 0;
        list-style: none;
    }

    ul.password-list li {
        margin-bottom: 8px;
        position: relative;
    }

    ul.password-list li:before {
        content: "";
        width: 0%;
        height: 1px;
        background: #FFF;
        position: absolute;
        left: 0;
        top: 50%;
        display: block;
        transition: all .6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Checkmark & Strikethrough --------- */

    .is_valid {
        opacity: 0.8;
    }

    .is_valid:before {
        /*width: 100% !important;*/
    }

    .checkmark_container {
        border-radius: 50%;
        position: absolute;
        top: 12px;
        right: 35px;
        width: 11px;
        height: 11px;
        visibility: hidden;
        opacity: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity .4s ease;
    }

    .show_checkmark {
        visibility: visible;
        opacity: 1;
    }

    .checkmark {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: white;
        stroke-width: 15;
        stroke-linecap: round;
        stroke-dasharray: 180;
        stroke-dashoffset: 180;
    }

    .checked {
        animation: draw 0.5s ease forwards;
    }

    @keyframes draw {
        to {
            stroke-dashoffset: 0;
        }
    }
</style>