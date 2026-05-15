<template>
  <div id="aside" class="page-sidenav no-shrink nav-expand fade sticky" aria-hidden="true">
    <div class="mini-menu b-r bg-light" style="z-index: 9;">
      <ul>
        <li style="margin-top:-8px; margin-bottom: 10px;padding-left:6px;">
          <span class="avatar border w-32 bg-secondary" v-if="currentUser.settings.avatar.type === 'text'" :style="'background:'+currentUser.settings.avatar.parameter+' !important;'">{{currentUser.name[0]}}{{currentUser.surname[0]}}</span>
          <span class="avatar border w-32 bg-secondary" v-else><img :src="'/assets/img/vectors/avatars/avatar'+currentUser.settings.avatar.parameter+'.svg'" alt=""></span>
          <small class="menu-text"></small>
        </li>
        <template v-for="item in menu">
          <li v-if="checkPermits(item)" :key="item.id" :class="{'active': activeMenuID === item.id}">
              <el-tooltip :open-delay="1000" class="item" effect="dark" :content="$t('menu.modules.' + item.key + '.title')"
                          placement="right">
                <a @click="(e) => { e.preventDefault(); activeMenuID = item.id; popupMenuVisible = true;}" :href="item.href"
                  :class="{'active': activeMenuID === item.id}" class="text-color"
                  style="display: block; position:relative;">
                  <span v-if="activeMenuID === item.id" class="dot"></span>
                  <span class="menu-icon i-con-h-a"><ion-icon style="font-size:22px;"
                                                              :name="item.icon.toString()"></ion-icon></span>
                  <small class="menu-text"></small>
                </a>
              </el-tooltip>
          </li>
        </template>
        
        <li style="position: absolute; bottom:10px; left:0;" @click="showFeedback">
          <el-tooltip class="item" effect="dark" content="Geri Bildirim" placement="right">
            <a @click="(e) => { e.preventDefault();}" class="text-color"
               style="display: block; position:relative;">
              <span class="menu-icon i-con-h-a"><ion-icon style="font-size: 22px" name="mail-outline"></ion-icon></span>
              <span class="menu-text"></span>
            </a>
          </el-tooltip>
        </li>
      </ul>
      <!--<div class="mini-menu-footer b-t" style="font-size:80% !important; height: 50px; !important;">
        <div class="text-muted pointer" style="margin:2px;">{{version}}</div>
      </div>-->
    </div>
    <div class="sidenav h-100 bg-light" :class="{'sidenav-open-popup':popupMenuVisible}">
      <div class="flex hover">
        <div class="pt-3" style="margin-left:1.25rem;margin-right:1.25rem">
          <h6 class=" mb-1" style=" font-size:14px; margin-top:4px;">
            {{ currentUser.name }} {{ currentUser.surname }}
          </h6>
          <div style="margin-bottom:20px;">
            <CustomerSelector v-if="$api.has('customer_list',true) && !customersLoading"></CustomerSelector>
            <small class="d-block text-muted" v-else>{{ currentUser.customer.name }}</small>
          </div>
        </div>
        <div class="nav-stacked px-1 nav-active-primary" data-nav>
          <ul class="nav bg" v-for="item in menu">
            <template v-if="item.id === activeMenuID">
                <li class="nav-header pt-0 pb-1 text-muted"><span class="text-xs hidden-folded">{{$t('menu.modules.' + item.key + '.title')}}</span></li>
              <router-link :active-class="sub.href !== '/' || $route.path === '/' ? 'active' : ''" tag="li"
                           :to="sub.href" v-for="sub in item.children" :key="sub.id" v-if="$api.has(sub.key)"
                           class="i-con-h-a">
                <a :to="sub.href" @click="popupMenuVisible = false">
                  <span class="nav-icon"><ion-icon style="font-size: 18px; margin-right:2px;"
                                                   :name="sub.icon"></ion-icon> </span><span
                    class="nav-text">{{ sub.title }}</span>
                </a>
              </router-link>
            </template>
          </ul>
        </div>
      </div>
      <div class="no-shrink">
        <Favorites></Favorites>
        <SipClient v-if="$api.has('soft_phone')"></SipClient>
        <!--<div class="text-sm p-3 b-t">
          <div class="hidden-folded text-sm">
            <el-popover v-if="envParams.VUE_APP_ENV !== 'production'" popper-class="app-dev-tools"
                placement="top-start"
                title="Environments"
                width="650"
                trigger="hover">
                <div style="max-height:50vh; overflow:auto">
