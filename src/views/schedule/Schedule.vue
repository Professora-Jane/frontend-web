<template>
    <card-container
        id="schedule"
        page-title="Minha agenda">
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
        <div class="pa-3">
            <calendar
                key="scheduleCalendar"
                :events="events" />
        </div>

        <create-student-class
            :student-id="students" 
            max-width="350px"
            :active="dialog"
            :disciplines="disciplines"
            @createClass="createStudentClass"
            :btn-loading="btnLoading"
            :error="createStudentClassError"
            @close="dialog=false" />
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import TeacherService from "../../services/TeacherService"
import CardContainer from "../../components/base/CardContainer.vue"
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import CreateStudentClass from "../../components/students/dialogs/CreateStudentClass.vue"
import Calendar from "../../components/schedule/Calendar.vue"
import DisciplineService from '../../services/DisciplineService'
import StudentService from '../../services/StudentService'
import ClassService from '../../services/ClassService'

const teacherService = new TeacherService();
const disciplinesService = new DisciplineService();
const studentService = new StudentService();
const classServices = new ClassService()

export default {
    components: {
        CardContainer,
        Calendar,
        ButtonWithTooltip,
        CreateStudentClass
    },
    data() {
        return {
            dialog: false,
            createStudentClassError: "",
            events: [],
            disciplines: [],
            students: [],
            btnLoading: false,
            page: 1,
            // TODO remover hardcoded
            limit: 100,
        }
    },
    computed: {
        ...mapState("authUser", [ 'id' ])
    },
    methods: {
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
                await this.getTeacherClasses()
                this.dialog = false
            }
            catch(error) {
                this.createStudentClassError = error.message
            }
            this.btnLoading = false
        },
        async getTeacherClasses() {
            try {
                const response = await teacherService.listTeacherClasses({ teacherId: this.id })
                this.events = response.data;
            }
            catch(error) {
                console.error(error)
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
        async listStudentsByTeacherId({ teacherId }) {
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
        },
    },
    async created() {
       await this.getTeacherClasses()
       await this.getDisciplines()
       await this.listStudentsByTeacherId({ teacherId: this.id })
    },
}
</script>

