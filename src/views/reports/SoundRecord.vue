<template>
  <app-module>
    <app-module-header>
      
    </app-module-header>
    <app-module-body>
      <app-table :downloadable="true" archivable endpoint="reports/sound" :options="options" vector="report">
        <el-table-column width="60" align="center">
          <template slot-scope="scope">
            <button @click="showFile(scope.row)" class="btn btn-light btn-rounded btn-icon i-con-h-a">
              <ion-icon name="play-outline"></ion-icon>
            </button>
          </template>
        </el-table-column>
        <el-table-column label="Arama">
          <template slot-scope="scope">
            <template v-if="scope.row.direction === 'out'">
              {{ scope.row.to }}
              <small class="sub-item text-muted d-block">{{ scope.row.from }}</small>
            </template>
            <template v-else>
              {{ scope.row.from }}
              <small class="sub-item text-muted d-block">{{ scope.row.to }}</small>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="Detay" align="right" width="auto" :fit="true">
          <template slot-scope="scope">
            <template v-if="scope.row.direction === 'out'">
              <span class="badge badge-xs badge-light">Giden Arama <i class="el-icon-right ml-1"></i></span>
              <small class="sub-item text-muted d-block">{{scope.row.number}}</small>
            </template>
            <template v-else>
              <span class="badge badge-xs badge-light"><i class="el-icon-back mr-1"></i> Gelen Arama</span>
              <small class="sub-item text-muted d-block">{{scope.row.number}} <span v-if="scope.row.queue"> - {{scope.row.queue}}</span></small>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="Süre" width="90" align="right" :fit="true">
          <template slot-scope="scope">
            <app-date-range-text :start-date="scope.row.start_at" :end-date="scope.row.end_at"></app-date-range-text>
            <small class="sub-item text-muted d-block">Toplam</small>
          </template>
        </el-table-column>
        <el-table-column label="Tarih" align="right" width="125px" :fit="true">
          <template slot-scope="scope">
            <small>
              <app-date-text :text="scope.row.start_at"></app-date-text>
            </small>
          </template>
        </el-table-column>
      </app-table>
    </app-module-body>
    <el-dialog v-if="fileModalVisible" :append-to-body="true" :visible.sync="fileModalVisible" custom-class="app-modal-auto">
      <template slot="title">
        <div class="row row-xs">
          <div class="col-auto">
            <div class="avatar w-40 bg-light"><i class="el-icon-user"></i></div>
          </div>
          <div class="col pl-1">
            <template v-if="item.direction === 'out'">
              {{item.to}}
              <small class=" text-muted d-block">{{item.from}} ile görüşüldü.</small>
            </template>
            <template v-else>
              {{item.from}}
              <small class=" text-muted d-block">{{item.to}} ile görüşüldü.</small>
            </template>
          </div>
          <div class="col-md-auto pr-4">
            <a target="_blank" :href="currentUser.servers.media + item.sound_file" class="btn mr-2 btn-light btn-sm btn-rounded" :download="item.sound_file + '.vaw'">İndir <i class="el-icon-download"></i></a>
          </div>
        </div>
      </template>

      <!--<div class="row">
        <div class="col-md-7 pt-4">
          <div class="mb-2">
            <small>Arama Yönü:</small>
            <span class="d-block text-muted"><span v-if="item.direction === 'out'">Giden</span><span v-else>Gelen</span></span>
          </div>
          <div class="mb-2">
            <small>Numara:</small>
            <span class="d-block text-muted">{{item.number}}</span>
          </div>
          <div class="mb-2">
            <small>Tarih:</small>
            <span class="d-block text-muted"><app-date-text :text="item.start_at"></app-date-text></span>
          </div>
        </div>
        <div class="col-md-5">
          <img src="/assets/img/vectors/player.svg" alt="">
        </div>
      </div>-->

      <div class="px-2" slot="footer">
        <app-audio :src="currentUser.servers.media + item.sound_file"></app-audio>
      </div>
    </el-dialog>
  </app-module>
</template>
<script>
//https://gist.github.com/larryyangsen/b2f293edaefde4067e2a289756c2f188

import {mapGetters} from "vuex";

export default {
  data() {
    return {
      options: {},
      fileModalVisible: false,
      item: null,
      audio: {
        source: '',
      }
    }
  },
  created() {

  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  methods: {
    showFile(item) {
      this.item = item;
      this.fileModalVisible = true;
    }
  }
}
</script>
<style>
audio{
width: 100%;
}

.el-dialog__headerbtn{
  margin-top:3px;
}

</style>