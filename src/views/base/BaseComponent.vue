<template>
    <div id="base-component">
        <base-header />
        <v-main>
            <v-container
                id="wrapper">
                <sidebar
                    @studentClassRoom="goToRoomDialog = true" />
                <div 
                    class="px-5 content">
                    <v-fade-transition 
                        mode="out-in">
                        <router-view />
                    </v-fade-transition>
                </div>
            </v-container>
        </v-main>
        <go-to-room-dialog
            max-width="350px"
            :active="goToRoomDialog"
            @confirm="goToRoom"
            @close="goToRoomDialog = false" />
    </div>
</template>

<script>
import GoToRoomDialog from '../../components/room/dialogs/GoToRoomDialog.vue'
import Header from "./Header.vue"
import Sidebar from './Sidebar.vue'

export default {
    components: {
        BaseHeader: Header,
        Sidebar,
        GoToRoomDialog
    },
    data() {
        return {
            goToRoomDialog: false
        }
    },
    methods: {
        routeTo(params) {
            this.$router.push(params)
                .then(() => this.goToRoomDialog = false)
        },
        goToRoom({ roomId }) {
            this.routeTo({ name: "roomDetail", params: { id: roomId }})
        }
    }
}
</script>

<style lang="scss">
body {
    background-color: $bg-default;

    .v-application {
        background: transparent !important;
    }
}

#base-component {
    height: 100%;

    main {
        height: 100%;

        #wrapper {
            height: 100%;
            display: flex;
            width: 100%;

            .content {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>