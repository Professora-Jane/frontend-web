import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { socketInstance } from './externalClients/websockets/socketClient';
import { socketHandlerInstance } from './externalClients/websockets/socketHandler';
import VueDraggableResizable from 'vue-draggable-resizable'
import Notifications from 'vue-notification'
import socketMixin from "./mixins/socketMixin";

socketInstance
    .initConnection({ 
        wsServer: "ws://localhost:7112"
     })
    .registerOnMessageHandler(socketHandlerInstance.messageHandler)
    .registerOnErrorHandler(error => console.error(error))

    Vue.config.productionTip = false

Vue.prototype.$wsEmit = (eventName, content) => socketInstance.send(eventName, content)
Vue.mixin(socketMixin)

Vue.use(Notifications)
Vue.component('vue-draggable-resizable', VueDraggableResizable)

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
