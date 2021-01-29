import HttpClientBuilder from "./HttpClient";

export default class TeacherService {
    constructor() {
        let client = HttpClientBuilder.buildClient({
            baseURL: process.env.VUE_APP_API_URL
        });
        this.client = client
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.id - Id doprofessor
     */
    async getTeacherById({ id }) {

        const response = await this.client.get(`/teacher/${id}`)

        return response
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.name - Nome do professor
     * @param { string } params.email - Email do professor
     * @param { string } params.password - Senha do professor
     * @param { string } params.repeatedPassword - Confirmação de senha do professor
     */
    async createTeacher({ name, email, password, repeatedPassword }) {

        const response = await this.client.post(`/teacher`, { name, email, password, repeatedPassword })

        return response
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.teacherId - ObjectId do professor
     * @param { string } [params.studentId = undefined] - ObjectId do aluno
     */
    async listTeacherClasses({ teacherId, studentId = undefined }) {
        const studentQuery = studentId? `?studentId=${studentId}` : ""

        const response = await this.client.get(`/teacher/list/classes/${teacherId}${studentQuery}`)

        return response
    }
    
    /**
     * 
     * @param { object } params
     * @param { string } params.teacherId - ObjectId do professor
     * @param { string } [params.studentId = undefined] - ObjectId do aluno
     * @param { string } [params.studentEmail = undefined] - Email do aluno
     */
    async createTeacherStudent({ teacherId, studentId = undefined, studentEmail = undefined }) {
        const response = await this.client.post("/teacher/student", { teacherId, studentId, studentEmail })

        return response
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.teacherId - ObjectId do professor
     * @param { string } params.studentId - ObjectId do aluno
     */
    async deleteTeacherStudent({ teacherId, studentId  }) {
        const response = await this.client.delete(`/teacher/student/${teacherId}/${studentId}`)

        return response
    }


}