<div class="row mt-1" v-for="(item,key) in envParams">
                <div class="col-5"><small>{{ key }}</small></div>
                <div class="col-7" style="font-family: monospace !important;">{{ item }}</div>
              </div>
              <h6 class="font-weight-bold mt-4">User</h6>
              <div class="mt-2">
                <div class="row mt-1" v-for="(item,key) in Object.keys(currentUser)">
                <div class="col-5"><small>{{ item }}</small></div>
                <div class="col-7" style="font-family: monospace !important;">{{ currentUser[item] }}</div>
              </div>
              </div>
                </div>
              
              <div class="text-muted pointer" slot="reference"><small class="text-muted">© Copyright 2020,
                {{ envParams.VUE_APP_ENV }}</small></div>
            </el-popover>
            <div class="text-muted" v-else><small class="text-muted">© Copyright 2020, Nebula</small></div>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import JsSIP from 'jssip';
import Favorites from './Favorites';
import SipClient from './SipClient';
import CustomerSelector from './CustomerSelector';
import {mapActions, mapGetters} from "vuex";
import EventBus from "../../utils/EventBus";

export default {
  components: {
    Favorites,
    SipClient,
    CustomerSelector,
  },
  data() {
    return {
      popupMenuVisible:false,
      activeMenuID: 1,
      test: false,
      customers: [],
      customersLoading: false,
      feedbackModalVisible: false,
      feedbackStatus: 'clear',
      feedbackComment: '',
      menu: [
        {
          id: 1, key: 'starter', title: this.$t('menu.modules.starter.title'), icon: 'desktop-outline', href: '/', children: [
            {id: 2, key: 'dashboard', title: this.$t('menu.modules.dashboard.title'), icon: 'albums-outline', href: '/',},
            {id: 102, key: 'real_time', title: this.$t('menu.modules.real_time.title'), icon: 'tv-outline', href: '/realtime-monitor',},
            {id: 103, key: 'network_monitor', title: this.$t('menu.modules.network_monitor.title'), icon: 'pulse-outline', href: '/network-monitor',},
          ]
        },
        {
          id: 4, key: 'agent', title: this.$t('menu.modules.agent.title'), icon: 'call-outline', href: '/agent', children: [
            {id: 5, key: 'call_task', title: this.$t('menu.modules.call_task.title'), icon: 'recording-outline', href: '/agent/task',},
            {
              id: 6,
              key: 'agent_call_history',
              title: this.$t('menu.modules.agent_call_history.title'),
              icon: 'filter-circle-outline',
              href: '/agent/last-call',
            },
          ]
        },
        {
          id: 18, key: 'reports', title: this.$t('menu.modules.reports.title'), icon: 'trending-up', href: '/reports', children: [
            {
              id: 90,
              key: 'all_calls_report',
              title: this.$t('menu.modules.all_calls_report.title'),
              icon: 'reader-outline',
              href: '/reports/calls',
            },
            {
              id: 19,
              key: 'inbound_report',
              title: this.$t('menu.modules.inbound_report.title'),
              icon: 'arrow-undo-outline',
              href: '/reports/inbound',
            },
            {
              id: 20,
              key: 'outbound_report',
              title: this.$t('menu.modules.outbound_report.title'),
              icon: 'arrow-redo-outline',
              href: '/reports/outbound',
            },
            {
              id: 70,
              key: 'missed_calls',
              title: this.$t('menu.modules.missed_calls.title'),
              icon: 'ban-outline',
              href: '/reports/missed-calls',
            },
            {
              id: 42,
              key: 'agent_performance',
              title: this.$t('menu.modules.agent_performance.title'),
              icon: 'analytics-outline',
              href: '/reports/agent-performance',
            },
            {
              id: 100,
              key: 'agent_performance',
              title: this.$t('menu.modules.agent_state_statuses.title'),
              icon: 'enter-outline',
              href: '/reports/agent-state-statuses',
            },
            {
              id: 43,
              key: 'result_code_report',
              title: this.$t('menu.modules.result_code_report.title'),
              icon: 'stats-chart-outline',
              href: '/reports/call-analysis',
            },
            {
              id: 101,
              key: 'call_list_analysis_report',
              title: this.$t('menu.modules.call_list_analysis_report.title'),
              icon: 'pie-chart-outline',
              href: '/reports/call-list-analysis',
            },
            {
              id: 44,
              key: 'call_recording_report',
              title: this.$t('menu.modules.call_recording_report.title'),
              icon: 'musical-notes-outline',
              href: '/reports/sound-record',
            },
            {
              id: 60,
              key: 'crm_form_report',
              title: this.$t('menu.modules.crm_form_report.title'),
              icon: 'funnel-outline',
              href: '/reports/crm-form',
            },
          ]
        },
        {
          id: 25, key: 'operation', title: this.$t('menu.modules.operation.title'), icon: 'compass-outline', href: '/operation', children: [
            {
              id: 31,
              key: 'contact_list',
              title: this.$t('menu.modules.contact_list.title'),
              icon: 'person-circle-outline',
              href: '/operation/contact',
            },
            {
              id: 33,
              key: 'call_list_list',
              title: this.$t('menu.modules.call_list_list.title'),
              icon: 'cloud-upload-outline',
              href: '/operation/call-list',
            },
            {
              id: 35,
              key: 'call_endpoint_list',
              title: this.$t('menu.modules.call_endpoint_list.title'),
              icon: 'cloud-download-outline',
              href: '/operation/call-endpoint',
            },
            {
              id: 32,
              key: 'result_code_list',
              title: this.$t('menu.modules.result_code_list.title'),
              icon: 'bookmark-outline',
              href: '/operation/result-code',
            },
            /*{
              id: 90,
              key: 'result_code_list',
              title: this.$t('menu.modules.state_list.title'),
              icon: 'cafe-outline',
              href: '/operation/state',
            },*/
            {
              id: 50,
              key: 'crm_form_list',
              title: this.$t('menu.modules.crm_form_list.title'),
              icon: 'book-outline',
              href: '/operation/crm-forms',
            },
            /*{
              id: 34,
              key: 'result_code_list',
              title: this.$t('menu.modules.sms_template_list.title'),
              icon: 'chatbox-ellipses-outline',
              href: '/operation/sms-template',
            },*/
            {
              id: 13,
              key: 'announcement_list',
              title: this.$t('menu.modules.announcement_list.title'),
              icon: 'megaphone-outline',
              href: '/operation/announcement',
            },
            
            {
              id: 17,
              key: 'blacklist_list',
              title: this.$t('menu.modules.blacklist_list.title'),
              icon: 'eye-off-outline',
              href: '/operation/blacklist',
            },
            
          ]
        },
        {
          id: 10, key: 'settings', title: this.$t('menu.modules.settings.title'), icon: 'cog-outline', href: '/settings', children: [
            {
              id: 11,
              key: 'customer_list',
              title: this.$t('menu.modules.customer_list.title'),
              icon: 'storefront-outline',
              href: '/settings/customer',
            },
            {id: 12, key: 'user_list', title: this.$t('menu.modules.user_list.title'), icon: 'person-outline', href: '/settings/user',},
            {id: 16, key: 'queue_list', title: this.$t('menu.modules.queue_list.title'), icon: 'people-outline', href: '/settings/queue',},
            {
              id: 18,
              key: 'dialplan_list',
              title: this.$t('menu.modules.dialplan_list.title'),
              icon: 'keypad-outline',
              href: '/settings/dial-plan',
            },

            {id: 14, key: 'pbx_list', title: this.$t('menu.modules.pbx_list.title'), icon: 'server-outline', href: '/settings/pbx',},
            {
              id: 40,
              key: 'number_list',
              title: this.$t('menu.modules.number_list.title'),
              icon: 'cellular-outline',
              href: '/settings/number',
            },

          ]
        },
      ],

    }
  },
  computed: {
    ...mapGetters(['currentUser','version']),
    envParams() {
      return process.env
    }
  },
  created() {
    let id = false;
    let reverseMenu = [...this.menu].reverse();
    id = reverseMenu.findIndex((item) => {
      return this.$route.path.includes(item.href);
    });
    if (id !== -1) {
      this.activeMenuID = reverseMenu[id].id;
    }
  },
  beforeDestroy() {
    EventBus.$off('addCustomer');
  },
  methods: {
    ...mapActions(['updateCurrentUser']),
    checkPermits(menu){
      let permission = false;
      menu.children.forEach((children) => {
        if(this.$api.has(children.key))
          permission = true;
      });
      return permission;
    },
    showFeedback() {
      EventBus.$emit('openPreferences','feedback')
    },
    hideFeedback() {
      this.feedbackModalVisible = false;
      this.feedbackComment = '';
      this.feedbackStatus = 'clear';
    },
    saveFeedback() {
      this.$api.post('feedback', {
        comment: this.feedbackComment,
      }, () => {
        this.feedbackStatus = 'success';
      }, () => {
      })
    },

  },

}
</script>
<style>

