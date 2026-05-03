<template>

</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        props: {

        },
        data() {
            return {}
        },
        computed: {
            ...mapGetters(['currentUser']),
        }
    }
</script>