<template>
    <div id="base-component">
        <BaseHeader />
        <v-main>
            <Sidebar />
            <div 
                id="wrapper" 
                class="pa-5">
                <v-fade-transition 
                    mode="out-in">
                    <router-view />
                </v-fade-transition>
            </div>
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
#base-component {
    height: 100%;

    main {
        height: 100%;

        .v-main__wrap {
            display: flex;
        }

        #wrapper {
            width: 100%;
        }
    }
}
</style>