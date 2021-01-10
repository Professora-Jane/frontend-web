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
            <v-menu 
                attach="#base-header"
                content-class="user-settings"
                left
                offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on">
                        <v-icon>
                            mdi-account
                        </v-icon>
                    </v-btn>
                </template>
                <div 
                    class="d-flex py-2 px-3 align-center">
                    <img 
                        class="header-profile-img"
                        :src="userImg">
                    <div>
                        <p class="body-2 mb-0">
                            {{ name }}
                        </p>
                        <p class="caption mb-0">
                            {{ email }}
                        </p>
                    </div>
                </div>
                <v-divider />
                <v-list>
                    <!-- <v-list-item
                        class="header-list-item px-2">
                        <v-list-item-title>
                            <v-switch
                                inset
                                v-model="darkTheme"
                                hide-details=""
                                label="Tema escuro"
                                @change="updateDarkTheme" />
                        </v-list-item-title>
                    </v-list-item> -->
                    <v-list-item
                        v-ripple
                        v-for="(item, index) in items"
                        :key="index"
                        class="header-list-item px-2">
                        <v-list-item-title
                            @click="item.handler">
                            <v-icon
                                class="mr-1">
                                {{ item.icon }}
                            </v-icon>
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-container>
    </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
    data() {
        return {
            title: undefined,
            isScrolled: false,
            userProfileImg: undefined,
            items: [
                { title: "Editar perfil", icon: "mdi-account-cog", handler: () => {} },
                { title: "Configurações", icon: "mdi-cog", handler: () => {}},
                { title: "Sair", icon: "mdi-logout-variant", handler: this.logoutUserHandler},
            ],
            darkTheme: false
        }
    },
    watch: {
        '$route': function(value) {
            this.title = value.meta.title
        }
    },
    computed: {
        ...mapState('authUser', [
            'name',
            'email'
        ]),
        userImg() {
            return this.userProfileImg ||  require("../../assets/images/default_user_img.png")
        }
    },
    methods: {
        ...mapActions("authUser", ["logoutUser"]),
        showScroll() {
            this.isScrolled = document.documentElement.scrollTop > 50
        },
        logoutUserHandler() {
            this.logoutUser()
            debugger
            this.$router.push({ name: "login" })
        },
        updateDarkTheme() {
            localStorage.setItem("darkTheme", `${!this.darkTheme}`)
            this.darkTheme = !this.darkTheme
            debugger
            this.$vuetify.theme.dark = this.darkTheme
        }
    },
    created() {
        this.title = this.$router.currentRoute.meta.title
        this.darkTheme = localStorage.getItem("darkTheme") == "true" || false
        this.$vuetify.theme.dark = this.darkTheme
    }
}
</script>

<style lang="scss">
#base-header {
    .user-settings {
        background: $c-white;

        .header-profile-img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .header-list-item {
            cursor: pointer;
            transition: all 0.2s ease-out;

            &:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .v-list-item__title {
                line-height: 1.5;
            }
        }
    }
}
</style>