import HttpClientBuilder from "./HttpClient";

export default class ClassService {
    constructor() {
        let client = HttpClientBuilder.buildClient({
            baseURL: process.env.VUE_APP_API_URL
        });
        this.client = client
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.studentId - ObjectId do aluno
     * @param { string } params.teacherId - ObjectId do professor
     * @param { string } params.startTime - Horário de início da aula
     * @param { string } params.endTime - Horário de término da aula
     * @param { Array<number> } params.daysOfWeek - ObjectId do professor
     * @param { string } params.discipline - ObjectId da disciplina
     */
    async listStudentsByTeacherId({ studentId, startTime, endTime, daysOfWeek, discipline, teacherId }) {
        
        const response = await this.client.post(`/class`, {
            studentId, startTime, endTime, daysOfWeek, discipline, teacherId
        })

        return response
    }
}