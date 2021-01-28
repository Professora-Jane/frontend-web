<template>
    <card-container
        id="room-index"
        page-title="Salas de aula"
        :loading="loading">
        <template v-slot:header>
            <v-spacer />
            <button-with-tooltip
                large 
                bottom
                label="Criar sala de aula"
                btn-color="transparent"
                icon="mdi-plus"
                @click="createRoomDialog = true" />
        </template>
        <div class="pa-3">
            <v-row>
                <v-col
                    sm="12"
                    md="6"
                    lg="6">
                    <v-card
                        class="h-100"
                        outlined
                        :elevation="0">
                        <v-card-title>
                            Sala atual
                        </v-card-title>
                        <v-card-text
                            class="current-room" 
                            v-if="currentRoom && currentRoom.status">
                            <span>Nome da sala:</span> {{ currentRoom.name }} <br>
                            <span>Id da sala:</span> {{ currentRoom.id }} <br>
                            <span>Data de criação:</span> {{ new Date(currentRoom.creationDate).toLocaleString('pt-br', { timeZone: 'UTC' }) }} <br>
                            <span v-if="currentRoom && currentRoom.status === currentRoomOnGoingState">
                                <span>Duração: </span>
                                <time-counter
                                    init-without-watch
                                    :off-set="3"
                                    ref="counter"
                                    :init-time="currentRoom.startTime" />
                            </span>
                        </v-card-text>
                        <v-card-text v-else>
                            Nenhuma sala atual
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                color="success"
                                text
                                @click="startRoom"
                                v-if="currentRoom && currentRoom.status === currentRoomCreatedState">
                                Iniciar sala
                            </v-btn>
                            <v-btn
                                color="success"
                                text
                                @click="gotoRoom(currentRoom.id)"
                                v-if="currentRoom && currentRoom.status === currentRoomOnGoingState">
                                Ir até a sala
                            </v-btn>
                            <v-btn
                                text
                                color="warning"
                                @click="shareRoom(currentRoom.id)"
                                v-if="currentRoom && currentRoom.status === currentRoomOnGoingState">
                                Finalizar sala
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col
                    sm="12"
                    md="6"
                    lg="6">
                    <v-card
                        outlined
                        :elevation="0">
                        <v-card-title>
                            Entrar em uma sala
                        </v-card-title>
                        <v-card-text class="d-flex align-center">
                            <v-text-field 
                                v-model="roomId"
                                max-width="300px"
                                class="mr-8"
                                label="Id da sala"
                                placeholder="Insira o id da sala" />

                            <v-btn
                                @click="gotoRoom(roomId)"
                                color="success">
                                Entrar
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-card
                class="mt-7"
                outlined
                :elevation="0">
                <v-card-title>
                    Salas anteriores
                </v-card-title>
                <v-card-text>
                    <paginated-data-table
                        ref="dataTable"
                        :initial-limit="20"
                        :excluded-headers="excludedHeaders"
                        :get-items-function="getItemsFunction" />                    
                </v-card-text>
            </v-card>
        </div>

        <create-room-dialog 
            max-width="350px"
            :active="createRoomDialog"
            @close="createRoomDialog = false"
            @confirm="createRoom" />
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../components/base/CardContainer.vue"
import CreateRoomDialog from '../../components/room/dialogs/CreateRoomDialog.vue'
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import RoomService from "../../services/RoomService"
import TimeCounter from "../../components/utils/TimeCounter.vue"
import PaginatedDataTable from "../../components/tables/PaginatedDataTable.vue"

const roomService = new RoomService();

export default {
    components: {
        CardContainer,
        ButtonWithTooltip,
        CreateRoomDialog,
        TimeCounter,
        PaginatedDataTable
    },
    data() {
        return {
            currentRoom: {
                status: undefined,
                startTime: "",
                name: ""
            },
            roomId: "",
            pastRooms: [],
            createRoomDialog: false,
            loading: false,
            excludedHeaders: ["active", "admin", "status", "lastUpdateDate"],
            getItemsFunction: (args) => roomService.listFinishedRooms(args),
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
        async startRoom() {
            try {
                await roomService.startRoom({ roomId: this.currentRoom.id })
                this.gotoRoom(this.currentRoom.id)
            }
            catch(error) {
                console.error(error)
            }
        },
        async createRoom({ roomName }) {
            this.loading = true
            try {
                const response = await roomService.createRoom({
                    adminId: this.id,
                    roomName
                })

                console.log(response)

                await this.getCurrentRoom()

                this.createRoomDialog = false

            } catch(error) {
                console.error(error)
            }

            this.loading = false
        },
        gotoRoom(roomId) {
            this.$router.push({ name: "roomDetail", params: { id: roomId }})
        },
        shareRoom() {
            this.$notify({
                group: 'notification-with-options',
                title: 'Important message',
                type: 'success',
                text: {
                    content: "weqwewqe",
                    options: {
                        success:  {
                            text: "Ir para sala",
                            callback: () => console.log("Indo para sala...")
                        }
                    }
                },
                duration: 30000,
            })
        }
    },
    async created() {
        this.loading = true
        await this.getCurrentRoom()

        await this.$refs.dataTable
            .setInitialArgs({ adminId: this.id })
            .init()

        this.loading = false
    },
    async mounted() {
    }
}
</script>

