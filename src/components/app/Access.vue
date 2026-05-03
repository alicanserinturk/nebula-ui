<template>
  <div class="d-inline-block">
    <slot v-if="checkAccess"></slot>
  </div>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  props: {
    key: {
      required: false,
      default: false,
    },
    superUser: {
      required: false,
      default: false,
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  methods: {
    checkAccess() {
      if (this.key) {
        let key = false;
        this.currentUser.permits.forEach(item => {
          if (item.key === this.key) key = item
        });
        if (!key)
          return false;
      }
      if (this.superUser && !this.currentUser.is_super_user) {
        return false;
      }
    }
  },
}
</script>