<template>
    <div
        id="box-create-teacher">
        <div class="box-logo">
            <img :src="logo">
        </div>
        
        <div
            class="create-teacher mx-4 mb-4 py-6 px-8 elevation-3">
            <h2 class="subtitle-1 mb-1 c-primary-dark text-uppercase">
                Criar professor
            </h2>
            <v-form
                ref="form"
                lazy-validation>
                <v-text-field 
                    v-model="name"
                    :rules="rules"
                    label="Nome" />
                
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
                
                <v-text-field 
                    :rules="[...rules, ...repeatPasswordRules]"
                    v-model="repeatPassword"
                    type="password"
                    label="Repita a senha" />

                <v-btn
                    class="bg-primary-dark mt-2"
                    depressed
                    block
                    @click="registerTeacher">
                    Cadastrar professor
                </v-btn>
            </v-form>
            <p 
                @click="routeTo({ name: 'login', query: { type: 'prof' } })"
                class="caption mt-2 c-primary-dark login">
                Ou talvez você queira fazer login
            </p>
        </div>

        <div class="d-flex mx-4">
            <v-spacer />
            <v-btn
                text
                x-small
                @click="routeTo({ name: 'create_student' })">
                Criar aluno
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
import TeacherService from '../../../services/TeacherService'

const teacherService = new TeacherService()

export default {
    data() {
        return {
            password: "",
            repeatPassword: "",
            name: "",
            email: "",
            rules: [
                v => !!v || 'Campo obrigatório',
            ],
            emailRules: [
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail deve ser válido'
            ],
            repeatPasswordRules: [
                v => v === this.password || "As senhas devem ser iguais"
            ]
        }
    },
    computed: {
        logo() {
            return require("../../../assets/images/logo_transparent.png")
        }
    },
    methods: {
        routeTo(params) {
            this.$router.push(params)
        },
        async registerTeacher() {
            if (this.$refs.form.validate()) {
                try {
                    await teacherService.createTeacher({
                        name: this.name, 
                        email: this.email, 
                        password: this.password,
                        repeatedPassword: this.repeatPassword
                    })

                    this.$router.push({ name: "login", query: { type: "professor" }})
                }
                catch(error) {
                    alert(error)
                }
            }
        }
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

    .login {
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