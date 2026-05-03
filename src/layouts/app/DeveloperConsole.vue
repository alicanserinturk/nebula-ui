<template>
  <div class="app-side-modal b-l" v-if="this.visible" style="width:600px">
    <div class="app-side-modal-header px-4">
      <div class="row row-xs">
        <div class="col-auto pt-1">
          <ion-icon name="terminal-outline" style="font-size:19px;"></ion-icon>
        </div>
        <div class="col pt-1">
          <h6 class="mb-0 ml-1 font-weight-bold" style="line-height:21px;">Geliştirici Konsolu</h6>
        </div>
        <div class="col-auto">
            <button class="btn btn-white btn-rounded btn-sm mr-2" @click="tokenCopy"><ion-icon name="copy-outline" class="mr-1"></ion-icon> Token'ı Kopyala</button>
          <button class="btn btn-icon btn-rounded btn-sm btn-white" @click="visible = false"><i class="el-icon-close"></i></ion-icon></button>
        </div>
      </div>
    </div>
    <div class="app-side-modal-body pb-5 px-4" style="opacity:0.9">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="Değişkenler" name="variables">
                <div class="row mt-1" v-for="(item,key) in envParams">
                    <div class="col-5"><small class="font-weight-500 text-muted">{{ key }}</small></div>
                    <div class="col-7" style="font-family: monospace !important;">{{ item }}</div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Kullanıcı Bilgileri" name="user">
                <pre class="r-3x mt-2" style="background:transparent">{{currentUser}}</pre>
            </el-tab-pane>
        </el-tabs>
              
    </div>
  </div>
</template>
<script>
import EventBus from "@/utils/EventBus";
import {mapActions, mapGetters} from "vuex";

export default {
  data(){
    return {
      visible:false,
      activeTab: 'variables'
    }
  },
  computed:{
    ...mapGetters(['currentUser']),
    envParams() {
      return process.env
    }
  },
  created() {
    EventBus.$on('openDeveloperConsole',() => {
        this.visible = true;
    });
  },
  beforeDestroy() {
    EventBus.$off('openDeveloperConsole');
  },
  methods:{
    tokenCopy(){
        const el = document.createElement('textarea');  
        el.value = this.currentUser.api_token;                                 
        el.setAttribute('readonly', '');                
        el.style.position = 'absolute';                     
        el.style.left = '-9999px';                      
        document.body.appendChild(el);                  
        const selected =  document.getSelection().rangeCount > 0  ? document.getSelection().getRangeAt(0) : false;                                    
        el.select();                                    
        document.execCommand('copy');                   
        document.body.removeChild(el);                  
        if (selected) {                                 
          document.getSelection().removeAllRanges();    
          document.getSelection().addRange(selected);   
        }
        this.$message.success('Kopyalandı')
    }
  }
}
</script>