.app-dev-tools{
  padding:20px 25px;
}
.nav-icon{
  opacity: 1;
}

.bg-dark .nav-stacked .nav > li:not(.active):hover a {
  background: #222327 !important;
  cursor: pointer;
}
.nav-stacked .nav > li:not(.active):hover a {
  background: #e8e9eb !important;
  cursor: pointer;
}
.nav-stacked .nav > li > a {
  padding: 0.1rem .1rem;
  border-radius: 7px;
  transition: 0.2s;
  margin-bottom:2px;
}

.nav-stacked .nav > li:not(.nav-header) {
  padding: 0 .75rem;
}

.app-customers-popper-row:hover {
  background: #FAFAFA;
  cursor: pointer;
  color: var(--primary-color);
}

.app-customers-popper .el-tabs__header {
  border-right: 1px solid #F1F1F1;
  margin-right: 0 !important;
  padding-top: 10px;
}

.el-tabs--left .el-tabs__nav-wrap.is-left::after, .el-tabs--left .el-tabs__nav-wrap.is-right::after, .el-tabs--right .el-tabs__nav-wrap.is-left::after, .el-tabs--right .el-tabs__nav-wrap.is-right::after {
  width: 0px;
}

.app-customers-popper .el-tabs__item {
  text-align: left !important;
  font-size: 12px;
  font-weight: 500;
  padding: 0 15px;
  width: 140px;
}

