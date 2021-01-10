import HttpClientBuilder from "./HttpClient";

export default class AuthService {
    constructor() {
        let client = HttpClientBuilder.buildClient({
            baseURL: process.env.VUE_APP_API_URL
        });
        this.client = client
    }

    /**
     * 
     * @param { object } params
     * @param { string } [params.id = undefined] - ObjectId do usuário
     * @param { string } params.email - Email do usuário
     * @param { string } params.type - Tipo do usuário (se professor ou aluno)
     * @param { string } params.password - Senha do usuário
     */
    async loginUser({ email, id = undefined, type, password }) {
        
        const response = await this.client.post(`/auth/login`, { email, id, type, password })

        return response
    }
}