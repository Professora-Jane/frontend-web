<template>
    <div
        class="chat-container elevation-2 ml-2 d-flex flex-column">
        <v-tabs 
            v-model="tab">
            <v-tabs-slider />

            <v-tab href="#mensagens">
                Mensagens
            </v-tab>
            <v-tab href="#participantes">
                Participantes
            </v-tab>
        </v-tabs>
        <div
            :class="tab === 'mensagens'? tab : ''"
            class="mt-auto chat-container__content d-none flex-column justify-end"
            id="tab-mensagens">
            <div 
                class="container__content__messages">
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
                        {{ message.content }}
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
        <div
            :class="tab === 'participantes'? tab : ''"
            id="tab-participantes"
            class="chat-container__content d-none flex-column">
            <user-profile-card
                v-for="participant in currentParticipants"
                class="d-flex py-2 px-3 align-center"
                :key="participant.id"
                :name="participant.name"
                :user-img="participant.img" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import UserProfileCard from '../../components/utils/UserProfileCard.vue'
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
    components: {
        UserProfileCard
    },
    data() {
        return {
            onReceivedMessageToken: undefined,
            onParticipantJoinToken: undefined,
            onParticipantLeaveToken: undefined,
            chatMessage: "",
            chatMessages: [],
            tab: "mensagens",
            participants: [],
            divChatContent: undefined
        }
    },
    computed: {
        ...mapState("authUser", [ 'id', 'name' ])
    },
    methods: {
        onReceivedMessage(content) {
            this.chatMessages.push(content)
            this.scrollChatoToBottom()
        },
        onParticipantJoin(content) {
            this.chatMessages.push({
                senderid: content.user.id,
                name: content.user.name,
                content: content.user.id === this.id? "Você entrou na sala" : content.user.name + " se juntou à sala",
                type: "join"
            })
            this.scrollChatoToBottom()
        },
        onParticipantLeave(content) {

            this.chatMessages.push({
                senderid: content.user.id,
                name: content.user.name,
                content: content.user.name + " saiu da sala",
                type: "leave"
            })
            this.scrollChatoToBottom()
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
        async getUserImagePhoto() {
            return require("../../assets/images/default_user_img.png")
        },
        scrollChatoToBottom() {
            setTimeout(() => this.divChatContent.scrollTo({ top: this.divChatContent.scrollHeight, behavior: 'smooth' }), 75)
        }
    },
    created() {
        this.startHandlers()
        this.participants = [...this.currentParticipants]
    },
    mounted() {
        this.divChatContent = document.querySelector(".container__content__messages")
        const chatContainerHeight = document.querySelector(".chat-container__content").offsetHeight
        const chatContainerSendAreaHeight = document.querySelector(".chat-container__content .chat-send").offsetHeight
        this.divChatContent.style.maxHeight = ((chatContainerHeight - chatContainerSendAreaHeight) - 10) + "px"
    },
    beforeDestroy() {
        this.leavingRoomHandlers()
    },
    watch: {
        currentParticipants: function(val) {
            this.participants = val.map(async item => {
                item.img = await this.getUserImagePhoto(item.id)
                return item
            })
        }
    }
}
</script>

<style lang="scss">

.chat-container {
    .v-window__container {
        display: flex;
        
        .v-window-item {
            width: 100%;
        }
    }

    .chat-container__content {
        height: 100%;

        .container__content__messages {
            overflow-y: auto;
        }
    }

    .mensagens, .participantes {
        display: flex !important;
    }
}
</style>