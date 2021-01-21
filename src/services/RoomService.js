import HttpClientBuilder from "./HttpClient";

export default class RoomService {
    constructor() {
        let client = HttpClientBuilder.buildClient({
            baseURL: process.env.VUE_APP_API_URL
        });
        this.client = client
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.roomId - ObjectId da sala
     */
    async getRoomById({ roomId }) {
        
        const response = await this.client.get(`/room/${roomId}`)

        return response
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.adminId - ObjectId do admin da sala
     */
    async getCurrentRoom({ adminId }) {
        
        const response = await this.client.get(`/room/current/${adminId}`)

        return response
    }

    /**
     * 
     * @param { object } params 
     * @param { number } [params.page] - Página atual
     * @param { number } [params.limit] - Limite de itens por página
     * @param { string } params.adminId - ObjectId do admin da sala
     * @param { string } params.search - String de busca
     * @param { string } params.sort - Chave de ordenação
     * @param { number } params.sortType - Tipo de ordenação
     */
    async listFinishedRooms({ adminId, page = 1, limit = 20, search = "", sort = "", sortType = 0}) {
        
        const searchQuery = search? `&search=${search}` : ""
        const sortQuery = sort? `&sort=${sort}` : ""
        const sortTypeQuery = sortType? `&sortType=${sortType}` : ""
        const response = await this.client.get(`/room/list/finished/${adminId}?page=${page}&limit=${limit}${searchQuery}${sortQuery}${sortTypeQuery}`)

        return response
    }
    
    /**
     * 
     * @param { object } params 
     * @param { string } params.adminId - ObjectId do admin da sala
     * @param { string } params.roomName - Nome da sala
     */
    async createRoom({ adminId, roomName }) {
        
        const response = await this.client.post(`/room`, { adminId, name : roomName})

        return response
    }

    /**
     * 
     * @param { object } params 
     * @param { string } params.roomId - ObjectId da sala
     */
    async startRoom({ roomId }) {
        
        const response = await this.client.put(`/room/start/${roomId}`)

        return response
    }
    
    /**
     * 
     * @param { object } params 
     * @param { string } params.roomId - ObjectId da sala
     */
    async finishRoom({ roomId }) {
        
        const response = await this.client.put(`/room/finish/${roomId}`)

        return response
    }
}