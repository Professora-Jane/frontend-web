<template>
    <card-dialog
        v-bind="{...$props, ...$attrs}"
        :active="active"
        @close="closeDialog">
        <template v-slot:header>
            Adicionar estudante
        </template>
        <div>
            <v-text-field
                :rules="emailRules"
                :error="!!errorMessages.length"
                :error-messages="errorMessages"
                label="Email do aluno"
                v-model="email" />
        </div>
        <template v-slot:footer>
            <v-btn
                color="secondary"
                text
                @click="closeDialog">
                Cancelar
            </v-btn>
            <v-spacer />
            <v-btn
                color="green darken-1"
                text
                :loading="$attrs['btn-loading'] || false"
                @click="addStudent">
                confirmar
            </v-btn>
        </template>
    </card-dialog>
</template>

<script>
import CardDialog from "../../base/dialogs/CardDialog.vue"

export default {
    props: {
        active: {
            required: true,
            type: Boolean
        },
        errorMessages: {
            required: false,
            type: String,
            default: ""
        }
    },
    components: {
        CardDialog
    },
    data() {
        return {
            email: "",
            emailRules: [
                v => !!v || 'Campo obrigatório',
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail deve ser válido'
            ]
        }
    },
    methods: {
        closeDialog() {
            this.$emit("close")
        },
        addStudent() {
            this.$emit("addStudent", { studentEmail: this.email})
        }
    }
}
</script>