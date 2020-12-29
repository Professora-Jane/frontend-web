<template>
    <div id="base-component">
        <BaseHeader />
        <v-main>
            <v-container
                id="wrapper">
                <Sidebar />
                <div 
                    class="px-5 content">
                    <v-fade-transition 
                        mode="out-in">
                        <router-view />
                    </v-fade-transition>
                </div>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import Header from "./Header.vue"
import Sidebar from "./Sidebar"

export default {
    components: {
        BaseHeader: Header,
        Sidebar
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