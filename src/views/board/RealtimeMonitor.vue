<template>
    <app-module>
        <app-module-header></app-module-header>
        <app-module-body>
            <div class="app-module-frame">
                <div class="app-module-main">
                    <div v-if="loading.init" class="card-body p-3 text-center">
                        <small>Yükleniyor...</small>
                    </div>
                    <div v-else>

                        <!-- ── ÜST SEKMELER (GÖRÜNÜM KONTROLÜ) ── -->
                        <div class="row row-sm app-table-filter-bar mb-3 align-items-center justify-content-between">
                            <div class="col-auto">
                                <div class="app-module-toolbar bg-white pb-0 pt-0 position-relative">
                                    <el-radio-group v-model="activeTab" size="mini">
                                        <el-radio-button label="all">Tümü</el-radio-button>
                                        <el-radio-button label="callsOnly">Çağrı Trafiği</el-radio-button>
                                        <el-radio-button label="agentsOnly">Müşteri Temsilcisi</el-radio-button>
                                        <el-radio-button label="chartsOnly">Birleşik Grafik</el-radio-button>
                                        <el-radio-button label="listsOnly">Birleşik Liste</el-radio-button>
                                    </el-radio-group>
                                </div>
                            </div>
                            <div class="col-auto d-flex align-items-center">
                                <strong class="text-label text-muted mr-2 text-nowrap">Operasyon</strong>
                                <el-select
                                    v-model="globalNumberFilter"
                                    clearable
                                    size="medium"
                                    placeholder="Tüm Operasyonlar"
                                    style="width: 220px;">
                                    <el-option
                                        v-for="num in numbers"
                                        :key="num.id"
                                        :value="num.id"
                                        :label="num.name">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <div class="row row-sm">
                            <!-- Sol: Ajan Grafiği -->
                            <div :class="agentChartCol" v-show="showAgentChart">
                                <app-card :remove-body-padding="true" style="height: 100%;">
                                    <div class="px-4 pt-3 pb-2">
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                            <strong class="text-label text-muted">Müşteri Temsilcisi</strong>
                                            <span class="badge badge-pill bg-light">
                                                <ion-icon name="people-outline" class="mr-1"></ion-icon>
                                                {{ onlineUsers.length }} / {{ users.length }}
                                            </span>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between flex-wrap rm-chart-filters">
                                            <el-radio-group size="mini" v-model="agentChartDirection" class="app-call-chart">
                                                <el-radio-button :label="null">Tümü</el-radio-button>
                                                <el-radio-button label="in">Gelen</el-radio-button>
                                                <el-radio-button label="out">Giden</el-radio-button>
                                            </el-radio-group>
                                            <el-radio-group size="mini" v-model="agentChartType" class="app-call-chart">
                                                <el-radio-button label="simple">Basit</el-radio-button>
                                                <el-radio-button label="advanced">Gelişmiş</el-radio-button>
                                            </el-radio-group>
                                        </div>
                                    </div>
                                    <div class="px-3 pb-3">
                                        <!-- ── GRAFİK ── -->
                                        <div v-if="onlineUsers.length === 0" class="d-flex flex-column align-items-center justify-content-center text-muted" style="height: 240px;">
                                            <app-svg style="height: 90px; opacity: 0.5;" class="mb-3" src="/assets/img/vectors/users.svg"></app-svg>
                                            <small class="font-weight-bold">Çevrimiçi ajan bulunmuyor</small>
                                        </div>

                                        <!-- Gelişmiş: iç içe iki halka -->
                                        <div v-else-if="agentChartType === 'advanced'" class="rm-chart-wrap">
                                            <div class="rm-chart-outer">
                                                <apexchart type="donut" width="260" height="260" :options="advancedOuterOptions" :series="advancedOuterSeries"></apexchart>
                                            </div>
                                            <div class="rm-chart-inner">
                                                <apexchart type="donut" width="180" height="180" :options="advancedInnerOptions" :series="advancedInnerSeries"></apexchart>
                                            </div>
                                        </div>

                                        <!-- Basit / Karmaşık: tek halka -->
                                        <div v-else class="rm-chart-wrap">
                                            <apexchart type="donut" width="260" height="260" :options="singleChartOptions" :series="singleChartSeries"></apexchart>
                                        </div>

                                        <!-- ── ÇAĞRI DURUMU STAT KARTLARI ── -->
                                        <template v-if="callStateCards.length > 0">
                                            <div class="rm-stat-label">
                                                <ion-icon name="radio-outline" class="mr-1"></ion-icon> Çağrı Durumu
                                            </div>
                                            <div class="row row-sm mb-1">
                                                <div v-for="(stat, i) in callStateCards" :key="'cs-' + i" class="col-6 mb-2">
                                                    <div class="rm-stat-card pointer"
                                                         :class="{ 'rm-stat-card--active': agentFilter.status === stat.key }"
                                                         @click="toggleAgentFilter(stat.key)">
                                                        <span class="rm-stat-dot" :style="{ background: stat.color }"></span>
                                                        <div>
                                                            <strong class="rm-stat-count">{{ stat.count }}</strong>
                                                            <div><small class="text-muted" style="font-size:10px">{{ stat.label }}</small></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>

                                        <!-- ── DİĞER DURUMLAR STAT KARTLARI ── -->
                                        <template v-if="otherStateCards.length > 0">
                                            <div class="rm-stat-label mt-1">
                                                <ion-icon name="briefcase-outline" class="mr-1"></ion-icon> Diğer Durumlar
                                            </div>
                                            <div class="row row-sm">
                                                <div v-for="(stat, i) in otherStateCards" :key="'os-' + i" class="col-6 mb-2">
                                                    <div class="rm-stat-card pointer"
                                                         :class="{ 'rm-stat-card--active': agentFilter.status === stat.key }"
                                                         @click="toggleAgentFilter(stat.key)">
                                                        <span class="rm-stat-dot" :style="{ background: stat.color }"></span>
                                                        <div>
                                                            <strong class="rm-stat-count">{{ stat.count }}</strong>
                                                            <div><small class="text-muted" style="font-size:10px">{{ stat.label }}</small></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </app-card>
                            </div>

                            <!-- Sağ: Ajan Listesi -->
                            <div :class="agentListCol" v-show="showAgentList">
                                <app-card :remove-body-padding="true" class="rm-card-fill" style="height: 100%;">
                                    <div class="px-4 pt-3 pb-2 row">
                                        <div class="col">
                                            <strong class="text-label text-muted">Müşteri Temsilcisi</strong>
                                        </div>
                                        <div class="col-auto app-call-chart">
                                            <el-radio-group size="mini" v-model="agentFilter.onlineOnly">
                                                <el-radio-button :label="true">Çevrim İçi</el-radio-button>
                                                <el-radio-button :label="false">Tümü</el-radio-button>
                                            </el-radio-group>
                                        </div>
                                    </div>

                                    <div class="app-simple-table rm-list-body">
                                        <el-table size="small" :data="filteredAgents" style="width: 100%" height="100%">
                                            <el-table-column min-width="150" label="Kullanıcı" fixed="left">
                                                <template slot-scope="scope">
                                                    <div class="d-flex align-items-center">
                                                        <div style="width: 10px; height: 20px; border-radius: 0 10px 10px 0; margin-right: 12px; margin-left: -10px;" :class="getAgentStatusColor(scope.row)"></div>
                                                        <span class="d-block" v-if="scope.row.user" style="font-size: 13px; font-weight: 500;">
                                                            {{ scope.row.user.name }} {{ scope.row.user.surname }}
                                                        </span>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Durum" min-width="120">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.state && scope.row.state.name" class="badge badge-pill badge-light" style="font-size: 11.5px;">
                                                        {{ scope.row.state.name }}
                                                    </span>
                                                    <span v-else class="text-muted small">—</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Kuyruk" min-width="120">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.queue && scope.row.queue.name" class="small">
                                                        {{ scope.row.queue.name }}
                                                    </span>
                                                    <span v-else class="text-muted small">—</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="Operasyon" min-width="110">
                                                <template slot-scope="scope">
                                                    <span v-if="resolveAgentNumber(scope.row)" class="small">
                                                        <ion-icon name="cellular-outline" class="mr-1 text-muted"></ion-icon>{{ resolveAgentNumber(scope.row) }}
                                                    </span>
                                                    <span v-else class="text-muted small">—</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column fixed="right" align="right" min-width="160">
                                                <template slot-scope="scope">
                                                    <span class="badge badge-pill text-dark"
                                                          style="font-size: 11.5px;"
                                                          :class="getAgentCallStatusBadge(scope.row)">
                                                        {{ getAgentCallStatusLabel(scope.row) }}
                                                        <span v-if="scope.row.started_at">
                                                            &bull;
                                                            <app-date-range-text :start-date="scope.row.started_at" :end-date="now.toString()"></app-date-range-text>
                                                        </span>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </app-card>
                            </div>

                            <!-- Sol: Çağrı Grafiği -->
                            <div :class="callChartCol" v-show="showCallChart">
                                <app-card :remove-body-padding="true" style="height: 100%;">
                                    <div class="px-4 pt-3 pb-2">
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                            <strong class="text-label text-muted">Çağrı Trafiği</strong>
                                            <span class="badge badge-pill bg-light">
                                                <ion-icon name="call-outline" class="mr-1"></ion-icon>
                                                {{ activeCalls.length }}
                                            </span>
                                        </div>
                                        <div class="d-flex align-items-center rm-chart-filters">
                                            <el-radio-group size="mini" v-model="callFilter.direction" class="app-call-chart">
                                                <el-radio-button :label="null">Tümü</el-radio-button>
                                                <el-radio-button label="in">Gelen</el-radio-button>
                                                <el-radio-button label="out">Giden</el-radio-button>
                                            </el-radio-group>
                                        </div>
                                    </div>
                                    <div class="px-4 pb-3">
                                        <div v-if="callChartVisible" class="rm-chart-wrap">
                                            <apexchart type="donut" width="260" height="260" :options="callChartOptions" :series="callChartSeries"></apexchart>
                                        </div>
                                        <div v-else class="d-flex flex-column align-items-center justify-content-center text-muted" style="height: 240px; margin-bottom: 0.5rem">
                                            <app-svg style="height: 100px; opacity: 0.6;" class="mb-3" src="/assets/img/vectors/board-calls.svg"></app-svg>
                                            <small class="font-weight-bold">Aktif çağrı bulunmuyor</small>
                                        </div>

                                        <div class="rm-stat-label mt-3">
                                            <ion-icon name="radio-outline" class="mr-1"></ion-icon> Çağrı Durumu
                                        </div>
                                        <div class="row row-sm">
                                            <div v-for="(stat, i) in callStats" :key="'cstat-' + i" class="col-6 mb-2">
                                                <div class="d-flex bg-light r-3x p-2 pointer"
                                                     :class="{ 'border border-primary': callFilter.state === stat.key }"
                                                     @click="toggleCallFilter(stat.key)"
                                                     style="border: 1px solid transparent;">
                                                    <span class="w-40 avatar bg-white b-a i-con-h-a" style="min-width:40px">
                                                        <h6 class="mb-0">
                                                            <ion-icon :name="stat.icon" :class="stat.class"></ion-icon>
                                                        </h6>
                                                    </span>
                                                    <div class="mx-2">
                                                        <strong style="font-size:18px">{{ stat.count }}</strong>
                                                        <div>
                                                            <small class="text-muted" style="font-size:10px">{{ stat.label }}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </app-card>
                            </div>

                            <!-- Sağ: Çağrı Listesi -->
                            <div :class="callListCol" v-show="showCallList">
                                <app-card :remove-body-padding="true" class="rm-card-fill" style="height: 100%;">
                                    <div class="px-4 pt-3 pb-2 row">
                                        <div class="col">
                                            <strong class="text-label text-muted">Aktif Çağrılar</strong>
                                        </div>
                                        <div class="col-auto app-call-chart">
                                            <el-radio-group size="mini" v-model="callFilter.direction">
                                                <el-radio-button :label="null">Tümü</el-radio-button>
                                                <el-radio-button label="in">Gelen</el-radio-button>
                                                <el-radio-button label="out">Giden</el-radio-button>
                                            </el-radio-group>
                                        </div>
                                    </div>

                                    <!-- Filter tags for numbers (if needed) -->
                                    <div class="px-4 py-2 border-bottom d-flex align-items-center" v-if="numbersWithCalls.length > 0" style="overflow-x: auto;">
                                        <span class="text-muted mr-3" style="font-size: 12px; font-weight: 600;"><ion-icon name="filter-outline" class="mr-1"></ion-icon>Hatlar:</span>
                                        <span v-for="(num, i) in numbersWithCalls" :key="'num-' + i" 
                                              class="badge badge-pill mr-2 px-2 py-1 pointer"
                                              :class="callFilter.numberId === num.id ? 'badge-primary' : 'bg-light text-dark'"
                                              @click="callFilter.numberId = callFilter.numberId === num.id ? null : num.id">
                                            {{ num.name }}
                                            <span class="badge badge-sm bg-white badge-pill text-dark ml-1">{{ num.count }}</span>
                                        </span>
                                    </div>

                                    <div v-if="filteredCalls.length === 0" class="rm-list-body p-4 d-flex align-items-center justify-content-center">
                                        <div class="text-center">
                                            <app-svg class="col-3 mx-auto" src="/assets/img/vectors/board-calls.svg"></app-svg>
                                            <h6 class="font-weight-bold">Aktif çağrı bulunmuyor</h6>
                                            <span>Herhangi bir aktif çağrı bulunduğunda bu alanda görüntüleyebileceksiniz.</span>
                                        </div>
                                    </div>
                                    <div v-else class="app-simple-table rm-list-body">
                                        <el-table size="small" :data="filteredCalls" style="width: 100%" height="100%">
                                            <el-table-column header-align="left" label="Yön" width="80">
                                                <template slot-scope="scope">
                                                    <span class="w-36 avatar bg-light circle">
                                                        <ion-icon style="font-size:18px" name="call" class="text-muted"></ion-icon>
                                                        <ion-icon :name="scope.row.direction === 'out' ? 'arrow-redo' : 'arrow-undo'"
                                                                  class="text-muted"
                                                                  style="font-size:12px;position:absolute; top:6px; right:7px;"></ion-icon>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column header-align="left" label="Arayan / Aranan" min-width="140">
                                                <template slot-scope="scope">
                                                    <span style="font-size:13px; font-weight:500;">
                                                        <span v-if="scope.row.direction === 'in'">{{ scope.row.from }}</span>
                                                        <span v-else>{{ scope.row.to }}</span>
                                                    </span>
                                                    <small class="sub-item text-muted d-block mt-1">
                                                        <span v-if="scope.row.direction === 'in'">Gelen</span>
                                                        <span v-else>Giden</span>
                                                        <span class="ml-2" v-if="scope.row.user && scope.row.user.name">
                                                            <ion-icon name="person-outline" class="mr-1"></ion-icon>{{ scope.row.user.name }} {{ scope.row.user.surname }}
                                                        </span>
                                                    </small>
                                                </template>
                                            </el-table-column>
                                            <el-table-column header-align="left" label="Kuyruk" min-width="110">
                                                <template slot-scope="scope">
                                                    <span v-if="resolveQueue(scope.row)" class="small">
                                                        <ion-icon name="people-outline" class="mr-1 text-muted"></ion-icon>{{ resolveQueue(scope.row) }}
                                                    </span>
                                                    <span v-else class="text-muted small">—</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column header-align="left" label="Operasyon" min-width="110">
                                                <template slot-scope="scope">
                                                    <span v-if="resolveNumber(scope.row)" class="small">
                                                        <ion-icon name="cellular-outline" class="mr-1 text-muted"></ion-icon>{{ resolveNumber(scope.row) }}
                                                    </span>
                                                    <span v-else class="text-muted small">—</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column fixed="right" header-align="left" align="right" label="Durum" min-width="170">
                                                <template slot-scope="scope">
                                                    <span class="badge badge-md badge-pill text-dark"
                                                          :class="getCallStateBadge(scope.row.current_state)">
                                                          {{ getCallStateLabel(scope.row.current_state) }} &bull;
                                                        <app-date-range-text v-if="scope.row.started_at" :start-date="scope.row.started_at" :end-date="now.toString()"></app-date-range-text>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </app-card>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </app-module-body>
    </app-module>
