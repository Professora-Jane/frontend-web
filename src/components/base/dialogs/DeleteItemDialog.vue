<template>
    <card-dialog
        v-bind="{...$props, ...$attrs}"
        :active="active">
        <template v-slot:header>
            {{ title }}
        </template>

        <p class="subtitle-1">
            {{ content }}
        </p>

        <v-form
            ref="form"
            v-model="valid"
            lazy-validation>
            <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'Você deve confirmar para continuar!']"
                label="Estou ciente e quero continuar."
                required />
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
                color="warning"
                text
                @click="confirmDeletion">
                Confirmar
            </v-btn>
        </template>
    </card-dialog>    
</template>

<script>
import CardDialog from "./CardDialog.vue";

export default {
    props: {
        content: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            valid: true,
            checkbox: false
        }
    },
    components: {
        CardDialog
    },
    methods: {
        closeDialog() {
            this.$emit('close')
        },
        confirmDeletion() {
            if (this.$refs.form.validate())
                this.$emit('delete')
        }
    }
}
</script>