<template>
    <card-container
        id="room"
        :loading="loading"
        :page-title="roomDetails.name">
        <template v-slot:header>
            <time-counter
                :off-set="3"
                :init-time="roomDetails.startTime" />

            <v-spacer />
            <button-with-tooltip
                large
                bottom
                v-if="!shareType && roomDetails.status === currentRoomOnGoingState"
                label="Compartilhar WebCam"
                btn-color="transparent"
                icon="mdi-camera"
                @click="shareWebCam" />
            
            <button-with-tooltip
                large
                bottom
                v-if="!shareType && roomDetails.status === currentRoomOnGoingState"
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
                icon-color="warning"
                btn-color="transparent"
                icon="mdi-door-closed"
                @click="dialogFinishRoom = true" />
        </template>
        <div v-if="roomDetails.status === currentRoomFinishedState">
            <h5 class="pa-3 subtitle-1">
                Sala encerrada. Caso isso seja um erro entre em contato com o criador da sala.
            </h5>
        </div>
        <div
            v-else-if="roomDetails.status === currentRoomOnGoingState"
            class="pa-3 h-100 d-flex flex-column">
            <div
                class="d-flex h-100">
                <div
                    id="video-container"
                    class="video-container mr-2" />
                
                <room-chat-container
                    :room-id="roomId"
                    :current-participants="currentParticipants" />
            </div>
        </div>

        <confirm-dialog
            :active="dialogFinishRoom"
            title="Encerrar aula"
            max-width="350px"
            content="Tem certeza que deseja continuar? Essa ação é irreversível."
            @confirm="finishRoom"
            :btn-loading="btnLoadingFinishingRoom"
            @close="dialogFinishRoom = false" />
    </card-container>
</template>

<script>
import { mapState } from "vuex"
import CardContainer from "../../components/base/CardContainer.vue"
import ButtonWithTooltip from "../../components/utils/ButtonWithTooltip.vue"
import ConfirmDialog from "../../components/base/dialogs/ConfirmDialog.vue"
import RoomChatContainer from "./RoomChatContainer.vue"
import TimeCounter from "../../components/utils/TimeCounter.vue"
import { socketHandlerInstance } from "../../externalClients/websockets/socketHandler"
import RoomService from '../../services/RoomService'
import { peerHandlerInstance } from "../../externalClients/peer/PeerHandler"


const roomService = new RoomService();

