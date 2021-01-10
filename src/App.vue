<template>
    <v-app>
        <v-fade-transition
            mode="out-in">
            <router-view />
        </v-fade-transition>
    </v-app>
</template>

<script>
import { mapState } from 'vuex';
import { socketInstance } from './externalClients/websockets/socketClient';

export default {
	name: 'App',

	components: {
    
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
