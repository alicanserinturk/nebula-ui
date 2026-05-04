export const apiUrl = 'https://test-api.nebulavpbx.com/v3/'
export const socketUrl = 'https://test-socket.nebulavpbx.com/'
export const sipServerUrl = 'wss://pbx2.nebulavpbx.com:8089/ws'
console.log(navigator.language || navigator.userLanguage);

export const currentUser = {
    id: 1,
    name: 'Serkan',
    surname: 'Süren',
    email: 'serkan@nebulavpbx.com',
    token: 'TOKEN',
    status: 'A',
    sip: false,
    sip_password: '',
    outbound_skill: '',
    company_id: 1,
    server_id: 1,
    settings: {
        "favorites": [],
        "notes": [],
        "interface_dark_mode": false,
        "interface_zoom": 100,
        "interface_language": (navigator.language || navigator.userLanguage) === 'tr-TR' ? 'tr' : 'en',
        "interface_location": +3,
        "interface_primary_color": "#007AFF",
        "tutorials": [],
        "last_version": "3.0.36",
        "notifications": true,
        "notifications_online": true,
        "notifications_chat": true,
        "notifications_other": true,
        "sip": {
            "auto_crm": false,
            "default_number": null,
            "default_state": 2,
            "pad": false,
        },
        "customer_selector": {
            "favorites": [],
            "history": []
        },
        "avatar": {
            "type": "text",
            "parameter": "#2b3035",
        },
        "default_devices": {
            "input": "default",
            "output": "default",
        }
    },
}

