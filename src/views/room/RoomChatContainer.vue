<template>
    <div class="chat-container elevation-2 ml-2 d-flex flex-column">
        <div class="chat-container__header pt-2 text-center text-uppercase">
            <h3 class="h3 pa-2">
                Chat
            </h3>
        </div>
        <hr>
        <div 
            class="chat-container__content mt-auto">
            <div
                v-for="(message, index) in chatMessages"
                :key="index"
                class="d-flex flex-column mx-2">
                <p
                    class="body-2 mb-1"
                    style="text-transform: initial;"
                    v-if="message.type === 'message'"
                    :class="message.senderId === id? 'text-right': 'text-left'">
                    <span class="message-content">{{ message.name }}</span>:: {{ message.content }}
                </p>
                <p
                    class="caption text-center mb-0"
                    v-if="message.type !== 'message'">
                    {{ message.name }} {{ message.content }}
                </p>
            </div>
        </div>
        <hr>
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
</template>

<script>
import { mapState } from 'vuex'
import { socketHandlerInstance } from '../../externalClients/websockets/socketHandler'

export default {
    props: {
        currentParticipants: {
            type: Array,
            required: false,
            default: () => []
        },
        roomId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            onReceivedMessageToken: undefined,
            onParticipantJoinToken: undefined,
            onParticipantLeaveToken: undefined,
            chatMessage: "",
            chatMessages: []
        }
    },
    computed: {
        ...mapState("authUser", [ 'id', 'name' ]),
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
        startHandlers() {
            this.onReceivedMessageToken = socketHandlerInstance.on('room:chat', this.onReceivedMessage)
            this.onParticipantJoinToken = socketHandlerInstance.on('room:participantJoin', this.onParticipantJoin)
            this.onParticipantLeaveToken = socketHandlerInstance.on('room:participantLeave', this.onParticipantLeave)
        },
        leavingRoomHandlers() {
            socketHandlerInstance.off(this.onReceivedMessageToken)
            socketHandlerInstance.off(this.onParticipantJoinToken)
            socketHandlerInstance.off(this.onParticipantLeaveToken)
        },
    },
    created() {
        this.startHandlers()
    },
    beforeDestroy() {
        this.leavingRoomHandlers()
    }
}
</script>