export default {
    components: {
        CardContainer,
        ButtonWithTooltip,
        TimeCounter,
        RoomChatContainer,
        ConfirmDialog
    },
    data() {
        return {
            onParticipantLeaveToken: undefined,
            onReceivedPeerOfferToken: undefined,
            onFinishRoomToken: undefined,
            roomDetails: {
                name: "",
                startTime: ""
            },
            roomId: undefined,
            videoGrid: undefined,
            lastPeer: undefined,
            shareType: undefined,
            currentParticipants: [],
            initTime: -1,
            loading: false,
            btnLoadingFinishingRoom: false,
            dialogFinishRoom: false
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
            if (this.id === this.roomDetails.admin)
                return true
            else if (peer === this.roomDetails.admin) 
                return false
            else 
                return !this.currentParticipants.map(item => item.id).filter(id => id !== this.lastPeer).includes(peer)
        },
        onReceivedPeerOffer({ offer, participantId }) {
            if (offer) {
                peerHandlerInstance.signalPeer({ 
                    peerId: participantId,
                    data: offer
                })
            }
        },
        onParticipantJoin(content) {
            this.currentParticipants = content.currentParticipants

            if (content.user.id !== this.roomDetails.admin && content.user.id !== this.id)
                this.lastPeer = content.user.id

            if (content.user.id !== this.id) {
                this.lastPeer = content.user.id
                peerHandlerInstance.initPeerConnection({ peerId: content.user.id })
            }
            else {
                this.loading = false
            }
        },
        async onFinishRoom() {
            this.$router.push({ name: "room"})
        },
        onParticipantLeave(content) {
            this.currentParticipants = content.currentParticipants

            peerHandlerInstance.destroyPeer({ peerId: content.user.id})
        },
        leavingRoom() {
            this.$wsEmit('room:leave', {
                roomId: this.roomId,
                participantId: this.id
            })

            if (this.shareType) {
                this.stopSharing(this.shareType)
            }

            peerHandlerInstance.reInitializeHandlersAndPeers()
        },
        async getRoomDetails() {
            try {
                const response = await roomService.getRoomById({ roomId: this.roomId })

                this.roomDetails = response.data

                this.currentParticipants = response.data?.details?.currentParticipants
            }
            catch(error) {
                console.error(error)
            }
        },
        async finishRoom() {
            try {
                await roomService.finishRoom({ roomId: this.roomId })
            }
            catch(error) {
                console.error(error)
            }
            this.dialogFinishRoom = false
        },
        stopSharing(type) {
            peerHandlerInstance.stream.getTracks().forEach(track => track.stop())

            Object.keys(peerHandlerInstance.peers).map(id => {
                peerHandlerInstance.peers[id].removeStream(peerHandlerInstance.stream)
                peerHandlerInstance.peers[id].send(`stopSharing-${type}`)
            })

            document.getElementById(`video-${this.id}`).remove()

            this.shareType = undefined
            peerHandlerInstance.stream = undefined
        },
        async shareScreen() {
            try {
                peerHandlerInstance.stream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true})
                this.share("screen")

            }
            catch(error) {
                console.error(error)
            }
        },
        async shareWebCam() {
            try {
                peerHandlerInstance.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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
            video.srcObject = peerHandlerInstance.stream
            video.muted = true
            video.controls = true
            
            video.play()
            
            Object.keys(peerHandlerInstance.peers).map(id => peerHandlerInstance.peers[id].addStream(peerHandlerInstance.stream))

            this.shareType = type
        },
        startHandlers() {
            this.onParticipantLeaveToken = socketHandlerInstance.on('room:participantLeave', this.onParticipantLeave)
            this.onParticipantJoinToken = socketHandlerInstance.on('room:participantJoin', this.onParticipantJoin)
            this.onReceivedPeerOfferToken = socketHandlerInstance.on('room:peerOffer', this.onReceivedPeerOffer)
            this.onFinishRoomToken = socketHandlerInstance.on('room:finish', this.onFinishRoom)
            window.addEventListener('beforeunload', this.leavingRoom)
        },
        leavingRoomHandlers() {
            peerHandlerInstance.reInitializeHandlersAndPeers()
            window.removeEventListener("beforeunload", this.leavingRoom)
            socketHandlerInstance.off(this.onReceivedPeerOfferToken)
            socketHandlerInstance.off(this.onParticipantLeaveToken)
            socketHandlerInstance.off(this.onParticipantJoinToken)
            socketHandlerInstance.off(this.onFinishRoomToken)
            this.leavingRoom()
        },
    },
    async created() {
        this.roomId = this.$route.params.id
    },
    async mounted() {
        this.loading = true
        
        await this.getRoomDetails()

        if (this.roomDetails.status === "criado") {
            this.$router.push({ name: "room" })
        }
        else if (this.roomDetails.status === this.currentRoomOnGoingState) {
            this.startHandlers()
            
            peerHandlerInstance
                .registerOnSignalHandler((data,peerId) => {
                    this.$wsEmit("room:peerOffer", {
                        roomId: this.roomId,
                        participantId: this.id,
                        offer: data,
                        to: peerId
                    })
                })
                .registerOnStreamHandler((stream, peerId) => {
                    const  video = document.createElement('video')                    
                    this.videoGrid.appendChild(video)
    
                    video.id = `video-${peerId}` 
                    video.srcObject = stream
                    video.controls = true
                    video.muted = true
                    video.play()
                })
                .registerOnCloseHandler((peerId) => {
                    const videoToRemove = document.getElementById(`video-${peerId}`);

                    if (videoToRemove)
                        videoToRemove.remove()
                })
                .registerOnDataHandler((ev, peerId) => {
                    if (ev.includes("stopSharing")) {
                        const videoToRemove = document.getElementById(`video-${peerId}`);

                        if (videoToRemove)
                            videoToRemove.remove()
                    }
                })
                .registerOnErrorHandler((error, peerId) => {
                    console.error(error)
                    const videoToRemove = document.getElementById(`video-${peerId}`);

                    if (videoToRemove)
                        videoToRemove.remove()
                })
                .registerInitiatorHandler(peerId => this.getInitiator(peerId));


            this.videoGrid = document.getElementById("video-container")

            if (this.roomDetails.details.currentParticipants.length) {
                this.roomDetails.details.currentParticipants.map(item => {
                    if (item.id != this.id)
                        peerHandlerInstance.initPeerConnection({ peerId: item.id })
                })
            }

            this.$wsEmit('room:join', {
                roomId: this.roomId,
                participantId: this.id,
                participantName: this.name
            })
        }
        else {
            this.loading = false
        }
    },
    beforeDestroy() {
        this.leavingRoomHandlers()
    },
}
</script>

<style lang="scss">
#room {
    height: 100%;

    .video-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, 400px);
        grid-auto-rows: 300px;

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .chat-container {
        width: 350px;
    }
}
</style>
