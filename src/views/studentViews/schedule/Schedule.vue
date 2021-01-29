<template>
    <card-container
        id="schedule"
        page-title="Minha agenda">
        <div class="pa-3">
            <calendar
                key="scheduleCalendar"
                :events="events" />
        </div>
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../../components/base/CardContainer.vue"
import Calendar from "../../../components/schedule/Calendar.vue"
import StudentService from '../../../services/StudentService'

const studentService = new StudentService();
export default {
    components: {
        CardContainer,
        Calendar
    },
    data() {
        return {
            events: [],
            page: 1,
            // TODO remover hardcoded
            limit: 100,
        }
    },
    computed: {
        ...mapState("authUser", [ 'id' ])
    },
    methods: {
        
        async getStudentClasses() {
            try {
                const response = await studentService.listClasses({ studentId: this.id })
                this.events = response.data;
            }
            catch(error) {
                console.error(error)
            }
        },
    },
    async created() {
       await this.getStudentClasses()
    },
}
</script>

