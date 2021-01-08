<template>
    <div
        id="box-create-teacher">
        <h2 class="h5 mb-1 text-uppercase text-center c-primary-dark">
            Professora Jane
        </h2>
        
        <div
            class="create-teacher mx-4 mb-4 py-6 px-8 elevation-3">
            <h2 class="subtitle-1 mb-1 c-primary-dark text-uppercase">
                Login
            </h2>
            <v-form
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
                    block>
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
export default {
    data() {
        return {
            password: "",
            repeatPassword: "",
            name: "",
            cellPhone: "",
            email: "",
            keepLooged: false,
            rules: [
                v => !!v || 'Campo obrigatório',
            ],
            emailRules: [
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail deve ser válido'
            ],
            type: "prof",
            types: [
                { name: "Professor", id: "prof" },
                { name: "Aluno", id: "aluno" },
            ]
        }
    },
    methods: {
        routeTo(params) {
            this.$router.push(params)
        }
    },
    created() {
        this.type = this.$route.query.type
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
}
.c-primary-dark {
    color: $c-primary_dark;
}

.bg-primary-dark {
    background: $c-primary_dark !important;
    color: $c-white !important
}
</style>