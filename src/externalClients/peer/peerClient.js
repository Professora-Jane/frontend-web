import Peer from "peerjs";

class PeerClient {

    constructor() {
        this.peer = undefined
    }

    initConnection(id) {
        this.peer = new Peer(
            id,
            {
                host: process.env.VUE_APP_PEER_HOST,
                port: 7113,
                key: 'peer'
            }
        );
    }

    get id() {
        return this.peer.id
    }
}

const instance = new PeerClient();

export const peerClientInstance = (() => instance)()