export const modules = {
    'settings': {
        path: '',
        key: 'settings',
        icon: '',
    },
    'starter': {
        path: '',
        key: 'starter',
        icon: 'i-con i-con-monitor',
    },
    'dashboard': {
        path: '/',
        key: 'dashboard',
        icon: 'albums-outline',
    },
    'inbound_call': {
        path: '',
        key: 'inbound_call',
        icon: 'arrow-undo-outline',
    },
    'outbound_call': {
        path: '',
        key: 'outbound_call',
        icon: 'arrow-redo-outline',
    },
    'break': {
        path: '',
        key: 'break',
        icon: '',
    },
    'call_task': {
        path: '',
        key: 'call_task',
        icon: 'recording-outline',
    },
    'agent_call_history': {
        path: '',
        key: 'agent_call_history',
        icon: 'filter-circle-outline',
    },
    'result_code_report': {
        path: '',
        key: 'result_code_report',
        icon: 'stats-chart-outline',
    },
    'agent': {
        path: '',
        key: 'agent',
        icon: '',
    },
    'real_time': {
        path: '',
        key: 'real_time',
        icon: 'pie-chart-outline',
    },
    'announcement': {
        path: '',
        key: 'announcement',
        icon: 'megaphone-outline',
    },
    'call_recording_report': {
        path: '',
        key: 'call_recording_report',
        icon: 'musical-notes-outline',
    },
    'agent_performance': {
        path: '',
        key: 'agent_performance',
        icon: 'analytics-outline',
    },
    'agent_state_statuses': {
        path: '',
        key: 'agent_state_statuses',
        icon: 'enter-outline',
    },
    'reports': {
        path: '',
        key: 'reports',
        icon: '',
    },
    'operation': {
        path: '',
        key: 'operation',
        icon: '',
    },
    'call_detail_report': {
        path: '',
        key: 'call_detail_report',
        icon: '',
    },
    'customer_list': {
        path: '/settings/customer',
        key: 'customer_list',
        icon: 'storefront-outline',
    },
    'customer_create': {
        path: '/settings/customer/create',
        key: 'customer_create',
        icon: 'storefront-outline',
    },
    'customer_edit': {
        path: '',
        key: 'customer_edit',
        icon: 'storefront-outline',
    },
    'customer_delete': {
        path: '',
        key: 'customer_delete',
        icon: 'storefront-outline',
    },
    'customer_show': {
        path: '',
        key: 'customer_show',
        icon: 'storefront-outline',
    },
    'user_list': {
        path: '/settings/user',
        key: 'user_list',
        icon: 'person-outline',
    },
    'user_create': {
        path: '/settings/user/create',
        key: 'user_create',
        icon: 'person-outline',
    },
    'user_edit': {
        path: '',
        key: 'user_edit',
        icon: 'person-outline',
    },
    'user_delete': {
        path: '',
        key: 'user_delete',
        icon: 'person-outline',
    },
    'user_show': {
        path: '',
        key: 'user_show',
        icon: 'person-outline',
    },
    'state_list': {
        path: '/settings/user',
        key: 'state_list',
        icon: 'cafe-outline',
    },
    'state_create': {
        path: '/settings/user/create',
        key: 'state_create',
        icon: 'cafe-outline',
    },
    'state_edit': {
        path: '',
        key: 'state_edit',
        icon: 'cafe-outline',
    },
    'state_delete': {
        path: '',
        key: 'state_delete',
        icon: 'cafe-outline',
    },
    'state_show': {
        path: '',
        key: 'state_show',
        icon: 'cafe-outline',
    },
    'announcement_list': {
        path: '/settings/announcement',
        key: 'announcement_list',
        icon: 'megaphone-outline',
    },
    'announcement_create': {
        path: '/settings/announcement/create',
        key: 'announcement_create',
        icon: 'megaphone-outline',
    },
    'announcement_edit': {
        path: '',
        key: 'announcement_edit',
        icon: 'megaphone-outline',
    },
    'announcement_delete': {
        path: '',
        key: 'announcement_delete',
        icon: 'megaphone-outline',
    },
    'announcement_show': {
        path: '',
        key: 'announcement_show',
        icon: 'megaphone-outline',
    },
    'messages': {
        path: '/messages',
        key: 'messages',
        icon: 'chatbubbles-outline',
    },
    'pbx_edit': {
        path: '',
        key: 'pbx_edit',
        icon: 'server-outline',
    },
    'pbx_list': {
        path: '/settings/pbx',
        key: 'pbx_list',
        icon: 'server-outline',
    },
    'pbx_delete': {
        path: '',
        key: 'pbx_delete',
        icon: 'server-outline',
    },
    'pbx_create': {
        path: '/settings/pbx/create',
        key: 'pbx_create',
        icon: 'server-outline',
    },
    'pbx_show': {
        path: '',
        key: 'pbx_show',
        icon: 'server-outline',
    },
    'queue_list': {
        path: '/settings/queue',
        key: 'queue_list',
        icon: 'people-outline',
    },
    'queue_create': {
        path: '/settings/queue/create',
        key: 'queue_create',
        icon: 'people-outline',
    },
    'queue_remove': {
        path: '',
        key: 'queue_remove',
        icon: 'people-outline',
    },
    'queue_show': {
        path: '',
        key: 'queue_show',
        icon: 'people-outline',
    },
    'queue_edit': {
        path: '',
        key: 'queue_edit',
        icon: 'people-outline',
    },
    'call_list_list': {
        path: '/settings/call-list',
        key: 'call_list_list',
        icon: 'cloud-upload-outline',
    },
    'call_list_create': {
        path: '/settings/call-list/create',
        key: 'call_list_create',
        icon: 'cloud-upload-outline',
    },
    'call_list_delete': {
        path: '',
        key: 'call_list_delete',
        icon: 'cloud-upload-outline',
    },
    'call_list_show': {
        path: '',
        key: 'call_list_show',
        icon: 'cloud-upload-outline',
    },
    'call_list_edit': {
        path: '',
        key: 'call_list_edit',
        icon: 'cloud-upload-outline',
    },
    'call_endpoint_list': {
        path: '/operation/call-endpoint',
        key: 'call_endpoint_list',
        icon: 'cloud-download-outline',
    },
    'call_endpoint_create': {
        path: '/operation/call-endpoint/create',
        key: 'call_endpoint_create',
        icon: 'cloud-download-outline',
    },
    'call_endpoint_delete': {
        path: '',
        key: 'call_endpoint_delete',
        icon: 'cloud-download-outline',
    },
    'call_endpoint_show': {
        path: '',
        key: 'call_endpoint_show',
        icon: 'cloud-download-outline',
    },
    'call_endpoint_edit': {
        path: '',
        key: 'call_endpoint_edit',
        icon: 'cloud-download-outline',
    },
    'dialplan_list': {
        path: '/settings/dialplan',
        key: 'dialplan_list',
        icon: 'keypad-outline',
    },
    'dialplan_create': {
        path: '/settings/dialplan/create',
        key: 'dialplan_create',
        icon: 'keypad-outline',
    },
    'dialplan_delete': {
        path: '',
        key: 'dialplan_delete',
        icon: 'keypad-outline',
    },
    'dialplan_show': {
        path: '',
        key: 'dialplan_show',
        icon: 'keypad-outline',
    },
    'dialplan_edit': {
        path: '',
        key: 'dialplan_edit',
        icon: 'keypad-outline',
    },
    'number_list': {
        path: '/settings/number',
        key: 'number_list',
        icon: 'cellular-outline',
    },
    'number_create': {
        path: '/settings/number/create',
        key: 'number_create',
        icon: 'cellular-outline',
    },
    'number_remove': {
        path: '',
        key: 'number_remove',
        icon: 'cellular-outline',
    },
    'number_show': {
        path: '',
        key: 'number_show',
        icon: 'cellular-outline',
    },
    'number_edit': {
        path: '',
        key: 'number_edit',
        icon: 'cellular-outline',
    },
    'soft_phone': {
        path: '',
        key: 'soft_phone',
        icon: '',
    },
    'permit_list': {
        path: '',
        key: 'permit_list',
        icon: '',
    },
    'permit_add': {
        path: '',
        key: 'permit_add',
        icon: '',
    },
    'permit_remove': {
        path: '',
        key: 'permit_remove',
        icon: '',
    },
    'number_delete': {
        path: '',
        key: 'number_delete',
        icon: '',
    },
    'blacklist_list': {
        path: '/settings/blacklist',
        key: 'blacklist_list',
        icon: 'eye-off-outline',
    },
    'blacklist_create': {
        path: '/settings/blacklist/create',
        key: 'blacklist_create',
        icon: 'eye-off-outline',
    },
    'blacklist_show': {
        path: '',
        key: 'blacklist_show',
        icon: 'eye-off-outline',
    },
    'blacklist_delete': {
        path: '',
        key: 'blacklist_delete',
        icon: 'eye-off-outline',
    },
    'blacklist_edit': {
        path: '',
        key: 'blacklist_edit',
        icon: 'eye-off-outline',
    },
    'contact_list': {
        path: '/operation/contact',
        key: 'contact_list',
        icon: 'person-circle-outline',
    },
    'contact_create': {
        path: '/operation/contact/create',
        key: 'contact_create',
        icon: 'person-circle-outline',
    },
    'contact_show': {
        path: '',
        key: 'contact_show',
        icon: 'person-circle-outline',
    },
    'contact_delete': {
        path: '',
        key: 'contact_delete',
        icon: 'person-circle-outline',
    },
    'contact_edit': {
        path: '',
        key: 'contact_edit',
        icon: 'person-circle-outline',
    },
    'result_code_list': {
        path: '/operation/result-code',
        key: 'result_code_list',
        icon: 'bookmark-outline',
    },
    'result_code_create': {
        path: '/operation/result-code/create',
        key: 'result_code_create',
        icon: 'bookmark-outline',
    },
    'result_code_show': {
        path: '',
        key: 'result_code_show',
        icon: 'bookmark-outline',
    },
    'result_code_delete': {
        path: '',
        key: 'result_code_delete',
        icon: 'bookmark-outline',
    },
    'result_code_edit': {
        path: '',
        key: 'result_code_edit',
        icon: 'bookmark-outline',
    },
    'sms_template_list': {
        path: '/operation/sms-template',
        key: 'sms_template_list',
        icon: 'chatbox-ellipses-outline',
    },
    'sms_template_create': {
        path: '/operation/sms-template/create',
        key: 'sms_template_create',
        icon: 'chatbox-ellipses-outline',
    },
    'sms_template_show': {
        path: '',
        key: 'sms_template_show',
        icon: 'chatbox-ellipses-outline',
    },
    'sms_template_delete': {
        path: '',
        key: 'sms_template_delete',
        icon: 'chatbox-ellipses-outline',
    },
    'sms_template_edit': {
        path: '',
        key: 'sms_template_edit',
        icon: 'chatbox-ellipses-outline',
    },
    'pending_session': {
        path: '',
        key: 'pending_session',
        icon: '',
    },
    'inbound_report': {
        path: '',
        key: 'inbound_report',
        icon: 'arrow-undo-outline',
    },
    'outbound_report': {
        path: '',
        key: 'outbound_report',
        icon: 'arrow-redo-outline',
    },
    'all_calls_report': {
        path: '',
        key: 'all_calls_report',
        icon: 'reader-outline',
    },
    'missed_calls': {
        path: '',
        key: 'missed_calls',
        icon: 'ban-outline',
    },
    'crm_form_list': {
        path: '/operation/crm-custom',
        key: 'crm_form_list',
        icon: 'book-outline',
    },
    'crm_form_create': {
        path: '/operation/crm-custom/create',
        key: 'crm_form_create',
        icon: 'book-outline',
    },
    'crm_form_show': {
        path: '',
        key: 'crm_form_show',
        icon: 'book-outline',
    },
    'crm_form_delete': {
        path: '',
        key: 'crm_form_delete',
        icon: 'book-outline',
    },
    'crm_form_edit': {
        path: '',
        key: 'crm_form_edit',
        icon: 'book-outline',
    },
    'crm_form_report': {
        path: '/reports/crm-form',
        key: 'crm_form_report',
        icon: 'funnel-outline',
    },
}

export const isAuthActive = false