<template>
    <card-dialog
        v-bind="{...$props, ...$attrs}"
        :active="active"
        @close="closeDialog">
        <template v-slot:header>
            Ir para sala de aula
        </template>
        <v-form
            class="pt-3"
            ref="form"
            v-model="valid"
            lazy-validation>
            <span 
                color="red"
                class="error-details"
                v-if="error">
                {{ error }}
            </span>

            <v-text-field
                :rules="rules"
                label="Id da sala"
                placeholder=""
                v-model="roomId" />
        </v-form>
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
                @click="confirm">
                Ir para sala
            </v-btn>
        </template>
    </card-dialog>
</template>

<script>
import CardDialog from "../../base/dialogs/CardDialog.vue"

export default {
    components: {
        CardDialog
    },
    props: {
        active: {
            required: true,
            type: Boolean
        },
        error: {
            required: false,
            default: "",
            type: [Error, String]
        }
    },
    data() {
        return {
            valid: false,
            roomId: "",
            rules: [
                v => !!v || 'Campo obrigatório',
            ]
        }
    },
    methods: {
        closeDialog() {
            this.$emit("close")
        },
        confirm() {
            if (this.$refs.form.validate())
                this.$emit("confirm", { roomId: this.roomId })
        }
    }
}
</script>