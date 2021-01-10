<template>
    <card-container
        id="room"
        :page-title="roomDetails.name">
        <template v-slot:header>
            <v-spacer />
            <button-with-tooltip
                v-if="roomDetails.status === currentRoomOnGoingState && roomDetails.admin === id"
                large 
                bottom
                label="Finalizar aula"
                btn-color="transparent"
                icon="mdi-calendar-plus" />
        </template>
        <div v-if="roomDetails.status === currentRoomFinishedState">
            <h5 class="pa-3 subtitle-1">
                Sala fechada. Caso isso seja um erro entre em contato com o criador da sala.
            </h5>
        </div>
        <div 
            v-else-if="roomDetails.status === currentRoomOnGoingState"
            class="pa-3">
            <h2>Teste</h2>
        </div>
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../components/base/CardContainer.vue"
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import { socketHandlerInstance } from "../../externalClients/websockets/socketHandler"
import { peerClientInstance } from "../../externalClients/peer/peerClient"
import RoomService from '../../services/RoomService'

const roomService = new RoomService();

export default {
    components: {
        CardContainer,
        ButtonWithTooltip,
    },
    data() {
        return {
            onReceivedMessageToken: undefined,
            roomDetails: {

            },
            roomId: undefined
        }
    },
    computed: {
        ...mapState("authUser", [ 'id' ]),
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
        async getRoomDetails() {
            try {
                const response = await roomService.getRoomById({ roomId: this.roomId })

                this.roomDetails = response.data
            }
            catch(error) {
                console.error(error)
            }
        }
    },
    async created() {
        this.roomId = this.$route.params.id

        await this.getRoomDetails()

        if (this.roomDetails.status === "criado")
            this.$router.push({ name: "room" })
        else if (this.roomDetails.status === this.currentRoomOnGoingState) {
            this.onReceivedMessageToken = socketHandlerInstance.on('chat', this.onReceivedMessage)
            peerClientInstance.initConnection(this.id)
        }
        
    },
    mounted() {
        this.$wsEmit('connection', { id: this.id })

        setTimeout(() => this.$wsEmit('chat:enter', { message: "olar" }), 3000)
        setTimeout(() => console.log(peerClientInstance.peer), 5000)
    },
    beforeDestroy() {
        socketHandlerInstance.off(this.onReceivedMessageToken)
    }
}
</script>

