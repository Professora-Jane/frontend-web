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
import TeacherService from "../../services/TeacherService"
import CardContainer from "../../components/base/CardContainer"
import Calendar from "../../components/schedule/Calendar"

const teacherService = new TeacherService();

export default {
    components: {
        CardContainer,
        Calendar
    },
    data() {
        return {
            events: [],
        }
    },
    computed: {
        ...mapState("authUser", [ 'id' ])
    },
    methods: {
        async getTeacherClasses() {
            try {
                const response = await teacherService.listTeacherClasses({ teacherId: this.id })
                this.events = response.data;
            }
            catch(error) {
                console.error(error)
            }
        },
        getExpectedVCalendarTime(time) {
            const hours = time.getMinutes() > 9 ? toString(time.getMinutes()) : "0" + time.getMinutes()
            return time.toISOString().substring(0,10) + " " + time.getHours() + ":" + hours
        },
    },
    async created() {
       await this.getTeacherClasses()
    },
}
</script>

