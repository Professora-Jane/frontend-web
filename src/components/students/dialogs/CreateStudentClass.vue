<template>
    <card-dialog
        v-bind="{...$props, ...$attrs}"
        :active="active"
        @close="closeDialog">
        <template v-slot:header>
            Adicionar classe
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
                v-if="Array.isArray(studentId)"
                label="Email do aluno"
                v-model="email" />
            
            <v-menu
                ref="menuStart"
                v-model="menuStart"
                :close-on-content-click="false"
                :return-value.sync="timeStart"
                transition="scale-transition"
                offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="timeStart"
                        label="Horário de início"
                        readonly
                        :rules="[v => !!v || 'É necessário informar a hora de início']"
                        v-bind="attrs"
                        v-on="on" />
                </template>
                <v-time-picker
                    v-if="menuStart"
                    v-model="timeStart"
                    :max="timeEnd"
                    full-width
                    format="24hr"
                    required
                    @click:minute="$refs.menuStart.save(timeStart)" />
            </v-menu>
            
            <v-menu
                ref="menuEnd"
                v-model="menuEnd"
                :close-on-content-click="false"
                :return-value.sync="timeEnd"
                
                transition="scale-transition"
                offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="timeEnd"
                        label="Horário de fim"
                        readonly
                        v-bind="attrs"
                        :rules="[v => !!v || 'É necessário informar a hora de fim']"
                        v-on="on" />
                </template>
                <v-time-picker
                    v-if="menuEnd"
                    v-model="timeEnd"
                    :min="timeStart"
                    full-width
                    format="24hr"
                    required
                    @click:minute="$refs.menuEnd.save(timeEnd)" />
            </v-menu>

            <v-combobox
                item-text="name"
                item-value="id"
                v-model="weekDays"
                :items="weekDaysItems"
                label="Dias da semana"
                chips
                deletable-chips
                required
                :rules="[v => !!v.length || 'É necessário escolher os dias de aula']"
                multiple />
            
            <v-select
                item-text="name"
                item-value="id"
                v-model="selectedDiscipline"
                :items="disciplines"
                label="Disciplina"
                :rules="[v => !!v || 'É necessário informar a disciplina ministrada']"
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
import CardDialog from "../../base/CardDialog.vue"

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
        },
        disciplines: {
            required: true,
            type: Array
        },
        studentId: {
            required: true,
            type: [Array, String]
        },
        error: {
            required: false,
            type: String,
            default: ''
        }
    },
    components: {
        CardDialog
    },
    data() {
        return {
            valid: true,
            selectedDiscipline: undefined,
            weekDays: undefined,
            weekDaysItems: [
                { name: "Domingo", id: 0 },
                { name: "Segunda", id: 1 },
                { name: "Terça", id: 2 },
                { name: "Quarta", id: 3 },
                { name: "Quinta", id: 4 },
                { name: "Sexta", id: 5 },
                { name: "Sábado", id: 6 },
            ],
            timeStart: null,
            timeEnd: null,
            menuStart: false,
            menuEnd: false,
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
            if (this.validate()) {
                this.$emit("createClass", { 
                    studentId: this.studentId,
                    startTime: this.timeStart,
                    endTime: this.timeEnd,
                    daysOfWeek: this.weekDays.map(item => item.id),
                    discipline: this.selectedDiscipline
                })
            }
            else {
                console.error("deu ruim")
            }
        },
        validate () {
            return this.$refs.form.validate()
        },
    }
}
</script>

<style lang="scss" scoped>
.error-details {
    font-size: 12px;
    color: red;
    margin-bottom: 15px;
    display: block;
    text-indent: 15px;
    text-align: justify;
}
</style>