export default {
    state: () => ({
        errors: [],
    }),
    mutations: {
        setErrors(state,payload){
            state.errors = payload
        }
    },
    actions: {
        setErrors({commit},payload){
            commit('errors',payload)
        }
    },
    getters: {
        errors: state => { state.errors }
    }
}