</template>

<script>
import { mapGetters } from 'vuex';
import VueApexCharts from 'vue-apexcharts';

const CALL_CHART_COLORS = ['#3ED96A', '#3C81FA', '#FFA21D', '#FE4D62'];

// Apexcharts varsayılan hover (lighten) açık grileri beyaza çekiyor.
// Hover'ı tamamen kaldır; sadece tıklanan (active) dilim hafifçe koyulaşsın.
const AGENT_CHART_STATES = {
    normal: { filter: { type: 'none' } },
    hover:  { filter: { type: 'none' } },
    active: { allowMultipleDataPointsSelection: false, filter: { type: 'darken', value: 0.08 } },
};

const AGENT_PALETTE = {
    // Role agregat (Gelişmiş dış halka)
    inbound:  '#3ED96A',
    outbound: '#3C81FA',
    // Call state (Basit + Gelişmiş iç halka + tüm stat kartları)
    // avail = bekliyor → kırmızı, ringing = çalışıyor → mavi, incall = çağrıda → yeşil
    avail:   '#FE4D62',
    ringing: '#3C81FA',
    incall:  '#3ED96A',
    // Sabit
    hatta:   '#ADB5BD',
};

export default {
    components: { apexchart: VueApexCharts },

    data() {
        return {
            now: new Date(),
            loading: { init: false },
            timer: null,
            activeTab: 'all', // all, callsOnly, agentsOnly, chartsOnly, listsOnly

            // Veri
            users:   [],
            calls:   [],
            numbers: [],

            // Lookup maps
            queuesMap:      {},
            queuesNameMap:  {},
            numbersMap:     {},
            numbersNameMap: {},
            numbersDigitsMap: {},  // n.number (DID rakamları) → nesne
            statesMap:      {},

            globalNumberFilter: null,
            agentChartType:      'simple',    // 'simple' | 'advanced'
            agentChartDirection: null,        // null (all) | 'in' | 'out'
            agentFilter: { onlineOnly: false, status: null },
            callFilter:  { direction: null, state: null, numberId: null },
        };
    },

    computed: {
        ...mapGetters(['socket', 'currentUser']),

        // ── Görünüm Kontrolleri (Sekmeler) ──────────────────────────
        showAgentChart() { return ['all', 'agentsOnly', 'chartsOnly'].includes(this.activeTab); },
        showAgentList()  { return ['all', 'agentsOnly', 'listsOnly'].includes(this.activeTab); },
        showCallChart()  { return ['all', 'callsOnly', 'chartsOnly'].includes(this.activeTab); },
        showCallList()   { return ['all', 'callsOnly', 'listsOnly'].includes(this.activeTab); },
        
        agentChartCol() { return this.activeTab === 'chartsOnly' ? 'col-md-6 mb-3' : 'col-xl-4 col-md-5 mb-3'; },
        agentListCol()  { return this.activeTab === 'listsOnly' ? 'col-xl-6 col-12 mb-3' : 'col-xl-8 col-md-7 mb-3'; },
        callChartCol()  { return this.activeTab === 'chartsOnly' ? 'col-md-6 mb-3' : 'col-xl-4 col-md-5 mb-3'; },
        callListCol()   { return this.activeTab === 'listsOnly' ? 'col-xl-6 col-12 mb-3' : 'col-xl-8 col-md-7 mb-3'; },

        // ── Online kullanıcılar ─────────────────────────────────────
        onlineUsers() {
            let online = this.users.filter(u => u.is_online);
            if (this.globalNumberFilter) {
                online = online.filter(u => this.getAgentNumberId(u) == this.globalNumberFilter);
            }
            return online;
        },

        activeCalls() {
            let active = this.calls.filter(c => c.current_state !== 'hangup');
            if (this.globalNumberFilter) {
                active = active.filter(c => this.getCallNumberId(c) == this.globalNumberFilter);
            }
            if (this.callFilter.direction) {
                active = active.filter(c => c.direction === this.callFilter.direction);
            }
            return active;
        },

        // ── State → Renk haritası (deterministic, statesMap'ten türer) ──
        // Bilinen makine anahtarları (state.state) için sabit semantik renk;
        // diğerleri için state.id sıra sayısına göre fallback paletinden seçilir.
        // Ajanın online olup olmamasından bağımsız → renkler asla kaymaz.
        stateColorMap() {
            // mola/toplantı/yemek/sağlık → sarı ailesi (farklı tonlar, aynı sıcaklık)
            const semantic = {
                inbound:  AGENT_PALETTE.inbound,
                outbound: AGENT_PALETTE.outbound,
                break:    '#FFB703',  // amber
                meeting:  '#DAA520',  // goldenrod (koyu hardal)
                eat:      '#F4D03F',  // limon sarısı (parlak/açık)
                healt:    '#E8A317',  // derin amber
            };
            const fallback = ['#9D4EDD', '#48CAE4', '#FFB703', '#F48C06', '#06B6D4', '#FF6B9D'];
            const ids = Object.keys(this.statesMap).map(Number).sort((a, b) => a - b);
            const map = {};
            let idx = 0;
            ids.forEach(id => {
                const s = this.statesMap[id];
                if (s.state && semantic[s.state]) {
                    map[id] = semantic[s.state];
                } else {
                    map[id] = fallback[idx % fallback.length];
                    idx++;
                }
            });
            return map;
        },

        // ── Agent state çekirdek veri seti ──────────────────────────
        // Her ajan tek bir kovaya düşer (partition):
        //   - inbound role × {avail, ringing, incall}
        //   - outbound role × {avail, ringing, incall}
        //   - diğer custom state'ler (break, meeting, ...) — call_status'tan bağımsız
        //   - hatta-değil: online ama state yok
        agentBuckets() {
            const online = this.onlineUsers;
            const isInbound  = (u) => u.state && u.state.state === 'inbound';
            const isOutbound = (u) => u.state && u.state.state === 'outbound';
            const isOtherCustom = (u) => u.state && u.state.id && !isInbound(u) && !isOutbound(u);
            const isUnassigned  = (u) => !u.state || !u.state.id;

            const callStates = ['avail', 'ringing', 'incall'];
            const buckets = { inbound: {}, outbound: {} };
            callStates.forEach(cs => {
                buckets.inbound[cs]  = online.filter(u => isInbound(u)  && u.call_status === cs).length;
                buckets.outbound[cs] = online.filter(u => isOutbound(u) && u.call_status === cs).length;
            });

            const otherStates = [];
            const seen = new Set();
            online.filter(isOtherCustom).forEach(u => {
                if (seen.has(u.state.id)) return;
                seen.add(u.state.id);
                const count = online.filter(o => o.state && o.state.id === u.state.id).length;
                otherStates.push({
                    id: u.state.id,
                    name: u.state.name,
                    count,
                    color: this.stateColorMap[u.state.id] || AGENT_PALETTE.hatta,
                });
            });

            return {
                callStates: buckets,
                otherStates,
                hattaDegil: online.filter(isUnassigned).length,
                inboundTotal:  online.filter(isInbound).length,
                outboundTotal: online.filter(isOutbound).length,
            };
        },

        // ── Çağrı durumu stat kartları (Çağrı Durumu grubu) ─────────
        // Direction filter aktifse ilgili sütunu gizler.
        // Renk yön'e göre değil, call_state'e göre — tüm "Çağrıda" yeşil,
        // tüm "Çalışıyor" mavi, tüm "Bekliyor" kırmızı.
        callStateCards() {
            const b = this.agentBuckets.callStates;
            const dir = this.agentChartDirection;
            const cards = [];
            const meta = [
                { cs: 'incall',  label: 'Çağrıda',   color: AGENT_PALETTE.incall  },
                { cs: 'ringing', label: 'Çalışıyor', color: AGENT_PALETTE.ringing },
                { cs: 'avail',   label: 'Bekliyor',  color: AGENT_PALETTE.avail   },
            ];
            meta.forEach(m => {
                if (dir !== 'out' && b.inbound[m.cs] > 0) {
                    cards.push({ key: `${m.cs}-in`, label: `${m.label} · Gelen`, color: m.color, count: b.inbound[m.cs] });
                }
                if (dir !== 'in' && b.outbound[m.cs] > 0) {
                    cards.push({ key: `${m.cs}-out`, label: `${m.label} · Giden`, color: m.color, count: b.outbound[m.cs] });
                }
            });
            return cards;
        },

        // ── Diğer durumlar stat kartları (break/meeting/custom + hatta-değil) ──
        otherStateCards() {
            const cards = [];
            this.agentBuckets.otherStates.forEach(s => {
                cards.push({ key: `state_${s.id}`, label: s.name, color: s.color, count: s.count });
            });
            if (this.agentBuckets.hattaDegil > 0) {
                cards.push({ key: 'hatta_degil', label: 'Hatta Değil', color: AGENT_PALETTE.hatta, count: this.agentBuckets.hattaDegil });
            }
            return cards;
        },

        // ── BASİT GRAFİK: avail/ringing/incall (yön birleştirilmiş) + custom + hatta-değil ──
        simpleSlices() {
            const b = this.agentBuckets.callStates;
            const dir = this.agentChartDirection;
            const slices = [];
            const csList = [
                { cs: 'incall',  label: 'Çağrıda',   color: AGENT_PALETTE.incall  },
                { cs: 'ringing', label: 'Çalışıyor', color: AGENT_PALETTE.ringing },
                { cs: 'avail',   label: 'Bekliyor',  color: AGENT_PALETTE.avail   },
            ];
            csList.forEach(m => {
                const count = (dir !== 'out' ? b.inbound[m.cs] : 0) + (dir !== 'in' ? b.outbound[m.cs] : 0);
                if (count > 0) slices.push({ key: m.cs, label: m.label, color: m.color, count });
            });
            this.agentBuckets.otherStates.forEach(s => {
                slices.push({ key: `state_${s.id}`, label: s.name, color: s.color, count: s.count });
            });
            if (this.agentBuckets.hattaDegil > 0) {
                slices.push({ key: 'hatta_degil', label: 'Hatta Değil', color: AGENT_PALETTE.hatta, count: this.agentBuckets.hattaDegil });
            }
            return slices;
        },

        // ── GELİŞMİŞ GRAFİK: dış halka = role aggregate, iç halka = call_state aggregate ──
        advancedOuterSlices() {
            const b = this.agentBuckets;
            const dir = this.agentChartDirection;
            const slices = [];
            if (dir !== 'out' && b.inboundTotal > 0) {
                slices.push({ key: 'inbound', label: 'Gelen', color: AGENT_PALETTE.inbound, count: b.inboundTotal });
            }
            if (dir !== 'in' && b.outboundTotal > 0) {
                slices.push({ key: 'outbound', label: 'Giden', color: AGENT_PALETTE.outbound, count: b.outboundTotal });
            }
            b.otherStates.forEach(s => {
                slices.push({ key: `state_${s.id}`, label: s.name, color: s.color, count: s.count });
            });
            if (b.hattaDegil > 0) {
                slices.push({ key: 'hatta_degil', label: 'Hatta Değil', color: AGENT_PALETTE.hatta, count: b.hattaDegil });
            }
            return slices;
        },

        advancedInnerSlices() {
            const b = this.agentBuckets.callStates;
            const dir = this.agentChartDirection;
            const slices = [];
            const order = [
                { cs: 'incall',  label: 'Çağrıda',   color: AGENT_PALETTE.incall  },
                { cs: 'ringing', label: 'Çalışıyor', color: AGENT_PALETTE.ringing },
                { cs: 'avail',   label: 'Bekliyor',  color: AGENT_PALETTE.avail   },
            ];
            order.forEach(m => {
                const count = (dir !== 'out' ? b.inbound[m.cs] : 0) + (dir !== 'in' ? b.outbound[m.cs] : 0);
                if (count > 0) slices.push({ key: m.cs, label: m.label, color: m.color, count });
            });
            return slices;
        },

        // ── Call stats kartları ─────────────────────────────────────
        callStats() {
            const active = this.activeCalls;
            return [
                {
                    key: 'incall',
                    label: 'Çağrıda',
                    icon: 'call',
                    class: 'text-success',
                    count: active.filter(c => c.current_state === 'incall').length,
                },
                {
                    key: 'ringing',
                    label: 'Çalıyor',
                    icon: 'musical-note-outline',
                    class: 'text-primary',
                    count: active.filter(c => c.current_state === 'ringing' || c.current_state === 'calling').length,
                },
                {
                    key: 'queuei',
                    label: 'Kuyruk',
                    icon: 'people',
                    class: 'text-warning',
                    count: active.filter(c => c.current_state === 'queuei').length,
                },
                {
                    key: 'ivr',
                    label: 'IVR',
                    icon: 'cellular',
                    class: 'text-danger',
                    count: active.filter(c => c.current_state === 'ivr').length,
                },
            ];
        },

        // ── Filtreli tablolar ───────────────────────────────────────
        filteredAgents() {
            let list = this.users.filter(u => {
                if (this.globalNumberFilter && this.getAgentNumberId(u) != this.globalNumberFilter) return false;
                if (this.agentFilter.onlineOnly && !u.is_online) return false;

                const status = this.agentFilter.status;
                if (!status) return true;

                // Yön + call_state (Karmaşık grafik / Çağrı Durumu kartları)
                const dirMatch = status.match(/^(avail|ringing|incall)-(in|out)$/);
                if (dirMatch) {
                    const role = dirMatch[2] === 'in' ? 'inbound' : 'outbound';
                    return u.state && u.state.state === role && u.call_status === dirMatch[1];
                }

                // Yön bağımsız call_state (Basit grafik / Gelişmiş iç halka)
                if (['avail', 'ringing', 'incall'].includes(status)) {
                    return u.call_status === status;
                }

                // Role agregat (Gelişmiş dış halka)
                if (status === 'inbound' || status === 'outbound') {
                    return u.state && u.state.state === status;
                }

                // Custom state (break, meeting, ...)
                if (status.startsWith('state_')) {
                    const sId = parseInt(status.replace('state_', ''));
                    return u.state && u.state.id === sId;
                }

                // Hatta değil
                if (status === 'hatta_degil') {
                    return !u.state || !u.state.id;
                }

                return false;
            });

            // Order by status importance
            const statusWeight = {
                'incall': 1,
                'ringing': 2,
                'avail': 3,
                'break': 4,
            };
            
            return list.sort((a, b) => {
                // Online olanlar başta
                if (a.is_online !== b.is_online) return a.is_online ? -1 : 1;
                
                // Statülere göre sıralama
                const wA = statusWeight[a.call_status] || (a.is_online ? (a.state && a.state.name ? 3 : 5) : 6);
                const wB = statusWeight[b.call_status] || (b.is_online ? (b.state && b.state.name ? 3 : 5) : 6);
                
                if (wA !== wB) return wA - wB;
                
                // Aynı statüde olanlar için isime göre
                if (a.user && b.user && a.user.name && b.user.name) {
                    return a.user.name.localeCompare(b.user.name);
                }
                return 0;
            });
        },

        filteredCalls() {
            return this.activeCalls.filter(c => {
                if (this.callFilter.state) {
                    const state = this.callFilter.state;
                    if (state === 'ringing') {
                        if (c.current_state !== 'ringing' && c.current_state !== 'calling') return false;
                    } else if (state === 'queuei') {
                        if (c.current_state !== 'queuei') return false;
                    } else if (c.current_state !== state) {
                        return false;
                    }
                }
                if (this.callFilter.numberId !== null) {
                    if (this.getCallNumberId(c) !== this.callFilter.numberId) return false;
                }
                return true;
            });
        },

        numbersWithCalls() {
            const map = {};
            this.activeCalls.forEach(c => {
                const id   = this.getCallNumberId(c);
                const name = this.resolveNumber(c);
                if (id && name) {
                    if (!map[id]) map[id] = { id, name, count: 0 };
                    map[id].count++;
                }
            });
            return Object.values(map);
        },

        // ── Agent chart series & options ────────────────────────────
        singleChartSlices() { return this.simpleSlices; },
        singleChartSeries() { return this.singleChartSlices.map(s => s.count); },
        singleChartOptions() {
            const vm = this;
            const total = this.onlineUsers.length;
            return {
                chart: {
                    type: 'donut',
                    events: {
                        dataPointSelection(_event, _ctx, config) {
                            const key = vm.singleChartSlices[config.dataPointIndex].key;
                            vm.agentFilter.status = vm.agentFilter.status === key ? null : key;
                        },
                    },
                },
                labels: this.singleChartSlices.map(s => s.label),
                colors: this.singleChartSlices.map(s => s.color),
                legend: { show: false },
                states: AGENT_CHART_STATES,
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Çevrimiçi',
                                    formatter: () => total,
                                },
                            },
                        },
                        expandOnClick: false,
                    },
                },
                dataLabels: { enabled: false },
                stroke: { width: 2, colors: ['#fff'] },
                tooltip: { y: { formatter: val => val + ' temsilci' } },
            };
        },

        advancedOuterSeries() { return this.advancedOuterSlices.map(s => s.count); },
        advancedOuterOptions() {
            const vm = this;
            return {
                chart: {
                    type: 'donut',
                    events: {
                        dataPointSelection(_event, _ctx, config) {
                            const key = vm.advancedOuterSlices[config.dataPointIndex].key;
                            vm.agentFilter.status = vm.agentFilter.status === key ? null : key;
                        },
                    },
                },
                labels: this.advancedOuterSlices.map(s => s.label),
                colors: this.advancedOuterSlices.map(s => s.color),
                legend: { show: false },
                states: AGENT_CHART_STATES,
                plotOptions: {
                    pie: {
                        donut: { size: '73%', labels: { show: false } },
                        expandOnClick: false,
                    },
                },
                dataLabels: { enabled: false },
                stroke: { width: 2, colors: ['#fff'] },
                tooltip: { y: { formatter: val => val + ' temsilci' } },
            };
        },

        advancedInnerSeries() { return this.advancedInnerSlices.map(s => s.count); },
        advancedInnerOptions() {
            const vm = this;
            const total = this.onlineUsers.length;
            return {
                chart: {
                    type: 'donut',
                    events: {
                        dataPointSelection(_event, _ctx, config) {
                            const key = vm.advancedInnerSlices[config.dataPointIndex].key;
                            vm.agentFilter.status = vm.agentFilter.status === key ? null : key;
                        },
                    },
                },
                labels: this.advancedInnerSlices.map(s => s.label),
                colors: this.advancedInnerSlices.map(s => s.color),
                legend: { show: false },
                states: AGENT_CHART_STATES,
                plotOptions: {
                    pie: {
                        donut: {
                            size: '58%',
                            labels: {
                                show: true,
                                total: { show: true, label: 'Çevrimiçi', formatter: () => total },
                            },
                        },
                        expandOnClick: false,
                    },
                },
                dataLabels: { enabled: false },
                stroke: { width: 2, colors: ['#fff'] },
                tooltip: { y: { formatter: val => val + ' temsilci' } },
            };
        },

        // ── Call chart ──────────────────────────────────────────────
        callChartSeries() {
            return this.callStats.map(s => s.count);
        },

        callChartVisible() {
            return this.callChartSeries.some(v => v > 0);
        },

        callChartOptions() {
            const vm = this;
            const total = this.activeCalls.length;
            return {
                chart: {
                    type: 'donut',
                    events: {
                        dataPointSelection(event, chartContext, config) {
                            const key = vm.callStats[config.dataPointIndex].key;
                            vm.callFilter.state = vm.callFilter.state === key ? null : key;
                        },
                    },
                },
                labels: this.callStats.map(s => s.label),
                colors: CALL_CHART_COLORS,
                legend: { show: false },
                states: AGENT_CHART_STATES,
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%',
                            labels: {
                                show: true,
                                total: {
                                    show: true,
                                    label: 'Aktif Çağrı',
                                    formatter: () => total,
                                },
                            },
                        },
                        expandOnClick: false,
                    },
                },
                dataLabels: { enabled: false },
                stroke: { width: 2, colors: ['#fff'] },
                tooltip: { y: { formatter: val => val + ' çağrı' } },
            };
        },
    },

    created() {
        this.loadInit();
        this.listenEvents();
        setInterval(() => { this.now = new Date(); }, 1000);
    },

    beforeDestroy() {
        this.closeEvents();
    },

    methods: {
        // ── Veri yükleme ────────────────────────────────────────────
        refresh() {
            this.loadInit();
        },

        loadInit() {
            this.loading.init = true;
            this.$api.get('dashboard/realtime/init', {}, (response) => {
                this.loading.init = false;
                const d = response.data;

                // ── Lookup map'leri ──────────────────────────────────
                const queuesMap      = {};
                const queuesNameMap  = {};
                const numbersMap     = {};
                const numbersNameMap = {};
                const numbersDigitsMap = {};
                const statesMap      = {};
                d.queues.forEach(q  => { queuesMap[q.id] = q; queuesNameMap[q.name] = q; });
                d.numbers.forEach(n => {
                    numbersMap[n.id] = n;
                    numbersNameMap[n.name] = n;
                    if (n.number) numbersDigitsMap[n.number] = n;
                });
                if (d.states) d.states.forEach(s => { statesMap[s.id] = s; });

                this.numbers          = d.numbers || [];
                this.queuesMap        = queuesMap;
                this.queuesNameMap    = queuesNameMap;
                this.numbersMap       = numbersMap;
                this.numbersNameMap   = numbersNameMap;
                this.numbersDigitsMap = numbersDigitsMap;
                this.statesMap        = statesMap;

                // ── api_server ajan durumları: user_id → state hash ──
                const apiAgentMap = {};
                (d.api_agent_states || []).forEach(s => { apiAgentMap[s.user_id] = s; });

                // ── voip_server ajan durumları: sip → state ──────────
                const voipAgentMap = d.voip_agent_states || {};   // { "1001": {sip, current_state, timestamp} }

                // ── Kullanıcıları birleştir ───────────────────────────
                this.users = (d.users || []).map(u => {
                    const api  = apiAgentMap[u.id]         || null;
                    const voip = u.sip ? (voipAgentMap[u.sip] || null) : null;

                    return {
                        id:          u.id,
                        sip:         u.sip,
                        is_online:   api ? (api.is_online == '1' || api.is_online === true) : false,
                        call_status: voip && voip.current_state ? voip.current_state : (api ? (api.call_status  || null) : null),
                        started_at:  voip && voip.timestamp ? voip.timestamp : (api ? (api.started_at   || null) : null),
                        voip_state:  voip ? voip.current_state : null,   // avail | ringing | incall
                        voip_since:  voip ? voip.timestamp     : null,
                        user:  { id: u.id, name: u.name, surname: u.surname, email: u.email },
                        queue: (api && api.queue_id) ? { id: api.queue_id, name: api.queue_name || '' } : null,
                        state: (api && api.state_id) ? {
                            id:    api.state_id,
                            name:  statesMap[api.state_id] ? statesMap[api.state_id].name  : (api.state_name || ''),
                            state: statesMap[api.state_id] ? statesMap[api.state_id].state : (api.state_key  || null),
                        } : null,
                    };
                });

                // ── Çağrıları ayarla (voip Redis snapshot) ───────────
                // direction: voip "default_in_dialplan"/"default_out_dialplan" → "in"/"out"
                // started_at: süre sayacı için timestamp'tan türetilir
                this.calls = (d.voip_calls || []).map(c => ({
                    ...c,
                    direction:  c.direction === 'default_in_dialplan' ? 'in' : (c.direction === 'default_out_dialplan' ? 'out' : c.direction),
                    started_at: c.timestamp || null,
                }));

            }, () => {
                this.loading.init = false;
            });
        },

        // ── Socket olayları ─────────────────────────────────────────
        listenEvents() {
            this.socket.server.on('agent_states', this.onAgentState);
            this.socket.server.on('call_states', this.onCallState);
        },

        closeEvents() {
            this.socket.server.off('agent_states', this.onAgentState);
            this.socket.server.off('call_states', this.onCallState);
        },

        onAgentState(data) {
            const index = this.users.findIndex(item => {
                if (data.id && item.id && item.id.toString() === data.id.toString()) return true;
                if (data.user_id && item.user && item.user.id.toString() === data.user_id.toString()) return true;
                if (data.sip && item.sip && item.sip.toString() === data.sip.toString()) return true;
                return false;
            });

            if (index !== -1) {
                const user = this.users[index];

                // Eğer event VoIP server'dan (socket/index.js) gelmişse:
                if (data.sip && data.current_state) {
                    this.$set(user, 'call_status', data.current_state);
                    if (data.timestamp) this.$set(user, 'started_at', data.timestamp);
                    if (data.number) this.$set(user, 'current_number', data.number);
                    return; // event işlendi
                }

                if (data.partial) {
                    if (data.partial.call_status !== undefined) this.$set(user, 'call_status', data.partial.call_status);
                    if (data.partial.is_online  !== undefined) this.$set(user, 'is_online',   data.partial.is_online);
                    if (data.partial.started_at !== undefined) this.$set(user, 'started_at',  data.partial.started_at);
                    if (data.partial.state_id   !== undefined) {
                        const sId = data.partial.state_id;
                        this.$set(user, 'state', sId === null ? null : {
                            id:    sId,
                            name:  this.statesMap[sId] ? this.statesMap[sId].name  : (data.partial.state_name || (user.state ? user.state.name  : '')),
                            state: this.statesMap[sId] ? this.statesMap[sId].state : (data.partial.state_key  || (user.state ? user.state.state : null)),
                        });
                    }
                    if (data.partial.queue_id !== undefined) {
                        this.$set(user, 'queue', data.partial.queue_id === null ? null : {
                            id:   data.partial.queue_id,
                            name: data.partial.queue_name || '',
                        });
                    }
                } else if (data.id || data.user_id) {
                    this.$set(this.users, index, data);
                }
            } else if (!data.partial && !data.sip) {
                this.users.unshift(data);
            }
        },

        onCallState(data) {
            const normalized = {
                ...data,
                direction:  data.direction === 'default_in_dialplan' ? 'in' : (data.direction === 'default_out_dialplan' ? 'out' : data.direction),
                started_at: data.started_at || data.timestamp || null,
            };
            const index = this.calls.findIndex(c => c.call_id === normalized.call_id);
            if (index !== -1) {
                if (normalized.current_state !== 'hangup') {
                    this.$set(this.calls, index, normalized);
                } else {
                    this.calls.splice(index, 1);
                }
            } else if (normalized.current_state !== 'hangup') {
                this.calls.unshift(normalized);
            }
        },

        // ── Filtre toggle ───────────────────────────────────────────
        toggleAgentFilter(key) {
            this.agentFilter.status = this.agentFilter.status === key ? null : key;
        },

        toggleCallFilter(key) {
            this.callFilter.state = this.callFilter.state === key ? null : key;
        },

        getAgentActiveCall(agent) {
            return this.activeCalls.find(c =>
                (agent.sip && c.from === agent.sip) ||
                (c.user && c.user.id === agent.id)
            );
        },

        // ── Yardımcılar ─────────────────────────────────────────────
        getCallNumberId(call) {
            // ORM Obj
            if (call.number && typeof call.number === 'object') return call.number.id;
            if (call.number_id) return call.number_id;

            // Socket / Redis string objesi (örn: "908502104433") -> ID bulma
            if (call.number && typeof call.number === 'string') {
                if (this.numbersNameMap[call.number]) return this.numbersNameMap[call.number].id;
            }
            return null;
        },

        resolveNumber(call) {
            // ORM object formatı
            if (call.number && typeof call.number === 'object' && call.number.name) return call.number.name;

            // String → önce DID digits map, sonra isim map
            if (call.number && typeof call.number === 'string') {
                if (this.numbersDigitsMap[call.number]) return this.numbersDigitsMap[call.number].name;
                if (this.numbersNameMap[call.number])   return this.numbersNameMap[call.number].name;
            }

            // ID üzerinden lookup
            const id = this.getCallNumberId(call);
            if (id && this.numbersMap[id]) return this.numbersMap[id].name;

            // Fallback: to/from üzerinden digits map dene
            if (call.direction === 'in'  && call.to) {
                if (this.numbersDigitsMap[call.to])   return this.numbersDigitsMap[call.to].name;
            }
            if (call.direction === 'out' && call.from) {
                if (this.numbersDigitsMap[call.from]) return this.numbersDigitsMap[call.from].name;
            }
            return null;
        },

        resolveAgentNumber(agent) {
            if (agent.current_number) {
                if (this.numbersDigitsMap[agent.current_number]) return this.numbersDigitsMap[agent.current_number].name;
                if (this.numbersNameMap[agent.current_number])   return this.numbersNameMap[agent.current_number].name;
                return agent.current_number;
            }
            const call = this.getAgentActiveCall(agent);
            if (call) return this.resolveNumber(call);
            return null;
        },

        getAgentNumberId(agent) {
            if (agent.current_number) {
                if (this.numbersDigitsMap[agent.current_number]) return this.numbersDigitsMap[agent.current_number].id;
                if (this.numbersNameMap[agent.current_number])   return this.numbersNameMap[agent.current_number].id;
            }
            const call = this.getAgentActiveCall(agent);
            if (call) return this.getCallNumberId(call);
            return null;
        },

        resolveQueue(call) {
            // ORM'den gelen çağrı (eski format)
            if (call.queue && typeof call.queue === 'object' && call.queue.name) return call.queue.name;
            // ID üzerinden lookup
            if (call.queue && this.queuesMap[call.queue]) return this.queuesMap[call.queue].name;
            // İsim üzerinden lookup (voip_server Asterisk kuyruk adıyla yazar)
            if (call.queue && this.queuesNameMap[call.queue]) return this.queuesNameMap[call.queue].name;
            // Fallback: ham değeri göster
            if (call.queue && typeof call.queue === 'string') return call.queue;
            return null;
        },

        getAgentCallStatusLabel(row) {
            if (!row.is_online) return 'Çevrimdışı';
            const map = {
                incall:  'Çağrıda',
                calling: 'Aranıyor',
                ringing: 'Çalışıyor',
                avail:   'Bekliyor',
                break:   'Mola',
            };
            return map[row.call_status] || 'Hatta Değil';
        },

        getAgentCallStatusBadge(row) {
            if (!row.is_online) return 'bg-light text-muted';
            const map = {
                incall:  'bg-success-lt text-success',
                calling: 'bg-purple-lt text-purple',
                ringing: 'bg-primary-lt text-primary',
                avail:   'bg-danger-lt text-danger',
                break:   'bg-warning-lt text-warning',
            };
            return map[row.call_status] || 'badge-light text-muted';
        },

        getAgentStatusColor(row) {
            if (!row.is_online) return 'bg-light';
            const map = {
                incall:  'bg-success',
                ringing: 'bg-primary',
                avail:   'bg-danger',
                break:   'bg-warning',
            };
            if (row.call_status && map[row.call_status]) return map[row.call_status];
            if (row.state && row.state.name) return 'bg-danger';
            return 'bg-secondary';
        },

        getCallStateLabel(state) {
            const map = {
                incall:  'Çağrıda',
                ringing: 'Çalıyor',
                calling: 'Aranıyor',
                queuei:  'Kuyruk',
                ivr:     'IVR',
                hangup:  'Sonlandı',
            };
            return map[state] || state;
        },

        getCallStateBadge(state) {
            const map = {
                incall:  'bg-success-lt text-success',
                calling: 'bg-purple-lt text-purple',
                ringing: 'bg-primary-lt text-primary',
                queuei:  'bg-warning-lt text-warning',
                ivr:     'badge-light text-dark',
                hangup:  'bg-danger-lt text-danger',
            };
            return map[state] || 'badge-light text-muted';
        },
    },
};
</script>

