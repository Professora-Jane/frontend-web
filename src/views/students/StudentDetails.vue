<template>
    <div
        id="student-details">
        <card-container
            page-title="Teste">
            <template v-slot:header>
                <v-spacer />
                <button-with-tooltip
                    large 
                    bottom
                    label="Remover aluno"
                    btn-color="transparent"
                    icon="mdi-account-multiple-remove"
                    @click="dialogDeleteItem = true" />
            </template>
            <div class="d-flex pa-3">
                <div class="profile-img">
                    <v-img
                        class="student-item_img elevation-1"
                        :src="studentData.profilePhoto || defaultImg" />
                </div>
                <div class="ml-5 d-flex flex-column justify-space-around">
                    <p class="mb-1 subtitle">
                        <b class="primary-text">Nome:</b> {{ studentData.name }}
                    </p> 
                    <p class="mb-1 subtitle">
                        <b class="primary-text">E-mail:</b> {{ studentData.email }}
                    </p> 
                    <p class="mb-1 subtitle">
                        <b class="primary-text">Telefone:</b> {{ studentData.cellPhone }}
                    </p> 
                </div>
            </div>
        </card-container>
        <card-container
            class="my-4"
            page-title="Agenda do aluno">
            <template v-slot:header>
                <v-spacer />
                <button-with-tooltip
                    large 
                    bottom
                    label="Adicionar aula"
                    btn-color="transparent"
                    icon="mdi-calendar-plus"
                    @click="dialog=true" />
            </template>
            <calendar 
                key="studentCalendar"
                :events="events" />
        </card-container>

        <create-student-class
            :student-id="studentId" 
            max-width="350px"
            :active="dialog"
            :disciplines="disciplines"
            @createClass="createStudentClass"
            :btn-loading="btnLoading"
            :error="createStudentClassError"
            @close="dialog=false" />
        
        <delete-item-dialog
            :active="dialogDeleteItem"
            title="Excuir aluno"
            max-width="350px"
            content="Remover um aluno também irá remover todas as suas aulas. Tem certeza que deseja continuar? Essa ação é irreversível."
            @delete="deleteStudent"
            :btn-loading="btnLoadingDeleteStudent"
            @close="dialogDeleteItem = false" />
    </div>
</template>

<script>
import StudentService from '../../services/StudentService';
import TeacherService from '../../services/TeacherService';
import DisciplineService from '../../services/DisciplineService';
import ClassService from '../../services/ClassService';

import CardContainer from '../../components/base/CardContainer.vue';
import Calendar from '../../components/schedule/Calendar.vue';
import { mapState } from "vuex";
import ButtonWithTooltip from '../../components/utils/ButtonWithTooltip.vue';
import CreateStudentClass from '../../components/students/dialogs/CreateStudentClass.vue';
import DeleteItemDialog from "../../components/base/dialogs/DeleteItemDialog.vue"

const studentService = new StudentService();
const teacherService = new TeacherService();
const disciplinesService = new DisciplineService();
const classServices = new ClassService();

export default {
    components: {
        CardContainer,
        Calendar,
        ButtonWithTooltip,
        CreateStudentClass,
        DeleteItemDialog
    },
    data() {
        return {
            dialogDeleteItem: false,
            btnLoading: false,
            dialog: false,
            studentId: undefined,
            disciplines: [],
            studentData: {
                name: "",
                cellPhone: "",
                email: "",
                profilePhoto: "",
            },
            createStudentClassError: "",
            page: 1,
            // TODO remover hardcoded
            limit: 100,
            btnLoadingDeleteStudent: false,
            events: []
        }
    },
    computed: {
        defaultImg() {
            return require("../../assets/images/default_user_img.png")
        },
        ...mapState("authUser", [ "id" ])
    },
    methods: {
        async getStudentById() {
            try {
                const response = await studentService.getStudentById({ id: this.studentId })

                this.studentData = response.data
            }
            catch(error) {
                console.error(error)
            }
        },
        async getStudentClasses() {
            try {
                const response = await teacherService.listTeacherClasses({ teacherId: this.id, studentId: this.studentId })
                this.events = response.data || []
            }
            catch (error) {
                this.events = []
            }
        },
        async getDisciplines() {
            try {
                const response = await disciplinesService.listDisciplines({ 
                    page: this.page,
                    limit: this.limit
                })

                this.disciplines = response.data.items

            } 
            catch (error) {
                this.disciplines = []    
            }
        },
        async createStudentClass({ studentId, startTime, endTime, daysOfWeek, discipline }) {
            this.createStudentClassError = ""
            this.btnLoading = true
            try {
                await classServices.listStudentsByTeacherId({ 
                    studentId,
                    startTime,
                    endTime,
                    daysOfWeek,
                    discipline,
                    teacherId: this.id
                })
                await this.getStudentClasses()
                this.dialog = false
            }
            catch(error) {
                this.createStudentClassError = error.message
            }
            this.btnLoading = false
        },
        async deleteStudent() {
            this.btnLoadingDeleteStudent = true
            try {
                await teacherService.deleteTeacherStudent({
                    teacherId: this.id,
                    studentId: this.studentId
                })
                this.dialogDeleteItem = false
                this.$router.push({ name: 'students' })
            }
            catch(error) {
                // TODO notify
                console.error(error)
            }
            this.btnLoadingDeleteStudent = false
            
        }
    },
    async created() {
        this.studentId = this.$route.params.id
        await this.getStudentById()
        await this.getStudentClasses()
        await this.getDisciplines()
    }
       
}
</script>
<style lang="scss">
#student-details {
    .student-item_img {
        height: 180px;
        width: 180px;
        border-radius: 50%;
        margin: auto;
    }
}
</style>