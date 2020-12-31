import HttpClientBuilder from "./HttpClient";

export default class DisciplineService {
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
     */
    async listDisciplines({ page = 1, limit = 20, search = "" }) {
        
        const response = await this.client.get(`/disciplines?page=${page}&limit=${limit}&search=${search}`)

        return response
    }
}