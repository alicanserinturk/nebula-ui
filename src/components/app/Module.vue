<template>
  <div class="app-module">
    <slot></slot>
  </div>
</template>
<style>
.app-module {
  display: block;
  position: relative;
}
.app-module.app-module-modal{
  position: absolute;
}
.app-screen-flat .page-content-inner {
  padding: 0 !important;
}

.app-screen-flat .card {
  border-top: 1px solid #EAEAEA;
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}

.app-screen-flat .card-body {
  padding: 1em 2rem;
}

.app-screen-flat .card-header {
  border-radius: 0;
  padding: .75rem 2rem;
}

.app-screen-flat .p-3 {
  padding: 1rem 2rem !important;
}

.app-screen-flat .p-4 {
  padding: 1.5rem 2rem !important;
}

.app-module-frame {
  width: 100%;
  display: flex;
}

.app-module-left {
  width: 100%;
  flex: 1;
  padding-right: 0;
  border-right: 1px solid #F5F5F5;
}

.app-module-right {
  padding-left: 2rem;
  width: 400px;
}

.app-module-frame > div:last-child {
  padding-right: 0;
}

.app-module-frame > div {
  padding-right: 2rem;
}

.app-module-main {
  width: 100%;
  flex: 1;
  padding-right: 0;
  border-right: 1px solid #F5F5F5;
}

.app-module-sidebar {
  width: 320px;
}

#main {
  position: relative;
}

.app-flat #page-content {
  background: #FFF;
  border-top: 1px solid #EAEAEA;
  min-height: calc(100vh - 176px);
}

@media (min-width: 992px) {
  .app-container #page-hero {
    max-width: 1140px;
    margin: 0 auto;
  }

  .app-container .page-content-inner {
    max-width: 1140px;
    margin: 0 auto;
  }
}
</style>
<script>
import {mapGetters} from "vuex";

export default {
  props: {
    container: {required: false, default: false},
    type: {required: false, default: 'none'},
  },
  data() {
    return {
      children: null,
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'loading'])
  },
  created() {
    this.children = this.$children;
  },
  methods: {}
}
</script>