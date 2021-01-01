<template>
    <v-app-bar
        app
        :flat="!isScrolled"
        dense
        id="base-header"
        v-scroll="showScroll"
        :color="isScrolled ? 'rgba(255,255,255, 0.9)' : 'transparent'">
        <v-container class="d-flex align-center">
            <h2 class="title">
                {{ title }}
            </h2>
            <v-spacer />
            <v-btn
                href="#"
                icon>
                <v-icon>
                    mdi-bell
                </v-icon>
            </v-btn>
            <v-btn
                href="#"
                icon>
                <v-icon>
                    mdi-account
                </v-icon>
            </v-btn>
        </v-container>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            title: undefined,
            isScrolled: false
        }
    },
    watch: {
        '$route': function(value) {
            this.title = value.meta.title
        }
    },
    methods: {
        showScroll() {
            this.isScrolled = document.documentElement.scrollTop > 50
        }
    },
    created() {
        this.title = this.$router.currentRoute.meta.title
    }
}
</script>