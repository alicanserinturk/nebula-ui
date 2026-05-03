import { Notification } from 'element-ui';
export default {
    state: () => ({
        version: '3.0.92',
        users: [],
        notifications: localStorage.getItem('notifications') !== null && localStorage.getItem('notifications') !== '' ? JSON.parse(localStorage.getItem('notifications')) : [],
        permissions: {
            microphone: null,
            notification: null,
        },
    }),
    mutations: {
        setVersion(state, payload) {
            state.version = payload
        },
        setPermissionMicrophone(state, payload) {
            state.permissions.microphone = payload
        },
        setPermissionNotification(state, payload) {
            state.permissions.notification = payload
        },
        setUsers(state, payload) {
            state.users = payload
        },
        pushUsers(state, payload) {
            state.users.push(payload)
        },
        setNotifications(state, payload) {
            state.notifications = payload
            localStorage.setItem('notifications', JSON.stringify(payload))
        },
        pushNotifications(state, payload) {
            state.notifications.push({
                ...payload,
                created_at: new Date(),
                read: false,
            })
            localStorage.setItem('notifications', JSON.stringify(state.notifications))
        },
    },
    actions: {
        clearNotifications({ commit, getters }) {
            commit('setNotifications', [])
        },
        readNotifications({ commit, getters }) {
            getters.notifications.forEach(function (notification, index) {
                this[index].read = true;
            }, getters.notifications);
            commit('setNotifications', getters.notifications)
        },
        pushNotification({ commit, getters }, payload) {
            console.log("pushNotification");
            if (getters.currentUser.settings.notifications) {
                commit('pushNotifications', payload)
                if (document.hasFocus()) {
                    Notification({
                        title: payload.title,
                        iconClass: payload.icon,
                        offset: 40,
                        dangerouslyUseHTMLString: true,
                        message: payload.message,
                    });
                } else {
                    new window.Notification(payload.message, {
                        icon: 'https://app.nebulavpbx.com/favicon-production.ico'
                    })
                }
            }
        },
    },
    getters: {
        version: state => {
            return state.version
        },
        permissions: state => {
            return state.permissions
        },
        notifications: state => {
            return state.notifications
        },
        users: state => {
            return state.users
        },
        notificationsCountByModule: state => module => {
            let notifications = [];
            notifications = state.notifications.filter(item => {
                return item.module === module && item.read === false;
            });
            return notifications.length;
        },
        unreadNotificationCount: state => {
            let count = 0;
            state.notifications.forEach((notification) => {
                if (!notification.read) count++;
            });
            return count;
        }
    }
}