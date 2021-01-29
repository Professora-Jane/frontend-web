<template>
    <div
        id="student-details">
        <card-container
            page-title="Teste">
            <div class="d-flex pa-3">
                <div class="profile-img">
                    <v-img
                        class="student-item_img elevation-1"
                        :src="teacherData.profilePhoto || defaultImg" />
                </div>
                <div class="ml-5 d-flex flex-column justify-space-around">
                    <p class="mb-1 subtitle">
                        <b class="primary-text">Nome:</b> {{ teacherData.name }}
                    </p> 
                    <p class="mb-1 subtitle">
                        <b class="primary-text">E-mail:</b> {{ teacherData.email }}
                    </p>
                </div>
            </div>
        </card-container>
        <card-container
            class="my-4"
            page-title="Agenda do aluno">
            <calendar 
                key="studentCalendar"
                :events="events" />
        </card-container>
    </div>
</template>

<script>
import StudentService from '../../../services/StudentService';
import TeacherService from '../../../services/TeacherService';
import CardContainer from '../../../components/base/CardContainer.vue';
import Calendar from '../../../components/schedule/Calendar.vue';
import { mapState } from "vuex";

const studentService = new StudentService();
const teacherService = new TeacherService();

export default {
    components: {
        CardContainer,
        Calendar
    },
    data() {
        return {
            teacherId: undefined,
            teacherData: {
                name: "",
                email: "",
                profilePhoto: "",
            },
            createStudentClassError: "",
            page: 1,
            // TODO remover hardcoded
            limit: 100,
            events: []
        }
    },
    computed: {
        defaultImg() {
            return require("../../../assets/images/default_user_img.png")
        },
        ...mapState("authUser", [ "id" ])
    },
    methods: {
        async getTeacherById() {
            try {
                const response = await teacherService.getTeacherById({ id: this.teacherId })

                this.teacherData = response.data
            }
            catch(error) {
                console.error(error)
            }
        },
        async getStudentClasses() {
            try {
                const response = await studentService.listClasses({ teacherId: this.teacherId, studentId: this.id })
                this.events = response.data || []
            }
            catch (error) {
                this.events = []
            }
        },
    },
    async created() {
        this.teacherId = this.$route.params.id
        await this.getTeacherById()
        await this.getStudentClasses()
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