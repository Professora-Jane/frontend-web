import HttpClientBuilder from "./HttpClient";

export default class StudentService {
    constructor() {
        let client = HttpClientBuilder.buildClient({
            baseURL: process.env.VUE_APP_API_URL
        });
        this.client = client
    }

    /**
     * 
     * @param { object } params 
     * @param { string } params.name - Nome do aluno
     * @param { string } params.email - Email do aluno
     * @param { string } params.cellPhone - Telefone do aluno
     * @param { string } params.password - senha do aluno
     * @param { string } params.repeatedPassword - repetição de senha
     */
    async createStudent({ name, email, cellPhone, password, repeatedPassword }) {
        
        const response = await this.client.post(`/student`, {
            name, email, cellPhone, password, repeatedPassword
        })

        return response
    }

    /**
     * 
     * @param { object } params 
     * @param { number } [params.page] - Página atual
     * @param { number } [params.limit] - Limite de itens por página
     * @param { string } [params.search] - Termo de busca
     * @param { string } params.teacherId - ObjectId do professor
     */
    async listStudentsByTeacherId({ page = 1, limit = 20, teacherId, search = "" }) {
        
        const response = await this.client.get(`/student/list/byTeacher/${teacherId}?page=${page}&limit=${limit}&search=${search}`)

        return response
    }

    /**
     * 
     * @param { object } params 
     * @param { number } [params.page] - Página atual
     * @param { number } [params.limit] - Limite de itens por página
     * @param { string } [params.search] - Termo de busca
     * @param { string } params.studentId - ObjectId do aluno
     */
    async listTeachers({ page = 1, limit = 20, studentId, search = "" }) {
        
        const response = await this.client.get(`/student/list/teachers/${studentId}?page=${page}&limit=${limit}&search=${search}`)

        return response
    }
    
    /**
     * 
     * @param { object } params 
     * @param { string } params.studentId - ObjectId do aluno
     * @param { string } [params.teacherId = undefined ] - ObjectId do professor
     */
    async listClasses({ studentId, teacherId = undefined }) {
        const teacherIdQuery = teacherId? `teacherId=${teacherId}` : ""

        const response = await this.client.get(`/student/list/classes/${studentId}?${teacherIdQuery}`)

        return response
    }
    
    /**
     * 
     * @param { object } params
     * @param { string } params.id - ObjectId do aluno
     */
    async getStudentById({ id }) {
        
        const response = await this.client.get(`/student/${id}`)

        return response
    }
}