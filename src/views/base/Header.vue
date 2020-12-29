<template>
    <v-app-bar
        app
        flat
        dense
        color="transparent">
        <div class="d-flex align-center" />
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
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            title: undefined
        }
    },
    watch: {
        '$route': function(value) {
            this.title = value.meta.title
        }
    },
    created() {
        this.title = this.$router.currentRoute.meta.title
    }
}
</script>