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
     * @param { string } params.id - ObjectId do aluno
     */
    async getStudentById({ id }) {
        
        const response = await this.client.get(`/student/${id}`)

        return response
    }
}