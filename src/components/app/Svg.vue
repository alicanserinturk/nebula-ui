<template>
  <div v-html="source"></div>
</template>
<script>
import axios from "axios"

export default {
  props: {
    src: {
      required: true,
    }
  },
  data() {
    return {
      source: '',
    }
  },
  computed: {},
  created() {
    this.loadSource();
  },
  methods:{
    loadSource(){
      axios.get(this.src).then((data) => {
        this.source = data.data;
      });
    }
  },
  watch:{
    src:function (){
      this.loadSource();
    }
  }
}
</script>
<style>
.modal .customization-context:not(.original-color) svg [fill="#92E3A9"], .modal .customization-context:not(.original-color) svg [fill="#407BFF"], .modal .customization-context:not(.original-color) svg [fill="#BA68C8"], .modal .customization-context:not(.original-color) svg [fill="#FF725E"], .modal .customization-context:not(.original-color) svg [fill="#FFC727"], .modal .customization-context:not(.original-color) svg [style*="fill:#92E3A9"], .modal .customization-context:not(.original-color) svg [style*="fill:#407BFF"], .modal .customization-context:not(.original-color) svg [style*="fill:#BA68C8"], .modal .customization-context:not(.original-color) svg [style*="fill:#FF725E"], .modal .customization-context:not(.original-color) svg [style*="fill:#FFC727"] {
  fill: var(--primary-color) !important;
}

svg [fill="var(--primary-color)"], svg [style*="fill:var(--primary-color)"], svg [fill="#92E3A9"], svg [fill="#407BFF"], svg [fill="#BA68C8"], svg [fill="#FF725E"], svg [fill="#FFC727"], svg [style*="fill:#92E3A9"], svg [style*="fill:#407BFF"], svg [style*="fill:#BA68C8"], svg [style*="fill:#FF725E"], svg [style*="fill:#FFC727"] {
  fill: var(--primary-color) !important;
}
</style>