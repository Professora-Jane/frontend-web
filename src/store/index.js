import Vue from 'vue'
import Vuex from 'vuex'
import AuthUser from "./modules/AuthUser"

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
        authUser: AuthUser
	}
})
