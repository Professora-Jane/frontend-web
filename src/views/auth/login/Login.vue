<template>
    <div
        id="box-create-teacher">
        <div class="box-logo">
            <img :src="logo" />
        </div>
        
        <div
            class="create-teacher mx-4 mb-4 py-6 px-8 elevation-3">
            <h2 class="subtitle-1 mb-1 c-primary-dark text-uppercase">
                Login
            </h2>
            <v-form
                ref="form"
                lazy-validation>
                <v-text-field 
                    type="email"
                    v-model="email"
                    :rules="[...rules, ...emailRules]"
                    label="Email" />
                
                <v-text-field 
                    type="password"
                    :rules="rules"
                    v-model="password"
                    label="Senha" />

                <v-select
                    item-text="name"
                    item-value="id"
                    v-model="type"
                    :items="types"
                    label="Logar como"
                    :rules="[v => !!v || 'É necessário informar o tipo de login']"
                    required />

                <div 
                    class="d-flex align-center">
                    <v-checkbox
                        v-model="keepLooged"
                        label="Continuar logado"
                        required />
                    
                    <v-spacer />
                    <p 
                        class="mb-0 password-forgot">
                        Esqueci minha senha
                    </p>
                </div>
                <v-btn
                    class="bg-primary-dark mt-2"
                    depressed
                    block
                    @click="doAuth">
                    Confirmar
                </v-btn>
            </v-form>
        </div>

        <div class="d-flex mx-4">
            <v-btn
                text
                x-small
                @click="routeTo({ name: 'create_teacher' })">
                <v-icon
                    small
                    class="mr-1">
                    mdi-arrow-left
                </v-icon>
                Registrar professor
            </v-btn>
            <v-spacer />
            <v-btn
                text
                x-small
                @click="routeTo({ name: 'create_student' })">
                Registrar aluno
                <v-icon
                    small
                    class="ml-1">
                    mdi-arrow-right
                </v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
    data() {
        return {
            password: "",
            repeatPassword: "",
            name: "",
            cellPhone: "",
            email: "",
            keepLooged: true,
            rules: [
                v => !!v || 'Campo obrigatório',
            ],
            emailRules: [
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail deve ser válido'
            ],
            type: undefined,
            types: [
                { name: "Professor", id: "professor" },
                { name: "Aluno", id: "aluno" },
            ]
        }
    },
    computed: {
        logo() {
            return require("../../../assets/images/logo_transparent.png")
        }
    },
    methods: {
        ...mapActions('authUser', ['loginUser']),
        routeTo(params) {
            this.$router.push(params)
        },
        async doAuth() {
            if (this.$refs.form.validate()) {
                try {
                    await this.loginUser({
                        email: this.email,
                        password: this.password,
                        type: this.type
                    })

                    this.routeTo({ name: "home" })
                }
                catch(error) {
                    console.error(error)
                }
            }
        }
    },
    created() {
        this.type = this.$route.query.type || "professor"
    }
}
</script>

<style lang="scss">
#box-create-teacher {
    margin-top: -80px;

    .create-teacher {
        min-width: 420px;
        background: $c-white;
        border-radius: 8px;
    
    }

    .password-forgot {
        color: $c-primary_dark;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .box-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;

        img {
            width: 180px;
        }
    }
}
.c-primary-dark {
    color: $c-primary_dark;
}

.bg-primary-dark {
    background: $c-primary_dark !important;
    color: $c-white !important
}
</style>