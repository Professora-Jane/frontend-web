<template>
    <card-container
        id="room"
        :key="roomDetails.id"
        :loading="loading"
        :page-title="roomDetails.name">
        <template v-slot:header>
            <time-counter
                :off-set="3"
                init-without-watch
                :init-time="roomDetails.startTime" />

            <v-spacer />
            <button-with-tooltip
                large
                bottom
                v-if="roomDetails.admin === id && roomDetails.status === currentRoomOnGoingState"
                :label="isCanvasEnabled? 'Desabilitar quadro' : 'Habilitar quadro'"
                btn-color="transparent"
                :icon="isCanvasEnabled? 'mdi-image-remove': 'mdi-image'"
                @click="shareOrDisableCanvas" />

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
                v-if="shareType && roomDetails.status === currentRoomOnGoingState"
                label="Cancelar compartilhamento"
                btn-color="transparent"
                :icon="shareType === 'screen' ? 'mdi-monitor-off': 'mdi-camera-off'"
                @click="stopSharing(shareType)" />

            <v-menu
                left
                offset-y
                :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on">
                        <v-icon>
                            mdi-dots-vertical
                        </v-icon>
                    </v-btn>
                </template>
                <v-list class="pa-3">
                    <v-list-item
                        class="px-2">
                        <v-list-item-title>
                            Configurações de sala
                        </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item
                        class="px-2">
                        <v-switch
                            v-model="roomOptions.autoScroolChat"
                            hide-details=""
                            label="Rolar chat automaticamente" />
                    </v-list-item>
                </v-list>
            </v-menu>
            
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
            style="overflow: hidden;"
            v-else-if="roomDetails.status === currentRoomOnGoingState"
            class="pa-3 h-100 d-flex flex-column">
            <div
                class="d-flex h-100">
                <div
                    id="video-container"
                    class="video-container mr-2">
                    <drawing-canvas
                        ref="drawingCanvas"
                        :is-canvas-admin="roomDetails.admin === id"
                        @canvasData="shareCanvasData"
                        v-if="isCanvasEnabled" />
                </div>
                <div 
                    :class="{'hide-chat': hideChat}"
                    class="chat d-flex">
                    <button-with-tooltip
                        attach=".chat.d-flex"
                        bottom
                        @click="hideChat = !hideChat"
                        :label="hideChat? 'Exibir chat': 'Ocultar chat' "
                        :icon="hideChat? 'mdi-chevron-left' : 'mdi-chevron-right'" />
                    <room-chat-container
                        :auto-scroll-chat="roomOptions.autoScroolChat"
                        class="w-100"
                        :room-id="roomId"
                        :current-participants="currentParticipants" />
                </div>
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
import DrawingCanvas from "../../components/drawing/DrawingCanvas.vue"
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
        ConfirmDialog,
        DrawingCanvas
    },
    data() {
        return {
            onParticipantJoinToken: undefined,
            onParticipantLeaveToken: undefined,
            onReceivedPeerOfferToken: undefined,
            onFinishRoomToken: undefined,
            onCanvasToken: undefined,
            onCanvasDataToken: undefined,
            roomDetails: {
                name: "",
                startTime: "",
                id: 1
            },
            roomId: undefined,
            videoGrid: undefined,
            lastPeer: undefined,
            shareType: undefined,
            currentParticipants: [],
            initTime: -1,
            loading: false,
            btnLoadingFinishingRoom: false,
            dialogFinishRoom: false,
            hideChat: false,
            isCanvasEnabled: false,
            roomOptions: {
                autoScroolChat: true
            }
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
        shareOrDisableCanvas() {
            this.$wsEmit("room:canvas", {
                roomId: this.roomId,
                canvasStatus: !this.isCanvasEnabled
            })
        },
        shareCanvasData({ data, to = undefined }) {
            if (this.id === this.roomDetails.admin)
                this.$wsEmit("room:canvasData", {
                    roomId: this.roomId,
                    data,
                    to
                })
        },
        getInitiator(peer) {
            if (this.id === this.roomDetails.admin)
                return true
            else if (peer === this.roomDetails.admin) 
                return false
            else 
                return !this.currentParticipants.map(item => item.id).filter(id => id !== this.lastPeer).includes(peer)
        },
        onCanvas({ canvasStatus }) {
            this.isCanvasEnabled = canvasStatus
        },
        onCanvasData({ data }) {
            if (this.id !== this.roomDetails.admin) {
                this.$refs.drawingCanvas.restoreData(data)
            }
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

            if (content.user.id !== this.roomDetails.admin && content.user.id !== this.id) {
                this.lastPeer = content.user.id

                if (this.roomDetails.admin === this.id && this.isCanvasEnabled) {
                    this.shareCanvasData({ data: this.$refs.drawingCanvas.getData() })
                }
            }
            if (content.user.id !== this.id) {
                this.lastPeer = content.user.id
                peerHandlerInstance.initPeerConnection({ peerId: content.user.id })
            }
            else {
                this.loading = false
                this.initCurrentPeers()
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
            if (this.id === this.roomDetails.admin) {
                this.$wsEmit("room:canvas", {
                    roomId: this.roomId,
                    canvasStatus: false
                })
            }

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
                this.isCanvasEnabled = response.data?.details?.canvasStatus
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
        initCurrentPeers() {
            if (this.roomDetails.details.currentParticipants.length) {
                this.roomDetails.details.currentParticipants.map(item => {
                    if (item.id != this.id)
                        peerHandlerInstance.initPeerConnection({ peerId: item.id })
                })
            }
        },
        startHandlers() {
            this.onParticipantLeaveToken = socketHandlerInstance.on('room:participantLeave', this.onParticipantLeave)
            this.onParticipantJoinToken = socketHandlerInstance.on('room:participantJoin', this.onParticipantJoin)
            this.onReceivedPeerOfferToken = socketHandlerInstance.on('room:peerOffer', this.onReceivedPeerOffer)
            this.onFinishRoomToken = socketHandlerInstance.on('room:finish', this.onFinishRoom)
            this.onCanvasDataToken = socketHandlerInstance.on('room:canvasData', this.onCanvasData)
            this.onCanvasToken = socketHandlerInstance.on('room:canvas', this.onCanvas)
            window.addEventListener('beforeunload', this.leavingRoomHandlers)
        },
        leavingRoomHandlers() {
            this.leavingRoom()
            peerHandlerInstance.reInitializeHandlersAndPeers()
            socketHandlerInstance.off(this.onReceivedPeerOfferToken)
            socketHandlerInstance.off(this.onParticipantLeaveToken)
            socketHandlerInstance.off(this.onParticipantJoinToken)
            socketHandlerInstance.off(this.onFinishRoomToken)
            socketHandlerInstance.off(this.onCanvasDataToken)
            socketHandlerInstance.off(this.onCanvasToken)
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

            if (this.id !== this.roomDetails.id) {
                this.initCurrentPeers()
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

        video {
            width: 400px;
            height: 300px;
            object-fit: cover;
        }
    }

    .chat {

        &.hide-chat {
            .chat-container {
                width: 0px;
            }
        }
        .chat-container {
            transition: width 0.2s cubic-bezier(.38,.48,.23,.97);
            width: 350px;
        }
    }

}
</style>
