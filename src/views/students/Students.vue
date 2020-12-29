<template>
    <v-card
        id="students"
        elevation="2">
        <v-card-title
            class="students-title">
            <div>
                Meus alunos ({{ students.length }})
            </div>
            <v-spacer />

            <v-btn
                icon
                depressed>
                <v-icon>mdi-account-multiple-plus</v-icon>
            </v-btn>
        </v-card-title>
        <div class="students-area">
            <student-card
                @click="handleStudent"
                class="ma-2 pa-2"
                v-for="(student, index) in students"
                :key="index"
                v-bind="student" />
        </div>
    </v-card>
</template>

<script>
import StudentCard from "../../components/students/StudentCard.vue"

export default {
    components: {
        StudentCard
    },
    data() {
        return {
            show: false,
            students: [
                {

                    id: "123",
                    name: "Elias Bernardo",
                    email: "teste@teste.com"
                },
                {
                    id: "123",
                    name: "Elias Bernardo",
                    email: "teste@teste.com"
                },
                {
                    id: "123",
                    name: "Elias Bernardo",
                    email: "teste@teste.com"
                },
                {
                    id: "123",
                    name: "Elias Bernardo",
                    email: "teste@teste.com"
                }
            ]
        }
    },
    methods: {
        handleStudent({ id }) {
            this.$router.push({ name: "studentDetails", params: { id }})
        }
    }

}
</script>

<style lang="scss">
#students {
    border-radius: 10px;

    .students-area {
        display: flex;
        flex-wrap: wrap;
    }

    .students-title {
        background-color: $bg-light !important;
    }
}
</style>