<style lang="scss">
.el-radio-button__inner { width: 100%; }
.app-call-chart .el-radio-button__inner {
    border: 0 !important;
    padding: 6px 10px !important;
}
.app-call-chart .el-radio-group label {
    flex: unset;
}
.app-call-chart .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border-radius: 50px !important;
}
.app-call-chart .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 8px 0 0 8px;
}
.app-call-chart .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 8px 8px 0;
}
.app-simple-table {
    .el-table__row td {
        &:first-child { padding-left: 0.75rem; }
        &:last-child  { padding-right: 0.75rem; }
    }
}

/* ── Liste Kartı: card-body'yi flex column yap, tablo kalan alanı doldursun ── */
.rm-card-fill {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.rm-card-fill > .card {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
}
.rm-card-fill > .card > .card-body {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
}
.rm-card-fill .rm-list-body {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
.rm-card-fill .rm-list-body > .el-table {
    flex: 1 1 auto;
    min-height: 0;
}

/* ── Grafik Filtre Çubuğu ────────────────────────────────────── */
.rm-chart-filters {
    gap: 6px;
    .el-radio-group { margin: 2px 0; }
}

/* ── Halka Grafik ────────────────────────────────────────────── */
.rm-chart-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 240px;
    margin-bottom: 0.25rem;
}
.rm-chart-outer {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}
.rm-chart-inner {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    > div { pointer-events: auto; }
}

/* ── Stat Kartları ───────────────────────────────────────────── */
.rm-stat-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #adb5bd;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
}
.rm-stat-card {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 8px 10px;
    border: 1.5px solid transparent;
    transition: border-color 0.15s;
    &:hover { border-color: #dee2e6; }
    &--active { border-color: #3c81fa !important; background: #f0f5ff; }
}
.rm-stat-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}
.rm-stat-count {
    font-size: 17px;
    line-height: 1.2;
    display: block;
}
</style>
