<template>
    <v-navigation-drawer
        width="200"
        permanent
        color="transparent">
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="title">
                    Professor
                </v-list-item-title>
                <v-list-item-subtitle>
                    TODO
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-divider />
        <v-list
            dense
            nav>
            <v-list-item
                v-for="item in sidebarItens"
                :key="item.title"
                @click="item.handler(item.routeTo)"
                link>
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    data() {
        return {
            sidebarItens: [
                {
                    title: "Meus alunos",
                    icon: "mdi-account-multiple",
                    routeTo: "students",
                    handler: route => this.handleSidebarItem(route)
                },
                {
                    title: "Minhas aulas",
                    icon: "mdi-calendar-account",
                    routeTo: "schedule",
                    handler: route => this.handleSidebarItem(route)
                },
                {
                    title: "Sala de aula",
                    icon: "mdi-google-classroom",
                    routeTo: "room",
                    handler: route => this.handleSidebarItem(route)
                },
            ]
        }
    },
    methods: {
        handleSidebarItem(route) {
            this.$router.push({ name: route }).catch(() => ({}))
        }
    }
}
</script>

<style lang="scss">
.v-navigation-drawer__border {
    display: none;
}
</style>