<template>
    <div id="base-component">
        <BaseHeader />
        <v-main>
            <Sidebar />
            <router-view></router-view>
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
    }
}
</style>