import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthRequired from "../utils/AuthRequired";
import {modules} from "../constans/config"

Vue.use(VueRouter)

const routes = [
    {path: '/login', component: () => import('../views/home/Login.vue'), meta: {key: '', icon: ''},},
    {path: '/change-password', component: () => import('../views/home/ChangePassword.vue'), meta: {key: '', icon: ''},},
    {
        path: '/',
        component: () => import("../layouts/app/index"),
        beforeEnter: AuthRequired,
        meta: modules.dashboard,
        children: [
            {
                path: '',
                component: () => import("../views/board/Starter.vue"),
                meta: modules.dashboard,
            },
            {
                path: 'test',
                component: () => import("../views/Test.vue"),
            },
            {
                path: 'refresh',
                component: () => import("../views/board/Refresher.vue"),
            },
            {
                path: 'realtime-monitor',
                component: () => import("../views/board/RealtimeMonitor.vue"),
                meta: modules.real_time,
            },
            {
                path: 'messages',
                component: () => import("../views/board/Messages.vue"),
                meta: modules.messages,
            },
            {
                path: 'account-settings',
                component: () => import("../views/board/AccountSettings.vue"),
                meta: modules.account_settings,
            },
            {
                path: 'agent',
                component: () => import("../views/settings/index"),
                meta: modules.agent,
                redirect: '',
                children: [
                    {
                        path: 'task',
                        component: () => import("../views/agent/Task.vue"),
                        meta: modules.call_task,
                    },
                    {
                        path: 'last-call',
                        component: () => import("../views/agent/LastCall.vue"),
                        meta: modules.agent_call_history,
                    },
                ],
            },
            {
                path: 'settings',
                component: () => import("../views/settings/index"),
                meta: modules.settings,
                redirect: '',
                children: [
                    {
                        path: 'user',
                        component: () => import('../views/settings/user/index'),
                        meta: modules.user_list,
                    },
                    {
                        path: 'user/create',
                        component: () => import('../views/settings/user/Create'),
                        meta: modules.user_create,
                    },
                    {
                        path: 'user/:id/edit',
                        component: () => import('../views/settings/user/Create'),
                        meta: modules.user_edit,
                    },
                    {
                        path: 'user/:id',
                        component: () => import('../views/settings/user/Show'),
                        meta: modules.user_show,
                    },
                    {
                        path: 'customer',
                        component: () => import('../views/settings/customer/index'),
                        meta: modules.customer_list,
                    },
                    {
                        path: 'customer/create',
                        component: () => import('../views/settings/customer/Create'),
                        meta: modules.customer_create,
                    },
                    {
                        path: 'customer/:id/edit',
                        component: () => import('../views/settings/customer/Create'),
                        meta: modules.customer_edit,
                    },
                    {
                        path: 'customer/:id',
                        component: () => import('../views/settings/customer/Show'),
                        meta: modules.customer_show,
                    },
                    {
                        path: 'pbx',
                        component: () => import("../views/settings/pbx/index"),
                        meta: modules.pbx_list,
                    },
                    {
                        path: 'pbx/create',
                        component: () => import('../views/settings/pbx/Create'),
                        meta: modules.pbx_create,
                    },
                    {
                        path: 'pbx/:id/edit',
                        component: () => import('../views/settings/pbx/Create'),
                        meta: modules.pbx_edit,
                    },
                    {
                        path: 'pbx/:id',
                        component: () => import('../views/settings/pbx/Show'),
                        meta: modules.pbx_show,
                    },
                    {
                        path: 'number',
                        component: () => import("../views/settings/number/index"),
                        meta: modules.number_list,
                    },
                    {
                        path: 'number/create',
                        component: () => import('../views/settings/number/Create'),
                        meta: modules.number_create,
                    },
                    {
                        path: 'number/:id/edit',
                        component: () => import('../views/settings/number/Create'),
                        meta: modules.number_edit,
                    },
                    {
                        path: 'number/:id',
                        component: () => import('../views/settings/number/Show'),
                        meta: modules.number_show,
                    },
                    {
                        path: 'queue',
                        component: () => import("../views/settings/queue/index"),
                        meta: modules.queue_list,
                    },
                    {
                        path: 'queue/create',
                        component: () => import('../views/settings/queue/Create'),
                        meta: modules.queue_create,
                    },
                    {
                        path: 'queue/:id/edit',
                        component: () => import('../views/settings/queue/Create'),
                        meta: modules.queue_edit,
                    },
                    {
                        path: 'queue/:id',
                        component: () => import('../views/settings/queue/Show'),
                        meta: modules.queue_show,
                    },
                    {
                        path: 'dial-plan',
                        component: () => import("../views/settings/dial-plan/index"),
                        meta: modules.dialplan_list,
                    },
                    {
                        path: 'dial-plan/create',
                        component: () => import('../views/settings/dial-plan/Create'),
                        meta: modules.dialplan_create,
                    },
                    {
                        path: 'dial-plan/:id/edit',
                        component: () => import('../views/settings/dial-plan/Create'),
                        meta: modules.dialplan_edit,
                    },
                    {
                        path: 'dial-plan/:id',
                        component: () => import('../views/settings/dial-plan/Show'),
                        meta: modules.dialplan_show,
                    },
{
                        path: '*',
                        component: () => import('../layouts/app/404'),
                    },
                ]
            },
            {
                path: 'reports',
                component: () => import("../views/reports/index"),
                meta: modules.reports,
                redirect: '',
                children: [
                    {
                        path: 'calls',
                        component: () => import('../views/reports/Call'),
                        meta: modules.all_calls_report,
                    },
                    {
                        path: 'inbound',
                        component: () => import('../views/reports/Inbound'),
                        meta: modules.inbound_report,
                    },
                    {
                        path: 'crm-form',
                        component: () => import('../views/reports/CrmFormResults'),
                        meta: modules.crm_form_report,
                    },
                    {
                        path: 'outbound',
                        component: () => import('../views/reports/Outbound'),
                        meta: modules.outbound_report,
                    },
                    {
                        path: 'missed-calls',
                        component: () => import('../views/reports/MissedCalls'),
                        meta: modules.missed_calls,
                    },
                    {
                        path: 'sound-record',
                        component: () => import('../views/reports/SoundRecord'),
                        meta: modules.call_recording_report,
                    },
                    {
                        path: 'agent-performance',
                        component: () => import('../views/reports/AgentPerformance'),
                        meta: modules.agent_performance,
                    },
                    {
                        path: 'agent-performance/:user_id',
                        component: () => import('../views/reports/AgentPerformanceAnalysis'),
                        meta: modules.agent_performance,
                    },
                    {
                        path: 'agent-state-statuses',
                        component: () => import('../views/reports/AgentStateStatuses'),
                        meta: modules.agent_state_statuses,
                    },
                    {
                        path: 'call-analysis',
                        component: () => import('../views/reports/CallAnalysis'),
                        meta: modules.result_code_report,
                    },
                ],
            },
            {
                path: 'operation',
                component: () => import("../views/operation/index"),
                meta: modules.operation,
                redirect: '',
                children: [
                    {
                        path: 'crm-forms',
                        component: () => import("../views/operation/crm-forms/index"),
                        meta: modules.crm_form_list,
                    },
                    {
                        path: 'crm-forms/create',
                        component: () => import('../views/operation/crm-forms/Create'),
                        meta: modules.crm_form_create,
                    },
                    {
                        path: 'crm-forms/:id/edit',
                        component: () => import('../views/operation/crm-forms/Create'),
                        meta: modules.crm_form_edit,
                    },
                    {
                        path: 'crm-forms/:id',
                        component: () => import('../views/operation/crm-forms/Show'),
                        meta: modules.crm_form_show,
                    },
                    {
                        path: 'result-code',
                        component: () => import("../views/operation/result-code/index"),
                        meta: modules.result_code_list,
                    },
                    {
                        path: 'result-code/create',
                        component: () => import('../views/operation/result-code/Create'),
                        meta: modules.result_code_create,
                    },
                    {
                        path: 'result-code/:id/edit',
                        component: () => import('../views/operation/result-code/Create'),
                        meta: modules.result_code_edit,
                    },
                    {
                        path: 'result-code/:id',
                        component: () => import('../views/operation/result-code/Show'),
                        meta: modules.result_code_show,
                    },
                    {
                        path: 'state',
                        component: () => import("../views/operation/state/index"),
                        meta: modules.state_list,
                    },
                    {
                        path: 'state/create',
                        component: () => import('../views/operation/state/Create'),
                        meta: modules.state_create,
                    },
                    {
                        path: 'state/:id/edit',
                        component: () => import('../views/operation/state/Create'),
                        meta: modules.state_edit,
                    },
                    {
                        path: 'state/:id',
                        component: () => import('../views/operation/state/Show'),
                        meta: modules.state_show,
                    },
                    {
                        path: 'sms-template',
                        component: () => import("../views/operation/sms-template/index"),
                        meta: modules.result_code_list,
                    },
                    {
                        path: 'sms-template/create',
                        component: () => import('../views/operation/sms-template/Create'),
                        meta: modules.result_code_create,
                    },
                    {
                        path: 'sms-template/:id/edit',
                        component: () => import('../views/operation/sms-template/Create'),
                        meta: modules.result_code_edit,
                    },
                    {
                        path: 'sms-template/:id',
                        component: () => import('../views/operation/sms-template/Show'),
                        meta: modules.result_code_show,
                    },
                    {
                        path: 'contact',
                        component: () => import("../views/operation/contact/index"),
                        meta: modules.contact_list,
                    },
                    {
                        path: 'contact/create',
                        component: () => import('../views/operation/contact/Create'),
                        meta: modules.contact_create,
                    },
                    {
                        path: 'contact/:id/edit',
                        component: () => import('../views/operation/contact/Create'),
                        meta: modules.contact_edit,
                    },
                    {
                        path: 'contact/:id',
                        component: () => import('../views/operation/contact/Show'),
                        meta: modules.contact_show,
                    },
                    {
                        path: 'call-list',
                        component: () => import("../views/operation/call-list/index"),
                        meta: modules.call_list_list,
                    },
                    {
                        path: 'call-list/create',
                        component: () => import('../views/operation/call-list/Create'),
                        meta: modules.call_list_create,
                    },
                    {
                        path: 'call-list/:id/edit',
                        component: () => import('../views/operation/call-list/Create'),
                        meta: modules.call_list_edit,
                    },
                    {
                        path: 'call-list/:id',
                        component: () => import('../views/operation/call-list/Show'),
                        meta: modules.call_list_show,
                    },
                    {
                        path: 'call-endpoint',
                        component: () => import("../views/operation/call-endpoint/index"),
                        meta: modules.call_endpoint_list,
                    },
                    {
                        path: 'call-endpoint/create',
                        component: () => import('../views/operation/call-endpoint/Create'),
                        meta: modules.call_endpoint_create,
                    },
                    {
                        path: 'call-endpoint/:id/edit',
                        component: () => import('../views/operation/call-endpoint/Create'),
                        meta: modules.call_endpoint_edit,
                    },
                    {
                        path: 'call-endpoint/:id',
                        component: () => import('../views/operation/call-endpoint/Show'),
                        meta: modules.call_endpoint_show,
                    },
                    {
                        path: 'blacklist',
                        component: () => import("../views/operation/blacklist/index"),
                        meta: modules.blacklist_list,
                    },
                    {
                        path: 'blacklist/create',
                        component: () => import('../views/operation/blacklist/Create'),
                        meta: modules.blacklist_create,
                    },
                    {
                        path: 'blacklist/:id/edit',
                        component: () => import('../views/operation/blacklist/Create'),
                        meta: modules.blacklist_edit,
                    },
                    {
                        path: 'blacklist/:id',
                        component: () => import('../views/operation/blacklist/Show'),
                        meta: modules.blacklist_show,
                    },
                    {
                        path: 'announcement',
                        component: () => import("../views/operation/announcement/index"),
                        meta: modules.announcement_list,
                    },
                    {
                        path: 'announcement/create',
                        component: () => import('../views/operation/announcement/Create'),
                        meta: modules.announcement_create,
                    },
                    {
                        path: 'announcement/:id/edit',
                        component: () => import('../views/operation/announcement/Create'),
                        meta: modules.announcement_edit,
                    },
                    {
                        path: 'announcement/:id',
                        component: () => import('../views/operation/announcement/Show'),
                        meta: modules.announcement_show,
                    },
                ],
            },
            {
                path: '*',
                component: () => import('../layouts/app/404'),
            },
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
