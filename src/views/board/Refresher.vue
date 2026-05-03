<template>

</template>
<script>
// Test
export default {
  data() {
    return {}
  },
  beforeRouteEnter(to, from, next) {
    next(wm => {
      wm.$router.go(-1);
    });
  }
}
</script>