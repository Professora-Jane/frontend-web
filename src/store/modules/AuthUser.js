const SET_TOKEN = "SET_TOKEN";
const SET_ID = "SET_ID";
const SET_NAME = "SET_NAME";
const SET_EMAIL = "SET_EMAIL";

module.exports = {
    state: () => ({
        token: "",
        id: "",
        name: "",
        email: "",
    }),
    mutations: {
        [SET_TOKEN](state, token) {
            state.token = token
        },
        [SET_ID](state, id) {
            state.id = id
        },
        [SET_NAME](state, name) {
            state.name = name
        },
        [SET_EMAIL](state, email) {
            state.email = email
        },
    }, 
    actions: {
        setToken({ commit }, token) {
            commit(SET_TOKEN, token)
        },
        setId({ commit }, id) {
            commit(SET_ID, id)
        },
        setName({ commit }, name) {
            commit(SET_NAME, name)
        },
        setEmail({ commit }, email) {
            commit(SET_TOKEN, email)
        },
    }
}