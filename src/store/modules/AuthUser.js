import AuthService from "../../services/AuthService";
import router from "../../router"

const SET_TOKEN = "SET_TOKEN";
const SET_ID = "SET_ID";
const SET_NAME = "SET_NAME";
const SET_EMAIL = "SET_EMAIL";
const SET_TYPE = "SET_TYPE";

const authService = new AuthService();

export default {
    namespaced: true,
    state: () => ({
        token: localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData")).token || "",
        id: localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData")).id || "",
        name: localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData")).name || "",
        email: localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData")).email || "",
        type: localStorage.getItem("userData") && JSON.parse(localStorage.getItem("userData")).type || "",
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
        [SET_TYPE](state, type) {
            state.type = type
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
            commit(SET_EMAIL, email)
        },
        setType({ commit }, type) {
            commit(SET_TYPE, type)
        },

        logoutUser({ dispatch }) {
            localStorage.removeItem("userData")
            dispatch('setToken', '')
            dispatch('setId', '')
            dispatch('setEmail', '')
            dispatch('setType', '')
            dispatch('setName', '')
            router.push({ name: "login" })
        },
        
        async loginUser({ dispatch }, { email, type, password }) {
            const response = await authService.loginUser({ email, type, password })
            dispatch('setToken', response.data.token)
            dispatch('setId', response.data.id)
            dispatch('setName', response.data.name)
            dispatch('setType', type)
            dispatch('setEmail', email)

            localStorage.setItem("userData", JSON.stringify({
                ...response.data,
                type,
                email,
            }))
        }
    }
}