<template>
    <v-navigation-drawer
        width="200"
        permanent
        color="transparent">
        <v-list
            dense
            nav>
            <template
                v-for="(item, index) in sidebarItens">
                <v-list-item
                    :key="index"
                    v-if="userHasPermission(item.requiredUserType)"
                    @click="item.handler"
                    link>
                    <v-list-item-content>
                        <div class="d-flex align-center">
                            <v-icon 
                                class="mr-2">
                                {{ item.icon }}
                            </v-icon> 
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </div>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            sidebarItens: [
                {
                    title: "Alunos",
                    icon: "mdi-account-multiple",
                    handler: () => this.handleSidebarItem("students"),
                    requiredUserType: ["professor"]
                },
                {
                    title: "Agenda",
                    icon: "mdi-calendar-account",
                    handler: () => this.handleSidebarItem("schedule"),
                    requiredUserType: ["professor"]
                },
                {
                    title: "Sala de aula",
                    icon: "mdi-google-classroom",
                    handler: () => this.handleSidebarItem("room"),
                    requiredUserType: ["professor"]
                },
                {
                    title: "Professores",
                    icon: "mdi-account-multiple",
                    handler: () => this.handleSidebarItem("studentTeachers"),
                    requiredUserType: ["aluno"]
                },
                {
                    title: "Agenda",
                    icon: "mdi-calendar-account",
                    handler: () => this.handleSidebarItem("studentSchedule"),
                    requiredUserType: ["aluno"]
                },
                {
                    title: "Entrar em aula",
                    icon: "mdi-google-classroom",
                    handler: () => this.$emit("studentClassRoom"),
                    requiredUserType: ["aluno"]
                },
            ]
        }
    },
    computed: {
        ...mapState("authUser", [ "type" ])
    },
    methods: {
        handleSidebarItem(route) {
            this.$router.push({ name: route }).catch(() => ({}))
        },
        userHasPermission(necessaryPermissions) {
            return necessaryPermissions.includes(this.type)
        }
    }
}
</script>

<style lang="scss">
.v-navigation-drawer__border {
    display: none;
}
</style>