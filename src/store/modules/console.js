export default {
    state: () => ({
        consoleErrors: localStorage.getItem('consoleErrors') != null ? JSON.parse(localStorage.getItem('consoleErrors')) : [],
        consoleErrorss: '',
    }),
    mutations: {
        setConsoleErrors(state, payload) {
            //state.consoleErrors = payload;
        },
    },
    actions: {
        pushConsoleError({ commit, getters }, payload) {
            let consoleErrorsCache = [...getters.consoleErrors];
            consoleErrorsCache.push({
                ...payload
            });
            consoleErrorsCache = consoleErrorsCache.slice(consoleErrorsCache.length - (consoleErrorsCache.length >= 25 ? 25 : consoleErrorsCache.length));
            localStorage.setItem('consoleErrors', JSON.stringify(consoleErrorsCache));
            commit('setConsoleErrors', consoleErrorsCache)
        }
    },
    getters: {
        consoleErrors: state => { return state.consoleErrors }
    }
}