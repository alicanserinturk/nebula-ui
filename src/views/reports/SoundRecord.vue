<template>
  <app-module>
    <app-module-header>

    </app-module-header>
    <app-module-body>
      <app-table :downloadable="true" archivable endpoint="reports/sound" :options="options" :filters="filters" vector="report">
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
            <a v-if="downloadUrl" :href="downloadUrl" class="btn mr-2 btn-light btn-sm btn-rounded">
              İndir <i class="el-icon-download"></i>
            </a>
          </div>
        </div>
      </template>

      <div class="px-2">
        <app-audio v-if="audioUrl" :src="audioUrl"></app-audio>
        <div v-else-if="loading" class="text-center text-muted py-3">
          <i class="el-icon-loading mr-1"></i> Ses kaydı hazırlanıyor...
        </div>
        <div v-else-if="errorMessage" class="text-center text-muted py-3">
          {{ errorMessage }}
        </div>
      </div>
    </el-dialog>
  </app-module>
</template>
<script>
import {mapGetters} from "vuex";
import API from "@/utils/API";
import moment from "moment";

export default {
  data() {
    return {
      options: {},
      fileModalVisible: false,
      item: null,
      audioUrl: null,
      downloadUrl: null,
      loading: false,
      errorMessage: null,
      filters: {
        start_at: {
          name: "Tarih",
          type: "daterange",
          value: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
          options: [],
        },
        user_id: {
          name: "Kullanıcı",
          type: "user",
          value: null,
          options: [],
        },
        queue_id: {
          name: "Arama Grubu",
          type: "queue",
          value: null,
          options: [],
        },
        number_id: {
          name: "Numara",
          type: "number",
          value: null,
          options: [],
        },
        direction: {
          name: "Yön",
          type: "primary",
          value: null,
          options: [
            { name: "Tümü", value: null },
            { name: "Gelen", value: "in" },
            { name: "Giden", value: "out" },
          ],
        },
      },
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  methods: {
    showFile(item) {
      this.item = item;
      this.audioUrl = null;
      this.downloadUrl = null;
      this.errorMessage = null;
      this.loading = true;
      this.fileModalVisible = true;

      API.get('media/sound/play', { cid: item.asterisk_id },
        (response) => {
          this.loading = false;
          if (response && response.data && response.data.url) {
            this.audioUrl = response.data.url;
            this.downloadUrl = response.data.download_url;
          } else {
            this.errorMessage = 'Ses kaydı bulunamadı.';
          }
        },
        () => {
          this.loading = false;
          this.errorMessage = 'Ses kaydı yüklenemedi.';
        }
      );
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
