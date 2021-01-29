<template>
    <card-container
        id="students"
        :loading="loading"
        :page-title="`Meus professores (${ teachers.length })`">
        <template v-slot:header>
            <v-spacer />
            <v-text-field
                class="search-student"
                v-model="searchStudent"
                label="Buscar professor"
                placeholder="Insira o nome ou email do professor"
                hide-details
                dense
                append-outer-icon="mdi-magnify" />
        </template>
        <div class="students-area">
            <person-card
                @click="handleTeacher"
                class="ma-2 pa-2"
                v-for="(teacher, index) in teachers"
                :key="index"
                v-bind="teacher" />
        </div>
    </card-container>
</template>

<script>
import PersonCard from "../../../components/utils/PersonCard.vue"
import StudentService from "../../../services/StudentService";
import { mapState, mapActions } from "vuex"
import CardContainer from '../../../components/base/CardContainer.vue';

const studentService = new StudentService();

export default {
    components: {
        PersonCard,
        CardContainer,
    },
    data() {
        return {
            page: 1,
            limit: 20, 
            search: "",
            teachers: [],
            searchStudent: "",
            loading: false
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
        handleTeacher({ id }) {
            this.$router.push({ name: "studentTeacherDetails", params: { id }})
        },
        async listStudentsByTeacherId({ studentId }) {
            this.loading = true
            try {
                const response = await studentService.listTeachers({
                    page: this.page,
                    limit: this.limit,
                    search: this.search,
                    studentId
                })

                this.teachers = response.data.items
                this.page = response.data.currentPage
            }
            catch(error) {
                this.teachers = []
                this.page = 1

                throw error
            }
            this.loading = false
        },
    },
    async created() {
        await this.listStudentsByTeacherId({ studentId: this.id })
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