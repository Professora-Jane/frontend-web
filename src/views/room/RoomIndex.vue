<template>
    <card-container
        id="room"
        page-title="Salas de aula">
        <template v-slot:header>
            <v-spacer />
            <button-with-tooltip
                large 
                bottom
                label="Criar sala de aula"
                btn-color="transparent"
                icon="mdi-calendar-plus" />
        </template>
        <div class="pa-3">
            <h2
                class="title">
                Sala atual
            </h2>
            <div>
                <div
                    class="current-room" 
                    v-if="currentRoom">
                    <div>
                        {{ currentRoom.name }}
                    </div>

                    <v-btn
                        color="success"
                        @click="startRoom"
                        v-if="currentRoom.status === currentRoomCreatedState">
                        Iniciar sala
                    </v-btn>
                    <v-btn
                        color="success"
                        @click="gotoRoom(currentRoom.id)"
                        v-if="currentRoom.status === currentRoomOnGoingState">
                        Ir até a sala
                    </v-btn>
                    <v-btn
                        color="danger"
                        v-if="currentRoom.status === currentRoomFinishedState">
                        Finalizar sala
                    </v-btn>
                </div>
                <div v-else>
                    Nenhuma sala atual
                </div>
            </div>
            
            <h2
                class="mt-4 title">
                Salas anteriores
            </h2>
            <div v-if="pastRooms.length">
                <div 
                    v-for="room in pastRooms"
                    :key="room.id">
                    {{ room.name }}
                </div>
            </div>
            <div v-else>
                Nenhuma sala anterior
            </div>
        </div>
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../components/base/CardContainer.vue"
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import RoomService from "../../services/RoomService"

const roomService = new RoomService();

export default {
    components: {
        CardContainer,
        ButtonWithTooltip,
    },
    data() {
        return {
            currentRoom: undefined,
            pastRooms: []
        }
    },
    computed: {
        ...mapState("authUser", [ 'id' ]),
        currentRoomCreatedState() {
            return "criado"
        },
        currentRoomOnGoingState() {
            return "andamento"
        },
        currentRoomFinishedState() {
            return "finalizado"
        },
    },
    methods: {
        onReceivedMessage(content) {
            console.log("Recenbo conteúdo via listener")
            console.log(content)
        },
        async getCurrentRoom() {
            try {
                const response = await roomService.getCurrentRoom({ adminId: this.id })

                this.currentRoom = response.data
            }
            catch(error) {
                console.error(error)
                this.currentRoom = undefined
            }
        },
        async listFinishedRooms() {
            try {
                const response = await roomService.listFinishedRooms({ adminId: this.id })

                this.pastRooms = response.data.items
            }
            catch(error) {
                console.error(error)
                this.pastRooms = []
            }
        },
        async startRoom() {
            try {
                await roomService.startRoom({ roomId: this.currentRoom.id })
                this.gotoRoom(this.currentRoom.id)
            }
            catch(error) {
                console.error(error)
            }
        },
        gotoRoom(roomId) {
            this.$router.push({ name: "roomDetail", params: { id: roomId }})
        }
    },
    async created() {
        await this.getCurrentRoom()
        await this.listFinishedRooms()
    }
}
</script>

