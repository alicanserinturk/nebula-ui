import API from './../../utils/API';
import {currentUser} from '../../constans/config'
import {Message} from "element-ui";

export default {
    state: () => ({
        loading: false,

        currentUser: (localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null),
        config: {},
        favorites: {},
        modules: {},
        settings: (localStorage.getItem('settings') != null ? JSON.parse(localStorage.getItem('settings')) : null),
        loginErrors: null,
    }),
    mutations: {
        setUser(state, payload) {
            state.currentUser = payload
            localStorage.setItem("user", JSON.stringify(payload))
        },
        setLogout(state) {
            state.currentUser = null
        },
        setConfig(state, payload) {
            state.config = payload
        },
        setFavorites(state, payload) {
            state.favorites = payload
        },
        addFavorites(state, payload) {
            state.favorites.push(payload)
        },
        setModules(state, payload) {
            state.modules = payload
        },
        setSettings(state, payload) {
            state.settings = payload
        },
        setSettingValue(state, payload) {
            state.settings = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        },

        setLoginErrors(state, payload){
            state.loginErrors = payload;
        },
        clearLoginErrors(state){
            state.loginErrors = null;
        }
    },
    actions: {
        login({commit}, payload) {
            commit('setLoading', true);
            commit('clearLoginErrors');
            API.login(payload, (response) => {
                let user = response.data.data;
                //Set Remember Me
                if (payload.remember_me) {
                    let cache = {
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                    };
                    let lastUsers = localStorage.getItem('lastUsers') ? JSON.parse(localStorage.getItem('lastUsers')) : [];

                    let cacheIndex = lastUsers.findIndex((item, key) => {
                        return item.email === cache.email;
                    })
                    if (cacheIndex !== -1) {
                        lastUsers.splice(cacheIndex, 1);
                        lastUsers.unshift(cache);
                    } else {
                        lastUsers.unshift(cache);
                    }
                    localStorage.setItem('lastUsers', JSON.stringify(lastUsers));
                }
                //Set User
                commit('setUser', user)
                commit('setLoading', false);
            }, (status, errors) => {
                localStorage.removeItem('user');
                commit('setLoginErrors',errors);
                commit('setLoading', false);
            });
        },
        signout({commit, getters}) {
            return new Promise((resolve) => {
                API.logout(() => {
                    commit('setLogout')
                    localStorage.removeItem('user')
                    resolve(true)
                }, () => {
                    commit('setLogout')
                    localStorage.removeItem('user')
                    resolve(true)
                });
            });
        },
        getConfig({commit}, payload) {
            commit('setConfig', payload)
        },
        getFavorites({commit}, payload) {
            commit('setFavorites', payload)
        },
        getModules({commit}, payload) {
            commit('setModules', payload)
        },
        updateCurrentUser({commit, getters}) {
            commit('setLoading', true);
            let data = getters.currentUser;
            data = {
                id: data.id,
                name: data.name,
                surname: data.surname,
                email: data.email,
                settings: data.settings,
            };
            localStorage.setItem("user", JSON.stringify(getters.currentUser));
            commit('setUser', getters.currentUser);
            API.put('profile/edit', data, (response) => {
                commit('setLoading', false);
            }, () => {
                commit('setLoading', false);
            });
        },
        updateSettings({commit, getters}) {
            commit('setLoading', true);
            API.put('api/setting', getters.settings, (data) => {
                localStorage.setItem("settings", JSON.stringify(getters.settings))
                commit('setSettings', getters.settings);
                commit('setLoading', false);
            });
        },
    },
    getters: {
        currentUser: state => state.currentUser,
        favorites: state => state.favorites,
        modules: state => state.modules,
        config: state => state.config,
        settings: state => state.settings,
        loading: state => state.loading,

        loginErrors: state => state.loginErrors,
    }
}