.sidenav .el-select .el-input.is-focus .el-input__inner:focus {
  border: 0 !important;
  background-color: inherit !important;
  outline: none !important;
}

.sidenav .el-select .el-input.is-focus .el-input__inner:active {
  border: 0 !important;
  background-color: inherit !important;
  outline: none !important;
}

.sidenav .el-select .el-input.is-focus .el-input__inner {
  border: 0 !important;
  background-color: inherit !important;
  outline: none !important;
}

.sidenav .el-input el-input--small el-input--suffix {
  border: 0 !important;
  background-color: inherit !important;
  outline: none !important;
}

.sidenav .el-input__inner {
  border: 0 !important;
  background-color: inherit !important;
  padding-left: 0;
  font-weight: 300 !important;
}

.sidenav .el-input__inner:focus {
  box-shadow: none !important;
}


#aside {
  display: flex ;
  min-width: 19.5rem;
}

.sidenav {
  flex: 1 !important;

}

.mini-menu {
  width: 66px;
  height: 100% !important;
  padding: 1.75rem 0.75rem;
  display: block;
  position: relative;
}

.mini-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: block;
}

.mini-menu ul li {
  display: block;
  width: 100%;
  text-align: center;
  padding:0 0 4px 0;
}

.mini-menu ul li.active {
  /*border-radius: 10px;*/
  /*box-shadow: 0 0 12px -4px rgba(0,0,0,0.1);*/
}

.mini-menu ul li a {
  padding: 10px 2px 12px 2px;
  border-radius: 5px;
}

.mini-menu ul li a i {
  border-width: 1px;
}

.mini-menu ul li a:hover {
  color: var(--primary-color) !important;
  opacity: 1;
}

.mini-menu ul li a.active i {
}

.mini-menu ul li a.active {
  color: var(--primary-color) !important;
  /*opacity: 1;*/
}

.mini-menu ul li a i {
  width: 22px;
  height: 22px;
}

.dot {
  display: block;
  width: 10px;
  height: 35px;
  background: var(--primary-color);
  border-radius: 10px;
  position: absolute;
  left: -17px;
  top: 3px;
}

.mini-menu-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px;
}


.sidenav .nav-text {
  margin-left: 0;
  font-size: 14px !important;
  font-weight: 400;
}
.nav-stacked .nav-text {
  
}
.nav-active-primary .nav-item.active>a, .nav-active-primary .nav-link.active, .nav-active-primary .nav>li.active>a .nav-text{
  font-weight: 500 !important;
  color:#FFF;
}
</style>