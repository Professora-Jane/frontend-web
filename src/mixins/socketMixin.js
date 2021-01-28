import { socketHandlerInstance } from "../externalClients/websockets/socketHandler";

export default {
    beforeCreate(){
        if(!this.sockets) this.sockets = {};
    },

    mounted(){
        if(this.$options.socketHandlers){
            Object.keys(this.$options.socketHandlers).forEach(event => {
                this.sockets[event] = socketHandlerInstance.on(event, this.$options.socketHandlers[event], this)
            })
        }
    },
    
    beforeDestroy(){
        if(this.$options.socketHandlers){
            Object.keys(this.$options.socketHandlers).forEach(event => {
                socketHandlerInstance.off(this.sockets[event])

                delete this.sockets[event]
            });
        }
    }

}