<template>
    <card-container
        id="students"
        :loading="loading"
        :page-title="`Meus alunos (${ students.length })`">
        <template v-slot:header>
            <v-spacer />
            <v-text-field
                class="search-student"
                v-model="searchStudent"
                label="Buscar aluno"
                placeholder="Insira o nome ou email do aluno"
                hide-details
                dense
                append-outer-icon="mdi-magnify" />
            <button-with-tooltip 
                bottom
                label="Adicionar"
                btn-color="transparent"
                icon="mdi-account-multiple-plus"
                @click="dialog=true" />
        </template>
        <div class="students-area">
            <person-card
                @click="handleStudent"
                class="ma-2 pa-2"
                v-for="(student, index) in students"
                :key="index"
                v-bind="student" />
        </div>
        <create-teacher-student-dialog 
            max-width="400px"
            :active="dialog"
            :btn-loading="btnLoading"
            :error-messages="createTeacherStudentErrorMessage"
            @addStudent="createTeacherStudent"
            @close="dialog=false" />
    </card-container>
</template>

<script>
import PersonCard from "../../../components/utils/PersonCard.vue"
import StudentService from "../../../services/StudentService";
import { mapState, mapActions } from "vuex"
import CardContainer from '../../../components/base/CardContainer.vue';
import ButtonWithTooltip from '../../../components/utils/ButtonWithTooltip.vue';
import CreateTeacherStudentDialog from '../../../components/students/dialogs/CreateTeacherStudentDialog.vue';
import TeacherService from '../../../services/TeacherService';

const studentService = new StudentService();
const teacherService = new TeacherService();

export default {
    components: {
        PersonCard,
        CardContainer,
        ButtonWithTooltip,
        CreateTeacherStudentDialog
    },
    data() {
        return {
            btnLoading: false,
            dialog: false,
            show: false,
            loading: false,
            page: 1,
            limit: 20, 
            search: "",
            students: [],
            createTeacherStudentErrorMessage: "",
            searchStudent: ""
        }
    },
    computed: {
        ...mapState('authUser', [
            'id'
        ])
    },
    methods: {
        ...mapActions('authUser', [
            'setId'
        ]),
        handleStudent({ id }) {
            this.$router.push({ name: "studentDetails", params: { id }})
        },
        async listStudentsByTeacherId({ teacherId }) {
            this.loading = true
            try {
                const response = await studentService.listStudentsByTeacherId({
                    page: this.page,
                    limit: this.limit,
                    search: this.search,
                    teacherId
                })

                this.students = response.data.items
                this.page = response.data.currentPage
            }
            catch(error) {
                this.students = []
                this.page = 1

                throw error
            }
            this.loading = false
        },
        async createTeacherStudent({ studentEmail }) {
            this.btnLoading = true
            try {
                await teacherService.createTeacherStudent({
                    teacherId: this.id,
                    studentEmail
                })
                
                await this.listStudentsByTeacherId({ teacherId: this.id })
                this.dialog = false
            } 
            catch (error) {
                this.createTeacherStudentErrorMessage = error.message
            }
            this.btnLoading = false
        }
    },
    async created() {
        await this.listStudentsByTeacherId({ teacherId: this.id })
    }
}
</script>

<style lang="scss">
#students {
    .students-area {
        display: flex;
        flex-wrap: wrap;
    }

}
.search-student {
    max-width: 300px !important;
    margin-right: 20px;
}
</style>