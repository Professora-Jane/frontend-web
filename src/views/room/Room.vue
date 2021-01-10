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

            <div
                class="d-flex">
                <div class="video-container elevation-2 mr-2">
                    Teste
                </div>
                <div class="chat-container elevation-2 ml-2">
                    <div class="chat-content pa-3 pt-2 text-center text-uppercase">
                        <h3 class="h3">
                            Chat
                        </h3>
                        <div 
                            v-for="(message, index) in chatMessages"
                            :key="index"
                            class="d-flex flex-column">
                            <p 
                                class="body-2 mb-1"
                                v-if="message.type === 'message'"
                                :class="message.senderId === id? 'text-left': 'text-right'">
                                <span class="message-content">{{ message.name }}</span>:: {{ message.content }} 
                            </p>
                            <p 
                                class="caption text-center mb-0"
                                v-if="message.type !== 'message'"
                                :class="message.senderId === id? 'text-left': 'text-right'">
                                {{ message.name }} {{ message.content }} 
                            </p>
                        </div>
                    </div>
                    <hr class="mx-2">
                    <div class="chat-send pa-3">
                        <v-text-field 
                            placeholder="Mensagem..."
                            @keydown.enter="sendMessageToRoom"
                            v-model="chatMessage" />
                        <v-btn
                            color="success"
                            @click="sendMessageToRoom"
                            block>
                            Enviar
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../components/base/CardContainer.vue"
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import { socketHandlerInstance } from "../../externalClients/websockets/socketHandler"
//import { peerClientInstance } from "../../externalClients/peer/peerClient"
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
            onParticipantJoinToken: undefined,
            onParticipantLeaveToken: undefined,
            roomDetails: {
                name: ""
            },
            roomId: undefined,
            chatMessages: [],
            chatMessage: ""
        }
    },
    computed: {
        ...mapState("authUser", [ 'id', 'name' ]),
        currentRoomOnGoingState() {
            return "andamento"
        },
        currentRoomFinishedState() {
            return "finalizado"
        },
    },
    methods: {
        onReceivedMessage(content) {
            this.chatMessages.push(content)
        },
        onParticipantJoin(content) {
            this.chatMessages.push({
                senderid: content.user.id,
                name: content.user.name,
                content: "Se juntou à sala",
                type: "join"
            })
        },
        onParticipantLeave(content) {
            this.chatMessages.push({
                senderid: content.user.id,
                name: content.user.name,
                content: "Saiu da sala",
                type: "leave"
            })
        },
        sendMessageToRoom() {
            this.$wsEmit('room:chat', { 
                roomId: this.roomId,
                participantId: this.id,
                participantName: this.name,
                messageContent: this.chatMessage
            })

            this.chatMessage = ""
        },
        async getRoomDetails() {
            try {
                const response = await roomService.getRoomById({ roomId: this.roomId })

                this.roomDetails = response.data
            }
            catch(error) {
                console.error(error)
            }
        },
        leavingRoom() {
            this.$wsEmit('room:leave', { 
                roomId: this.roomId,
                participantId: this.id
            })
        }
    },
    async created() {
        this.roomId = this.$route.params.id

        await this.getRoomDetails()

        if (this.roomDetails.status === "criado")
            this.$router.push({ name: "room" })
        else if (this.roomDetails.status === this.currentRoomOnGoingState) {
            this.$wsEmit('room:join', { 
                roomId: this.roomId,
                participantId: this.id,
                participantName: this.name
            })

            window.addEventListener('beforeunload', this.leavingRoom)

            this.onReceivedMessageToken = socketHandlerInstance.on('room:chat', this.onReceivedMessage)
            this.onParticipantJoinToken = socketHandlerInstance.on('room:participantJoin', this.onParticipantJoin)
            this.onParticipantLeaveToken = socketHandlerInstance.on('room:participantLeave', this.onParticipantLeave)
            
            //peerClientInstance.initConnection(this.id)
        }
        
    },
    mounted() {
        
    },
    beforeDestroy() {
        window.removeEventListener("beforeunload", this.leavingRoom)
        socketHandlerInstance.off(this.onReceivedMessageToken)
        socketHandlerInstance.off(this.onParticipantJoinToken)
        socketHandlerInstance.off(this.onParticipantLeaveToken)
        this.leavingRoom()
    }
}
</script>

<style lang="scss">
#room {
    .video-container {
        width: 100%;
    }

    .chat-container {
        width: 350px;

        .message-content {
            margin-right: 5px;
            font-weight: bold;
        }
    }
}
</style>
