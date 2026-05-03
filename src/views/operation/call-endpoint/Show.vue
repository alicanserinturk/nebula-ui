<template>
  <app-module class="">
    <app-module-header>
      <div slot="action">
        <button
          v-if="$api.has('call_endpoint_edit')"
          @click="$router.push($route.path + '/edit')"
          class="btn btn-sm btn-rounded btn-light i-con-h-a"
        >
          Düzenle <i class="i-con i-con-edit float-right ml-2"><i></i></i>
        </button>
        <button
          v-if="$api.has('call_endpoint_create')"
          @click="$router.push('/operation/call-endpoint/create')"
          class="btn ml-2 btn-sm btn-rounded btn-primary i-con-h-a"
        >
          {{ $t("menu.modules.call_endpoint_create.title") }}
          <i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
        </button>
      </div>
    </app-module-header>
    <app-module-body>
      <app-information :errors="errors"></app-information>
      <div class="app-module-frame">
        <div class="app-module-main">
          <app-card>
            <div slot="header">
              <h5 class="mb-0 pt-1 float-left">{{ form.name }}</h5>
              <button
                v-if="form.is_active"
                @click="pause"
                class="float-right btn btn-white btn-rounded btn-sm"
              >
                <i class="el-icon-video-pause"></i> Pasifleştir
              </button>
              <button
                v-else
                @click="play"
                class="float-right btn btn-white btn-rounded btn-sm"
              >
                <i class="el-icon-video-play"></i> Aktifleştir
              </button>
            </div>
            <app-label icon="el-icon-link" label="Endpoint URL">
              {{ form.url }}
            </app-label>
            <app-label icon="el-icon-s-operation" label="HTTP Metod">
              <span class="badge badge-light badge-xs">{{ form.http_method }}</span>
            </app-label>
            <app-label icon="el-icon-timer" label="Sorgulama Sıklığı">
              {{ form.poll_interval }} dakika
            </app-label>
            <app-label icon="el-icon-alarm-clock" label="Başlangıç Tarihi">
              <app-date-text :text="form.starts_at"></app-date-text>
            </app-label>
            <app-label icon="el-icon-time" label="Son Sorgulama">
              <template v-if="form.last_polled_at">
                <app-date-text :text="form.last_polled_at"></app-date-text>
              </template>
              <span v-else class="text-muted">Henüz sorgulanmadı</span>
            </app-label>
            <app-label icon="el-icon-document" label="Data Yolu" v-if="form.response_data_path">
              <code>{{ form.response_data_path }}</code>
            </app-label>
            <app-label icon="el-icon-sort" label="Cursor Yolu" v-if="form.response_cursor_path">
              <code>{{ form.response_cursor_path }}</code>
            </app-label>
            <app-label icon="el-icon-date" label="Arama Günleri">
              {{ filterDays(form.allowed_weekdays) }}
            </app-label>
            <app-label icon="el-icon-refresh" label="Arama Tekrarı" v-if="form.call_type === 'auto'">
              {{ form.retry_days }} gün, günde {{ form.retry_per_day }} sefer
            </app-label>
            <app-label icon="el-icon-files" label="Aranma Türü">
              <span v-if="form.call_type === 'auto'">Otomatik Arama</span>
              <span v-else>Tıklayarak Arama</span>
            </app-label>
            <app-label icon="el-icon-warning-outline" label="Durum">
              <span class="badge badge-default badge-xs" v-if="!form.is_active">Pasif</span>
              <span v-else-if="form.status === 'working'" class="badge badge-primary badge-xs">Çalışıyor</span>
              <span v-else-if="form.status === 'wait'" class="badge badge-light badge-xs">Beklemede</span>
              <span v-else-if="form.status === 'completed'" class="badge badge-success badge-xs">Tamamlandı</span>
              <span v-else-if="form.status === 'failed'" class="badge badge-danger badge-xs">Hata</span>
            </app-label>
            <app-label icon="el-icon-circle-close" label="Hata Nedeni" v-if="form.status === 'failed' && form.failure_reason">
              <span class="text-danger">{{ form.failure_reason }}</span>
            </app-label>
          </app-card>

          <app-card :remove-body-padding="true" v-if="form.status_breakdown && form.status_breakdown.length > 0">
            <template slot="header">
              <span class="pt-1 d-inline-block">Görev Durumu</span>
            </template>
            <el-table :data="form.status_breakdown" style="width: 100%">
              <el-table-column label="Durum" min-width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 'pending'" class="badge badge-light badge-md">Beklemede</span>
                  <span v-else-if="scope.row.status === 'scheduled'" class="badge badge-info badge-md">Planlandı</span>
                  <span v-else-if="scope.row.status === 'in_progress'" class="badge badge-primary badge-md">Devam Ediyor</span>
                  <span v-else-if="scope.row.status === 'done'" class="badge badge-success badge-md">Tamamlandı</span>
                  <span v-else-if="scope.row.status === 'cancelled'" class="badge badge-default badge-md">İptal</span>
                  <span v-else class="badge badge-light badge-md">{{ scope.row.status }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Adet" width="120" align="right">
                <template slot-scope="scope">
                  <strong>{{ scope.row.count }}</strong>
                </template>
              </el-table-column>
            </el-table>
          </app-card>
        </div>
      </div>
    </app-module-body>
  </app-module>
</template>
<script>
import API from "../../../utils/API";

export default {
  data() {
    return {
      errors: null,
      form: {
        status_breakdown: [],
        allowed_weekdays: [],
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    API.get("operation/call-endpoints/" + to.params.id, {}, (response) => {
      next((wm) => {
        wm.form = response.data.data;
      });
    });
  },
  methods: {
    filterDays(days) {
      if (!Array.isArray(days) || days.length === 0) return "";

      const dayNames = {
        1: "Pazartesi",
        2: "Salı",
        3: "Çarşamba",
        4: "Perşembe",
        5: "Cuma",
        6: "Cumartesi",
        7: "Pazar",
      };
      const sorted = [...days].map(Number).sort((a, b) => a - b);
      const key = sorted.join(",");
      if (key === "1,2,3,4,5") return "Hafta içi";
      if (key === "6,7") return "Hafta sonu";
      if (key === "1,2,3,4,5,6,7") return "Her gün";
      return sorted.map((d) => dayNames[d]).join(", ");
    },
    pause() {
      let self = this;
      if (self.form.call_type === "auto") {
        self
          .$confirm(
            "Otomatik arama devam ediyor, endpoint'i pasifleştirmek istediğinize emin misiniz?",
            "Emin Misiniz?",
            { confirmButtonText: "Pasifleştir" }
          )
          .then(() => {
            self.updateStatus(false);
          });
      } else {
        self.updateStatus(false);
      }
    },
    play() {
      let self = this;
      if (self.form.call_type === "auto") {
        self
          .$confirm(
            "Aktifleştirirseniz endpoint otomatik olarak veri çekmeye ve aramaya devam edecek, emin misiniz?",
            "Emin Misiniz?",
            { confirmButtonText: "Aktifleştir" }
          )
          .then(() => {
            self.updateStatus(true);
          });
      } else {
        self.updateStatus(true);
      }
    },
    updateStatus(status) {
      this.$api.put(
        "operation/call-endpoints/" + this.form.id,
        { is_active: status },
        (response) => {
          this.form.is_active = status;
          if (status) {
            this.$message.success("Endpoint aktifleştirildi.");
          } else {
            this.$message.success("Endpoint pasifleştirildi.");
          }
        },
        (code, errors) => {
          this.errors = errors;
        }
      );
    },
  },
};
</script>
