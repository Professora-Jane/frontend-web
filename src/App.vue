<template>
    <v-app>
        <v-fade-transition
            mode="out-in">
            <router-view />
        </v-fade-transition>
        <notifications-with-options />
        <notifications group="foo" />
    </v-app>
</template>

<script>
import { mapState } from 'vuex';
import { socketInstance } from './externalClients/websockets/socketClient';
import NotificationsWithOptions from "./components/notifications/NotificationsWithOptions.vue"

export default {
	name: 'App',

	components: {
        NotificationsWithOptions
	},
    computed: {
        ...mapState('authUser', ['id', 'type'])
    },
	data: () => ({
		//
    }),
    mounted() {
        if (this.id && this.type) {
            socketInstance.connectToServer({
                id: this.id,
                type: this.type
            })
        }
    }
};
</script>
