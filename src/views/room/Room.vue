<template>
    <card-container
        id="room"
        :page-title="roomDetails.name">
        <template v-slot:header>
            <v-spacer />
            <button-with-tooltip
                large
                bottom
                v-if="!shareType"
                label="Compartilhar WebCam"
                btn-color="transparent"
                icon="mdi-camera"
                @click="shareWebCam" />
            
            <button-with-tooltip
                large
                bottom
                v-if="!shareType"
                label="Compartilhar tela"
                btn-color="transparent"
                icon="mdi-monitor-share"
                @click="shareScreen" />
            
            <button-with-tooltip
                large
                bottom
                v-if="shareType"
                label="Cancelar compartilhamento"
                btn-color="transparent"
                :icon="shareType === 'screen' ? 'mdi-monitor-off': 'mdi-camera-off'"
                @click="stopSharing(shareType)" />

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
                <div
                    id="video-container"
                    class="video-container elevation-2 mr-2" />
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
import RoomService from '../../services/RoomService'
import Peer from "simple-peer"

const roomService = new RoomService();
const peers = {}
let stream = undefined

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
            onReceivedPeerOfferToken: undefined,
            roomDetails: {
                name: ""
            },
            connectedParticipants: undefined,
            roomId: undefined,
            chatMessages: [],
            chatMessage: "",
            videoGrid: undefined,
            connectionVideo: undefined,
            offer: undefined,
            stream: undefined,
            shareType: undefined
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
        getInitiator(peer) {
            if (this.id === this.roomDetails.adminId || this.roomDetails.details.currentParticipants.length === 0)
                return false
            else {
                return this.roomDetails.details.currentParticipants.map(item => item.id).includes(peer)
            }
        },
        onReceivedPeerOffer({ offer, participantId }) {
            if (offer && peers[participantId]) {
                if (!peers[participantId].inConnection) {
                    peers[participantId].signal(offer)
                }
                else if (!this.shareType) {
                    peers[participantId].signal(offer)
                }
            }
        },
        onReceivedMessage(content) {
            this.chatMessages.push(content)
        },
        onParticipantJoin(content) {
            this.connectedParticipants = content.currentUsers
            this.chatMessages.push({
                senderid: content.user.id,
                name: content.user.name,
                content: "Se juntou à sala",
                type: "join"
            })

            if (content.user.id !== this.id) {
                this.initPeerConnection({ peerId: content.user.id })
            }

            this.$wsEmit("room:peerOffer", {
                participantId: this.id,
                offer: this.offer,
                roomId: this.roomId,
                sendToSelf: false
            })
        },
        onParticipantLeave(content) {
            this.connectedParticipants = content.currentUsers

            this.chatMessages.push({
                senderid: content.user.id,
                name: content.user.name,
                content: "Saiu da sala",
                type: "leave"
            })

            this.destroyPeer(content.user.id)
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
        leavingRoom() {
            if (this.shareType) {
                this.stopSharing(this.shareType)
            }

            Object.keys(peers).map(id => this.destroyPeer(id))

            this.$wsEmit('room:leave', {
                roomId: this.roomId,
                participantId: this.id
            })
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
        stopSharing(type) {
            stream.getTracks().forEach(track => track.stop())

            Object.keys(peers).map(id => {
                peers[id].removeStream(stream)
                peers[id].send(`stopSharing-${type}`)
            })

            document.getElementById(`video-${this.id}`).remove()

            this.shareType = undefined
            stream = undefined
        },
        async shareScreen() {
            try {
                stream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true})
                this.share("screen")

            }
            catch(error) {
                console.error(error)
            }
        },
        async shareWebCam() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                this.share("video")
            }
            catch(error) {
                console.error(error)
            }
        },
        share(type) {
            const  video = document.createElement('video')                    
            this.videoGrid.appendChild(video)

            video.id = `video-${this.id}` 
            
            video.autoplay = true
            video.srcObject = stream
            video.muted = true
            video.controls = true
            
            video.play()
            
            Object.keys(peers).map(id => peers[id].addStream(stream))

            this.shareType = type
        },
        destroyPeer(peerId) {
            if (peers[peerId]) {
                peers[peerId].destroy()
                delete peers[peerId]
            }
        },
        initPeerConnection({ peerId }) {

            if (!peers[peerId]) {
                console.log(`Initiator::  ${this.getInitiator(peerId)};; peerId ${peerId}`)
                peers[peerId] = new Peer({
                    initiator: this.getInitiator(peerId),
                    ...(!!stream && { stream: stream })
                })
    
                peers[peerId].on("connect", () => {
                    console.log("Connetado ao peer")
                    peers[peerId].inConnection = true
                })
    
                peers[peerId].on('signal', (data) => {
                    if (data.renegotiate || data.transceiverRequest)  {
                        console.log("Renegociando DADOS")
                    }
                    this.offer = data
                    this.$wsEmit("room:peerOffer", {
                        roomId: this.roomId,
                        participantId: this.id,
                        offer: data,
                        sendToSelf: false
                    })
                })
    
                peers[peerId].on('stream', (stream) => {
                    console.log("stream")
                    const  video = document.createElement('video')                    
                    this.videoGrid.appendChild(video)
    
                    video.id = `video-${peerId}` 
                    video.srcObject = stream
                    video.controls = true
                    video.muted = true
                    video.play()

                })

                peers[peerId].on('close', () => {
                    console.log("lost")
                    
                    const videoToRemove = document.getElementById(`video-${peerId}`);

                    if (videoToRemove)
                        videoToRemove.remove()
                    
                    this.destroyPeer(peerId)
                })
                
                peers[peerId].on('data', (data) => {
                    let ev = data;
                    
                    if (typeof data !== "string")
                        ev = new TextDecoder("utf-8").decode(data)

                    if (ev.includes("stopSharing")) {
                        console.log("Stream removida")
                        const videoToRemove = document.getElementById(`video-${peerId}`);

                        if (videoToRemove)
                            videoToRemove.remove()
                    }
                })
                
                peers[peerId].on('error', () => {
                    console.log(`Peer deu ruim:: peerId ${peerId}`)

                    const videoToRemove = document.getElementById(`video-${peerId}`);

                    if (videoToRemove)
                        videoToRemove.remove()
                    
                    this.destroyPeer(peerId)
                })
            }
        },
        startHandlers() {
            window.addEventListener('beforeunload', this.leavingRoom)

            this.onReceivedMessageToken = socketHandlerInstance.on('room:chat', this.onReceivedMessage)
            this.onParticipantJoinToken = socketHandlerInstance.on('room:participantJoin', this.onParticipantJoin)
            this.onParticipantLeaveToken = socketHandlerInstance.on('room:participantLeave', this.onParticipantLeave)
            this.onReceivedPeerOfferToken = socketHandlerInstance.on('room:peerOffer', this.onReceivedPeerOffer)
        },
        leavingRoomHandlers() {
            socketHandlerInstance.off(this.onReceivedMessageToken)
            socketHandlerInstance.off(this.onParticipantJoinToken)
            socketHandlerInstance.off(this.onParticipantLeaveToken)
            socketHandlerInstance.off(this.onReceivedPeerOfferToken)
            this.leavingRoom()
            window.removeEventListener("beforeunload", this.leavingRoom)
        }
    },
    async created() {
        this.roomId = this.$route.params.id
    },
    async mounted() {
        await this.getRoomDetails()

        if (this.roomDetails.status === "criado") {
            this.$router.push({ name: "room" })
        }
        else if (this.roomDetails.status === this.currentRoomOnGoingState) {
            this.startHandlers()

            this.videoGrid = document.getElementById("video-container")

            if (this.roomDetails.details.currentParticipants.length) {
                this.roomDetails.details.currentParticipants.map(item => {
                    if (item.id != this.id)
                        this.initPeerConnection({ peerId: item.id })
                })
            }

            this.$wsEmit('room:join', {
                roomId: this.roomId,
                participantId: this.id,
                participantName: this.name
            })
        }
    },
    beforeDestroy() {
        this.leavingRoomHandlers()
    },
}
</script>

<style lang="scss">
#room {
    .video-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        grid-auto-rows: 300px;

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
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
