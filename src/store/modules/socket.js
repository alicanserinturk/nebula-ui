import io from "socket.io-client";
import EventBus from "@/utils/EventBus";

const RECONNECT_GRACE_MS = 15000;
const RECONNECTING_MESSAGE = 'Sunucu ile bağlantınızda sorun var, tekrar deneniyor...';
const GRACE_TIMEOUT_MESSAGE = 'Sunucu bağlantısı kurulamadı, lütfen tekrar giriş yapın.';
let reconnectGraceTimer = null;

function clearReconnectGrace() {
    if (reconnectGraceTimer) {
        clearTimeout(reconnectGraceTimer);
        reconnectGraceTimer = null;
    }
}

function startReconnectGrace() {
    if (reconnectGraceTimer) return;
    reconnectGraceTimer = setTimeout(() => {
        reconnectGraceTimer = null;
        // Connect.vue overlay'i 15 sn boyunca "tekrar deneniyor" mesajını gösterdi;
        // ayrı reason modal göstermeden runLogout'a düş, sebebi URL ile login'e taşı.
        EventBus.$emit('logout:silent', GRACE_TIMEOUT_MESSAGE);
    }, RECONNECT_GRACE_MS);
}

export default {
    state: () => ({
        socket: {
            status: false,
            server: false,
            id: null,
            disconnected: false,
            failed: false,
            failedMessage: null,
            loading: true,
            isFirstConnect: true,
        },
        // SIP multi-tab kilit durumu. Başka sekmede SIP aktif olduğunda
        // "Hatta Gir" butonu disabled olur ve kullanıcıya uyarı gösterilir.
        sipLock: {
            active: false,
            lockedBy: null,
        },
        // Logout sürerken Connect.vue overlay'i ve disconnect handler'ı
        // baskılanır — aksi halde manuel çıkışta da "tekrar deneniyor" yanıp söner.
        loggingOut: false,
    }),
    mutations: {
        setSocket(state, payload) {
            state.socket = payload
        },
        setSocketServer(state, payload) {
            state.socket.server = payload
            state.socket.id = payload && payload.id ? payload.id : null
        },
        setSocketStatus(state, payload) {
            state.socket.status = payload
        },
        setSocketIsFirstConnect(state, payload) {
            state.socket.isFirstConnect = payload
        },
        setSocketLoading(state, payload) {
            state.socket.loading = payload;
        },
        setSocketFailed(state, payload) {
            state.socket.status = false;
            state.socket.server = false;
            state.socket.loading = false;
            state.socket.failed = true;
            state.socket.failedMessage = payload;
        },
        clearSocketFailed(state) {
            state.socket.failed = false;
            state.socket.failedMessage = null;
        },
        setSipLock(state, payload) {
            state.sipLock.active = payload.active;
            state.sipLock.lockedBy = payload.lockedBy || null;
        },
        setLoggingOut(state, payload) {
            state.loggingOut = !!payload;
        },
    },
    actions: {
        /*
        * status_user, status_call, terminate_user, notifications, crm, chat, users_online_status
        * */
        connectSocket({ commit, getters, dispatch }, payload) {
            
            try {
                console.log("Socket: Connecting");
                commit('setSocketLoading', true);
                let server;
                server = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
                    transports: ['websocket'],
                    query: 'token=' + getters.currentUser.api_token,
                    forceNew: true,
                })
                server.on("connect", () => {
                    console.log("Socket: Connected");
                    clearReconnectGrace();
                    commit('setSocketServer', server);
                    commit('setSocketIsFirstConnect', false);
                    commit('setSocketStatus', true);
                    commit('setSocketLoading', false);
                    commit('clearSocketFailed');
                    // Yeni bağlantıda kilit durumu sıfırlanır; arkasından socket
                    // server'dan sip_locked/sip_host_claimed gelebilir.
                    commit('setSipLock', { active: false, lockedBy: null });
                })
                // SIP sahipliği başka tab'de: bağlantı anında kontrol edilir
                server.on("sip_locked", (data) => {
                    console.log("sip_locked", data);
                    commit('setSipLock', { active: true, lockedBy: data && data.locked_by });
                })
                // Bir tab SIP sahipliğini aldı: kendi socket'imiz değilse kilitli moda geç
                server.on("sip_host_claimed", (data) => {
                    console.log("sip_host_claimed", data);
                    if (data && data.socket_id && data.socket_id !== server.id) {
                        commit('setSipLock', { active: true, lockedBy: data.socket_id });
                    }
                })
                // SIP sahipliği boşaldı: kilit kalkar, "Hatta Gir" butonu tekrar aktif
                server.on("sip_host_available", () => {
                    console.log("sip_host_available");
                    commit('setSipLock', { active: false, lockedBy: null });
                })
                server.on("chat", (data) => {
                    console.log("chat", data)
                    if (getters.currentUser && getters.currentUser.settings && getters.currentUser.settings.notifications_chat && getters.currentUser.settings.notifications) {
                        dispatch('pushNotification', {
                            type: 'info',
                            icon: 'el-icon-chat-round',
                            title: 'Yeni Mesaj',
                            message: data.message,
                            primary: data.to,
                            module: 'messages',
                        });
                    }
                });
                server.on("users_is_online", (data) => {
                    console.log("users_is_online", data)
                    let users = getters.users;
                    let userIndex = users.findIndex(user => user.id === data.id);
                    let userIsOnline = false;
                    if (userIndex && userIndex !== -1) {
                        userIsOnline = users[userIndex].is_online;
                        users[userIndex].is_online = data.is_online;
                    }
                    if (getters.currentUser && getters.currentUser.settings && getters.currentUser.settings.notifications_online && getters.currentUser.settings.notifications && data.is_online == true && data.id !== getters.currentUser.id && !userIsOnline && typeof userIsOnline !== 'undefined') {
                        dispatch('pushNotification', {
                            type: 'info',
                            icon: 'el-icon-user',
                            title: 'Çevrimiçi',
                            message: data.name + ' ' + data.surname + ' artık çevrimiçi.',
                            primary: data.id,
                            module: null,
                        });
                    }
                });
                server.on("terminate_user", () => {
                    console.log("Socket: terminate_user");
                    server.close();
                    clearReconnectGrace();
                    EventBus.$emit('logout:silent', 'Sistemde yapılan bir çalışma sebebiyle, oturumunuz sonlandırıldı.');
                });
                server.on("disconnect", (e) => {
                    console.log("Socket: Disconnect", e);
                    if (getters.loggingOut) return;
                    commit('setSocketFailed', RECONNECTING_MESSAGE);
                    startReconnectGrace();
                });
                server.on("connect_error", (e) => {
                    console.log("connect_error", e);
                    if (getters.loggingOut) return;
                    commit('setSocketFailed', RECONNECTING_MESSAGE);
                    startReconnectGrace();
                });
                server.on("error", (e) => {
                    console.log("Socket: error", e);
                    if (getters.loggingOut) return;
                    // Sadece middleware'in kesin reddediliş işareti (socket_connect)
                    // anında çıkış yaptırır. Diğer her şey transient kabul edilir ve
                    // 15 sn grace içinde reconnect denenir.
                    try {
                        const raw = typeof e === 'string' ? e : (e && e.message);
                        const errors = raw ? JSON.parse(raw).errors : null;
                        if (errors && errors.key === 'socket_connect') {
                            server.close();
                            clearReconnectGrace();
                            EventBus.$emit('logout:silent', errors.message);
                            return;
                        }
                    } catch (_) {}
                    commit('setSocketFailed', RECONNECTING_MESSAGE);
                    startReconnectGrace();
                });
                server.on('reconnect_attempt', () => {
                    server.io.opts.query = {
                        token: getters.currentUser.api_token
                    }
                });
            } catch (e) {
                console.log('Socket: Catch Error', e);
            }
        },
        disconnectSocket({ commit, getters }) {
            commit('setLoggingOut', true);
            clearReconnectGrace();
            if (getters.socket.status) {
                getters.socket.server.close();
            }
            commit('setSocketServer', false);
            commit('setSocketIsFirstConnect', false);
            commit('setSocketStatus', false);
            commit('setSocketLoading', false);
            commit('clearSocketFailed');
        },
    },
    getters: {
        socket: state => {
            return state.socket
        },
        socketId: state => {
            return state.socket.id || (state.socket.server && state.socket.server.id) || null;
        },
        sipLock: state => {
            return state.sipLock;
        },
        loggingOut: state => {
            return state.loggingOut;
        },
    }
}