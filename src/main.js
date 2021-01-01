import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { socketInstance } from './websockets/socketClient';
import { socketHandlerInstance } from './websockets/socketHandler';

Vue.config.productionTip = false

Vue.prototype.$wsEmit = (eventName, content) => socketInstance.send(eventName, content)

socketInstance
    .initConnection({ wsServer: "ws://localhost:7112" })
    .registerOnMessageHandler(socketHandlerInstance.messageHandler)

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
