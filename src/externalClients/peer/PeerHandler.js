import Peer from "simple-peer"

class PeerHandler {

    constructor() {
        /**
         * @type { Object<string, Peer.Instance> } peers
         */
        this.peers = {}

        this.stream = undefined

        this.onConnectHandler = undefined
        this.onSignalHandler = undefined
        this.onStreamHandler = undefined
        this.onCloseHandler = undefined
        this.onDataHandler = undefined
        this.onErrorHandler = undefined
        this.getInitiator = undefined
    }



    initPeerConnection({ peerId }) {
        if (!this.peers[peerId]) {
            this.peers[peerId] = new Peer({
                initiator: this.getInitiator(peerId),
                ...(!!this.stream && { stream: this.stream })
            })

            this.peers[peerId].on("connect", () => {
                this.onConnectHandler && this.onConnectHandler(peerId) 
            })

            this.peers[peerId].on('signal', (data) => {
                this.onSignalHandler && this.onSignalHandler(data, peerId)
            })

            this.peers[peerId].on('stream', (stream) => {
                this.onStreamHandler && this.onStreamHandler(stream, peerId)
            })

            this.peers[peerId].on('close', () => {
                this.destroyPeer(peerId)
                this.onCloseHandler && this.onCloseHandler(peerId)
            })
            
            this.peers[peerId].on('data', (data) => {
                let ev = data;
                
                if (typeof data !== "string")
                    ev = new TextDecoder("utf-8").decode(data)

                this.onDataHandler && this.onDataHandler(ev, peerId)
            })
            
            this.peers[peerId].on('error', (error) => {
                this.destroyPeer(peerId)
                this.onErrorHandler && this.onErrorHandler(error, peerId)
            })
        }
    }

    /**
     * @function registerOnConnectHandler Função responsável por registrar o callback de conexão
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { string }  peerId - id do peer conectado
     */
    registerOnConnectHandler(cb) {
        this.onConnectHandler = cb
        return this;
    }
    
    /**
     * @function registerOnSignalHandler Função responsável por registrar o callback de signaling
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { object }  data - Dados do signaling
     * @param { string }  peerId - id do peer conectado
     */
    registerOnSignalHandler(cb) {
        this.onSignalHandler = cb
        return this;
    }

    /**
     * @function registerOnStreamHandler Função responsável por registrar o callback de stream
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { any }  stream - A stream recebida
     * @param { string }  peerId - id do peer conectado
     */
    registerOnStreamHandler(cb) {
        this.onStreamHandler = cb
        return this;
    }
    
    /**
     * @function registerOnCloseHandler Função responsável por registrar o callback de fechamento de um peer
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { string }  peerId - id do peer conectado
     */
    registerOnCloseHandler(cb) {
        this.onCloseHandler = cb
        return this;
    }

    /**
     * @function registerOnDataHandler Função responsável por registrar o callback de recebimento de dados
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { string }  dados - Dados recebidos
     * @param { string }  peerId - id do peer conectado
     */
    registerOnDataHandler(cb) {
        this.onDataHandler = cb
        return this;
    }

    /**
     * @function registerOnErrorHandler Função responsável por registrar o callback de erro
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { Error }  error - Erro
     * @param { string }  peerId - id do peer conectado
     */
    registerOnErrorHandler(cb) {
        this.onErrorHandler = cb
        return this;
    }

    /**
     * @function registerInitiatorHandler Função responsável por registrar a função que determina os initiators
     * @param { cb } cb - Callback a ser executado 
     * @callback cb 
     * @param { string }  peerId - id do peer conectado
     */
    registerInitiatorHandler(cb) {
        this.getInitiator = cb;
    }

    destroyPeer({ peerId }) {
        if (this.peers[peerId]) {
            this.peers[peerId].destroy()
            
            delete this.peers[peerId]
        }
    }

    signalPeer({ peerId, data }) {
        if (this.peers[peerId])
            this.peers[peerId].signal(data)
    }

    reInitializeHandlersAndPeers() {
        if(this.stream)
            this.stream.getTracks().forEach(track => track.stop())

        this.peers = {}
        this.onConnectHandler = undefined
        this.onSignalHandler = undefined
        this.onStreamHandler = undefined
        this.onCloseHandler = undefined
        this.onDataHandler = undefined
        this.onErrorHandler = undefined
    }
}

const instance = new PeerHandler()

export const  peerHandlerInstance = (() => instance)()