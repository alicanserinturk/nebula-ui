<template>
  <app-module>
    <app-module-header>
      <template slot="toolbar">
        <div class="d-flex align-items-center flex-wrap pb-3" style="gap: 10px;">
          <span class="text-muted text-sm" v-if="metrics && metrics.available">
            Son güncelleme: <span>{{ lastUpdateText }}</span>
          </span>
          <span class="text-danger text-sm" v-else-if="metrics && !metrics.available">
            <ion-icon name="warning-outline"></ion-icon> Veri yok — collector çalışmıyor olabilir
          </span>

          <div class="ml-auto d-flex align-items-center" style="gap: 10px;">
            <el-button size="small" icon="el-icon-refresh" :loading="metricsLoading" @click="refreshAll">
              Yenile
            </el-button>

            <el-tooltip content="15 saniyede bir otomatik yenile" placement="top">
              <el-switch v-model="autoRefresh" active-text="Auto" @change="toggleAutoRefresh" />
            </el-tooltip>

            <el-select
              v-model="selectedServerKey"
              placeholder="Sunucu seçin"
              size="small"
              style="width: 280px;"
              :loading="serversLoading"
              @change="onServerChange"
            >
              <el-option
                v-for="srv in servers"
                :key="srv.key"
                :label="srv.name + ' (' + srv.public_ip + ')'"
                :value="srv.key"
              />
            </el-select>
          </div>
        </div>
      </template>
    </app-module-header>

    <app-module-body>
      <div v-if="!selectedServerKey && !serversLoading" class="text-center text-muted py-5">
        Yukarıdaki listeden bir PBX sunucusu seçin.
      </div>

      <div v-else-if="metrics && metrics.available">
        <!-- KPI Kartları: Network -->
        <el-row :gutter="12" class="mb-3">
          <el-col :span="6" v-for="card in kpiCards" :key="card.key">
            <el-card shadow="never" class="kpi-card">
              <div class="d-flex align-items-center justify-content-between">
                <div class="text-muted text-sm">{{ card.label }}</div>
                <ion-icon
                  name="information-circle-outline"
                  class="kpi-info-icon"
                  @click="openInfo(card.key)"
                ></ion-icon>
              </div>
              <div class="h3 mb-0 kpi-value" :style="{ color: card.color }">
                {{ formatNum(card.value) }}
                <small class="text-muted" v-if="card.unit">{{ card.unit }}</small>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- NIC + Asterisk RTP -->
        <el-row :gutter="12" class="mb-3">
          <el-col :span="12">
            <el-card shadow="never">
              <div slot="header" class="d-flex align-items-center justify-content-between">
                <div class="text-sm">
                  <ion-icon name="hardware-chip-outline"></ion-icon>
                  NIC ({{ metrics.nic_iface || '-' }})
                </div>
                <ion-icon
                  name="information-circle-outline"
                  class="kpi-info-icon"
                  @click="openInfo('nic')"
                ></ion-icon>
              </div>
              <el-row :gutter="8">
                <el-col :span="12">
                  <div class="text-muted text-xs">RX / TX</div>
                  <div>{{ formatNum(metrics.nic_rx_kbps) }} / {{ formatNum(metrics.nic_tx_kbps) }} <small>kbps</small></div>
                </el-col>
                <el-col :span="12">
                  <div class="text-muted text-xs">Errors / Drops (s)</div>
                  <div>{{ formatNum(metrics.nic_errors_per_sec) }} / {{ formatNum(metrics.nic_drops_per_sec) }}</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card shadow="never">
              <div slot="header" class="d-flex align-items-center justify-content-between">
                <div class="text-sm">
                  <ion-icon name="call-outline"></ion-icon>
                  Asterisk RTP (aktif: {{ metrics.ast_active_channels || 0 }})
                </div>
                <ion-icon
                  name="information-circle-outline"
                  class="kpi-info-icon"
                  @click="openInfo('asterisk')"
                ></ion-icon>
              </div>
              <el-row :gutter="8">
                <el-col :span="8">
                  <div class="text-muted text-xs">RTT</div>
                  <div :style="{ color: gradient(scoreLatency(metrics.ast_rtt_ms)) }">
                    {{ formatNum(metrics.ast_rtt_ms) }} <small>ms</small>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="text-muted text-xs">Jitter</div>
                  <div :style="{ color: gradient(scoreJitter(metrics.ast_jitter_ms)) }">
                    {{ formatNum(metrics.ast_jitter_ms) }} <small>ms</small>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="text-muted text-xs">Loss</div>
                  <div :style="{ color: gradient(scoreLoss(metrics.ast_loss_pct)) }">
                    {{ formatNum(metrics.ast_loss_pct) }} <small>%</small>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>

        <!-- Probe tablosu -->
        <el-card shadow="never" class="mb-3">
          <div slot="header" class="d-flex align-items-center justify-content-between">
            <div class="text-sm">
              <ion-icon name="globe-outline"></ion-icon>
              Probe Hedefleri
            </div>
            <ion-icon
              name="information-circle-outline"
              class="kpi-info-icon"
              @click="openInfo('probes')"
            ></ion-icon>
          </div>
          <el-table :data="metrics.probes || []" size="small" empty-text="Probe verisi yok">
            <el-table-column prop="name" label="Hedef" width="160" />
            <el-table-column prop="host" label="Host" width="160" />
            <el-table-column prop="kind" label="Tür" width="120">
              <template slot-scope="scope">
                <el-tag size="mini" :type="kindTag(scope.row.kind)">{{ scope.row.kind }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Durum" width="100">
              <template slot-scope="scope">
                <el-tag v-if="!scope.row.reachable" size="mini" type="danger">Down</el-tag>
                <el-tag v-else-if="scope.row.rate_limited" size="mini" type="warning">Rate-limited</el-tag>
                <el-tag v-else size="mini" type="success">OK</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="RTT (ms)" align="right">
              <template slot-scope="scope">
                <span :style="{ color: gradient(scoreLatency(scope.row.rtt_avg)) }">
                  {{ formatNum(scope.row.rtt_avg) }}
                </span>
                <small class="text-muted ml-1">
                  ({{ formatNum(scope.row.rtt_min) }} / {{ formatNum(scope.row.rtt_max) }})
                </small>
              </template>
            </el-table-column>
            <el-table-column prop="jitter" label="Jitter (ms)" align="right">
              <template slot-scope="scope">
                <span :style="{ color: gradient(scoreJitter(scope.row.jitter)) }">
                  {{ formatNum(scope.row.jitter) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="loss" label="Loss (%)" align="right">
              <template slot-scope="scope">
                <span :style="{ color: gradient(scoreLoss(scope.row.loss)) }">
                  {{ formatNum(scope.row.loss) }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- HISTORY GRAFİĞİ -->
        <el-card shadow="never">
          <div slot="header" class="d-flex align-items-center justify-content-between flex-wrap">
            <div class="text-sm">
              <ion-icon name="trending-up-outline"></ion-icon>
              Geçmiş Trend
              <span class="text-muted text-xs ml-2" v-if="history.points.length">
                ({{ history.points.length }} nokta)
              </span>
            </div>
            <div class="d-flex align-items-center" style="gap: 10px;">
              <el-radio-group v-model="historyRange" size="mini" @change="fetchHistory">
                <el-radio-button label="1h">1 saat</el-radio-button>
                <el-radio-button label="24h">24 saat</el-radio-button>
                <el-radio-button label="7d">7 gün</el-radio-button>
              </el-radio-group>
              <ion-icon
                name="information-circle-outline"
                class="kpi-info-icon"
                @click="openInfo('history')"
              ></ion-icon>
            </div>
          </div>

          <el-tabs v-model="historyTab" @tab-click="renderHistoryChart">
            <el-tab-pane
              v-for="tab in historyTabs"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            >
              <div v-if="historyLoading" class="text-center text-muted py-4">Yükleniyor...</div>
              <div v-else-if="!history.points.length" class="text-center text-muted py-4">
                Bu aralık için henüz veri yok. Collector dakikada 1 sample biriktiriyor — biraz sonra dolacak.
              </div>
              <apexchart
                v-else-if="historyTab === tab.name && chartReady"
                height="300"
                :options="chartOptions"
                :series="chartSeries"
              ></apexchart>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <div v-else-if="metricsLoading" class="text-center text-muted py-5">
        Yükleniyor...
      </div>

      <div v-else class="text-center text-muted py-5">
        <ion-icon name="cloud-offline-outline" style="font-size: 48px;"></ion-icon>
        <div class="mt-2">Bu sunucu için henüz veri toplanmadı veya collector çalışmıyor.</div>
      </div>

      <!-- Info Modal -->
      <!--
        append-to-body: ModuleHeader 'position: sticky; z-index: 999' kullanıyor.
        el-dialog default'ta parent component içinde render olur, bu durumda
        sticky header'ın stacking context'ine takılıp arkada kalıyor; siyah overlay
        body seviyesinde olduğu için içerik altta görünüyor. body'ye teleport
        ederek modal kendi temiz katmanına çıkar, z-index doğru sıralanır.
      -->
      <el-dialog
        :title="infoContent.title"
        :visible.sync="infoVisible"
        width="500px"
        :append-to-body="true"
        custom-class="network-monitor-info"
      >
        <div v-html="infoContent.body"></div>
      </el-dialog>
    </app-module-body>
  </app-module>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

const AUTO_REFRESH_MS = 15000;

function gradientColor(score) {
  if (score === null || score === undefined) return '#9e9e9e';
  const hue = 120 - (score * 120);
  return `hsl(${hue}, 70%, 42%)`;
}

function scoreLatency(v) {
  if (v === null || v === undefined) return null;
  return Math.min(Math.max(v / 200, 0), 1);
}
function scoreJitter(v) {
  if (v === null || v === undefined) return null;
  return Math.min(Math.max(v / 80, 0), 1);
}
function scoreLoss(v) {
  if (v === null || v === undefined) return null;
  return Math.min(Math.max(v / 10, 0), 1);
}
function scoreMos(v) {
  if (v === null || v === undefined) return null;
  return Math.min(Math.max((4.5 - v) / 3.5, 0), 1);
}

// Tab tanımları: hangi metric, history sample'da hangi field, x-axis unit, threshold ölçek
const HISTORY_TABS = [
  { name: 'latency', label: 'Latency',  field: 'latency_avg', unit: 'ms', score: scoreLatency, decimals: 1 },
  { name: 'jitter',  label: 'Jitter',   field: 'jitter_avg',  unit: 'ms', score: scoreJitter,  decimals: 1 },
  { name: 'loss',    label: 'Loss',     field: 'loss_avg',    unit: '%',  score: scoreLoss,    decimals: 2 },
  { name: 'mos',     label: 'MOS',      field: 'mos_avg',     unit: '',   score: scoreMos,     decimals: 2 },
];

const INFO_CONTENTS = {
  latency_ms: {
    title: 'Latency (Gecikme)',
    body: `<p>Sunucudan internete (8.8.8.8, 1.1.1.1, default gateway) gönderilen ICMP paketinin gidiş-dönüş süresi.</p>
<ul>
  <li><strong>0-50 ms:</strong> Mükemmel — ses gecikmesi hissedilmez</li>
  <li><strong>50-150 ms:</strong> Kabul edilebilir — hafif gecikme</li>
  <li><strong>150 ms+:</strong> Sesli görüşmede konuşmacıların birbirini kesmesine, doğal akışın bozulmasına yol açar</li>
</ul>
<p><em>Düşük olması iyi.</em></p>`,
  },
  jitter_ms: {
    title: 'Jitter (Kararsızlık)',
    body: `<p>Latency'nin örnekten örneğe değişkenliği. Gidiş-dönüş süresinin ne kadar kararsız olduğunu gösterir.</p>
<ul>
  <li><strong>0-20 ms:</strong> İyi — ses kararlı akar</li>
  <li><strong>20-50 ms:</strong> Orta — bazı kesintiler olabilir</li>
  <li><strong>50 ms+:</strong> Sesin kesik kesik gelmesi, robotik konuşma</li>
</ul>
<p><em>Düşük olması iyi.</em></p>`,
  },
  loss_pct: {
    title: 'Packet Loss (Paket Kaybı)',
    body: `<p>Gönderilen ICMP paketlerinden ne kadarının yanıt almadığı. Ağ üzerinde paket kayıplarının doğrudan göstergesi.</p>
<ul>
  <li><strong>0-1%:</strong> Normal — fark edilmez</li>
  <li><strong>1-5%:</strong> Sesli görüşmede heceler düşebilir</li>
  <li><strong>5%+:</strong> VoIP için kabul edilemez, görüşme kalitesi ciddi şekilde bozulur</li>
</ul>
<p><em>Düşük olması iyi.</em></p>`,
  },
  mos: {
    title: 'MOS (Mean Opinion Score)',
    body: `<p>ITU-T G.107 E-Model'e göre hesaplanan tahmini ses kalitesi skoru. Latency, jitter ve loss'tan türetilir.</p>
<ul>
  <li><strong>4.0-4.5:</strong> Mükemmel — toll-quality (operatör seviyesi)</li>
  <li><strong>3.5-4.0:</strong> İyi — telefon görüşmesi kalitesi</li>
  <li><strong>3.0-3.5:</strong> Kabul edilebilir</li>
  <li><strong>3.0 altı:</strong> Kullanıcılar şikayet eder</li>
</ul>
<p><em>Yüksek olması iyi (1.0 → 4.5 arası).</em></p>`,
  },
  nic: {
    title: 'NIC (Network Interface)',
    body: `<p>Sunucunun ağ kartı üzerindeki anlık trafik ve hata sayaçları.</p>
<ul>
  <li><strong>RX / TX (kbps):</strong> Saniyelik gelen / giden bant genişliği</li>
  <li><strong>Errors (s):</strong> Saniyede algılanan hatalı paket — fiziksel kablo/donanım sorununa işaret eder</li>
  <li><strong>Drops (s):</strong> Saniyede düşürülen paket — buffer overflow, DDoS veya CPU sıkışması belirtisi</li>
</ul>
<p>Errors ve Drops sürekli 0 kalmalı. Sıfırdan farklı kalıcı değer ağ donanımı veya kapasite sorunu işaretidir.</p>`,
  },
  asterisk: {
    title: 'Asterisk RTP',
    body: `<p>Asterisk üzerinde aktif çağrıların gerçek RTP medya akışından (paket-paket ses verisi) ölçülen kalite.</p>
<ul>
  <li><strong>Aktif:</strong> O an Asterisk'te konuşan toplam kanal sayısı</li>
  <li><strong>RTT:</strong> RTP paketinin uzak peer'a (operatör/kullanıcı) gidip gelme süresi</li>
  <li><strong>Jitter:</strong> RTP paketleri arası kararsızlık — yüksekse sesin titremesi</li>
  <li><strong>Loss:</strong> RTP'de kaybolan paket yüzdesi — direkt ses kesintisi</li>
</ul>
<p>Bu değerler ICMP ölçümünden farklı olabilir — RTP <strong>uçtan uca</strong> ses yolunu ölçer, ICMP sadece sunucu ↔ internet bağlantısını.</p>`,
  },
  probes: {
    title: 'Probe Hedefleri',
    body: `<p>Network sağlığını ölçmek için her 10 saniyede bir ping atılan hedefler. Sunucudan dışarıya farklı yönlerde paket gönderilir, sorunun sunucuda mı internette mi olduğunu ayırt etmek için.</p>
<ul>
  <li><strong>public_dns</strong> (8.8.8.8, 1.1.1.1) — Google ve Cloudflare DNS, internet bağlantı sağlığının referansı</li>
  <li><strong>gateway</strong> — Sunucunun bağlı olduğu yerel ağ kapısı, fiziksel ağ ölçümü</li>
  <li><strong>sip_provider</strong> — Operatör SIP sunucusu (env'den), trunk yolunun ölçümü</li>
</ul>
<p><strong>Durum etiketleri:</strong></p>
<ul>
  <li><strong>OK</strong> — Hedef yanıt veriyor</li>
  <li><strong>Down</strong> — Yanıt yok, hedef ulaşılamaz</li>
  <li><strong>Rate-limited</strong> — Hedef ICMP'yi yavaşlatıyor (Cloudflare gibi). Loss değeri yapay olarak yüksek görünür, dikkat edilmez</li>
</ul>`,
  },
  history: {
    title: 'Geçmiş Trend',
    body: `<p>Collector dakikada 1 aggregate sample yazar (10 saniyelik 6 örneğin ortalaması). Son 7 güne kadar tutulur, eski veri otomatik düşer.</p>
<ul>
  <li><strong>1 saat:</strong> Son 60 dakika — dakika çözünürlüğünde ham veri</li>
  <li><strong>24 saat:</strong> Son 24 saat — 5 dakikalık bucket'lara indirilir (288 nokta)</li>
  <li><strong>7 gün:</strong> Son 7 gün — 30 dakikalık bucket'lara indirilir (336 nokta)</li>
</ul>
<p>Yeni kurulan sistemde 1 saatten azı doluysa 1h sekmesinde sadece dolu kısım görünür. 24h ve 7d için yeterli veri birikinceye kadar kısa kalabilir.</p>`,
  },
};

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      servers: [],
      serversLoading: false,
      selectedServerKey: null,
      metrics: null,
      metricsLoading: false,
      autoRefresh: true,
      refreshTimer: null,
      tickTimer: null,
      now: Date.now(),
      infoVisible: false,
      infoContent: { title: '', body: '' },

      // History state
      historyRange: '24h',
      historyTab: 'latency',
      historyLoading: false,
      history: { range: null, points: [] },
      chartReady: true,
    };
  },
  computed: {
    historyTabs() {
      return HISTORY_TABS;
    },
    activeTabConfig() {
      return HISTORY_TABS.find(t => t.name === this.historyTab) || HISTORY_TABS[0];
    },
    chartSeries() {
      const cfg = this.activeTabConfig;
      const data = this.history.points.map(p => ({
        x: p.ts,
        y: p[cfg.field] === null ? null : Number(p[cfg.field]),
      }));
      return [{ name: cfg.label + (cfg.unit ? ' (' + cfg.unit + ')' : ''), data }];
    },
    chartOptions() {
      const cfg = this.activeTabConfig;
      const decimals = cfg.decimals;
      // Tek ham renk almıyoruz — her data point'in skoruna göre marker rengi
      // belirleyelim ki kötü zaman dilimleri grafikte göze batsın.
      const points = this.history.points;
      const fillColors = points.map(p => gradientColor(cfg.score(Number(p[cfg.field]))));
      return {
        chart: {
          id: 'network-monitor-' + cfg.name,
          type: 'area',
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },
          zoom: { enabled: false },
        },
        stroke: { curve: 'smooth', width: 2, colors: ['#409eff'] },
        dataLabels: { enabled: false },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
            datetimeFormatter: {
              hour: 'HH:mm',
              day: 'dd MMM',
            },
          },
        },
        yaxis: {
          decimalsInFloat: decimals,
          labels: {
            formatter: (v) => v === null ? '-' : Number(v).toFixed(decimals) + (cfg.unit ? ' ' + cfg.unit : ''),
          },
          min: cfg.name === 'mos' ? 1 : 0,
          max: cfg.name === 'mos' ? 4.5 : undefined,
        },
        tooltip: {
          x: { format: 'dd MMM HH:mm' },
          y: {
            formatter: (v) => v === null ? '-' : Number(v).toFixed(decimals) + (cfg.unit ? ' ' + cfg.unit : ''),
          },
        },
        markers: {
          size: 3,
          colors: fillColors,
          strokeColors: fillColors,
          strokeWidth: 0,
          hover: { sizeOffset: 2 },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [0, 100],
          },
          colors: ['#409eff'],
        },
        grid: {
          borderColor: '#eef0f2',
          strokeDashArray: 3,
        },
        // MOS için referans çizgi: 3.5 (telefon kalitesi alt sınırı)
        annotations: cfg.name === 'mos' ? {
          yaxis: [{ y: 3.5, borderColor: '#f5a623', label: { text: '3.5 (kabul sınırı)', style: { color: '#f5a623', background: 'transparent' } } }],
        } : {},
      };
    },
    lastUpdateText() {
      if (!this.metrics?.ts) return '-';
      const diffSec = Math.max(0, Math.floor((this.now - this.metrics.ts) / 1000));
      if (diffSec < 5) return 'şimdi';
      if (diffSec < 60) return `${diffSec} saniye önce`;
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)} dakika önce`;
      return new Date(this.metrics.ts).toLocaleString('tr-TR');
    },
    kpiCards() {
      const m = this.metrics || {};
      return [
        { key: 'latency_ms', label: 'Latency',     value: m.latency_ms, unit: 'ms', color: gradientColor(scoreLatency(m.latency_ms)) },
        { key: 'jitter_ms',  label: 'Jitter',      value: m.jitter_ms,  unit: 'ms', color: gradientColor(scoreJitter(m.jitter_ms)) },
        { key: 'loss_pct',   label: 'Packet Loss', value: m.loss_pct,   unit: '%',  color: gradientColor(scoreLoss(m.loss_pct)) },
        { key: 'mos',        label: 'MOS',         value: m.mos,        unit: '',   color: gradientColor(scoreMos(m.mos)) },
      ];
    },
  },
  created() {
    this.fetchServers();
    this.tickTimer = setInterval(() => { this.now = Date.now(); }, 1000);
    this.startAutoRefresh();
  },
  beforeDestroy() {
    this.stopAutoRefresh();
    if (this.tickTimer) clearInterval(this.tickTimer);
  },
  methods: {
    fetchServers() {
      this.serversLoading = true;
      this.$api.get('reports/network-monitor/servers', null, (resp) => {
        this.servers = resp.data.data || [];
        this.serversLoading = false;
        if (this.servers.length === 1) {
          this.selectedServerKey = this.servers[0].key;
          this.refreshAll();
        }
      }, () => {
        this.serversLoading = false;
      });
    },
    fetchMetrics() {
      if (!this.selectedServerKey) return;
      this.metricsLoading = true;
      this.$api.get('reports/network-monitor', { server_key: this.selectedServerKey }, (resp) => {
        this.metrics = resp.data.data;
        this.metricsLoading = false;
      }, () => {
        this.metrics = null;
        this.metricsLoading = false;
      });
    },
    fetchHistory() {
      if (!this.selectedServerKey) return;
      this.historyLoading = true;
      this.$api.get('reports/network-monitor/history', {
        server_key: this.selectedServerKey,
        range: this.historyRange,
      }, (resp) => {
        this.history = resp.data.data;
        this.historyLoading = false;
        // ApexChart series değişikliğini bazı durumlarda tutarlı render için
        // chart'ı kısaca destroy/remount: key tabanlı yeniden binding.
        this.renderHistoryChart();
      }, () => {
        this.history = { range: null, points: [] };
        this.historyLoading = false;
      });
    },
    refreshAll() {
      this.fetchMetrics();
      this.fetchHistory();
    },
    onServerChange() {
      this.refreshAll();
    },
    startAutoRefresh() {
      this.stopAutoRefresh();
      if (!this.autoRefresh) return;
      this.refreshTimer = setInterval(() => {
        this.refreshAll();
      }, AUTO_REFRESH_MS);
    },
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
    toggleAutoRefresh(val) {
      if (val) this.startAutoRefresh();
      else this.stopAutoRefresh();
    },
    renderHistoryChart() {
      // Tab değişiminde chart'ı zorla yeniden mount et — tab içeriği lazy
      // render'lı, ApexChart bazı seri/option değişimlerinde animation yapıyor.
      this.chartReady = false;
      this.$nextTick(() => { this.chartReady = true; });
    },
    openInfo(key) {
      const c = INFO_CONTENTS[key];
      if (!c) return;
      this.infoContent = c;
      this.infoVisible = true;
    },
    formatNum(v) {
      if (v === null || v === undefined || Number.isNaN(v)) return '-';
      return typeof v === 'number' ? v.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) : v;
    },
    kindTag(kind) {
      if (kind === 'public_dns') return 'info';
      if (kind === 'sip_provider') return 'success';
      return '';
    },
    gradient: gradientColor,
    scoreLatency,
    scoreJitter,
    scoreLoss,
  },
};
</script>

<style scoped>
.kpi-card {
  transition: box-shadow 0.2s;
}
.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.kpi-info-icon {
  font-size: 16px;
  color: #b0b0b0;
  cursor: pointer;
  transition: color 0.15s;
}
.kpi-info-icon:hover {
  color: #409eff;
}
.kpi-value {
  font-weight: 600;
  transition: color 0.4s ease;
}
</style>
