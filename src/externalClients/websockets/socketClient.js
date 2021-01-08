WebSocket.prototype.oldSend = WebSocket.prototype.send;

WebSocket.prototype.send = function(eventName, payload)  {
    const message = {
        type: eventName,
        content: payload
    }
    WebSocket.prototype.oldSend.apply(this, [JSON.stringify(message)]);
}

class SocketClient {

    constructor() {
        /**
         * @type { WebSocket }
         * @public
         */
        this.ws = undefined

        /**
         * @type { function }
         * @public
         */
        this.onConnectionHandler = undefined

        /**
         * @type { function }
         * @public
         */
        this.onMessageHandler = undefined
        
        /**
         * @type { function }
         * @public
         */
        this.onErrorHandler = undefined

        this.wsServer = undefined
        this.autoReconnect = true
        this.reconnectTime = 5000
        this.connected = false
    }

    initConnection({ wsServer, autoReconnect = true, reconnectTime = 5000 }) {
        this.wsServer = wsServer
        this.autoReconnect = autoReconnect
        this.reconnectTime = reconnectTime

        this.ws = new WebSocket(this.wsServer);

        this.ws.onopen = (event) => {
            this.connected = true
            this.onConnectionHandler && this.onConnectionHandler(event)
        }

        this.ws.onmessage = (ev) => {
            this.onMessageHandler && this.onMessageHandler(this.ws, ev.data)
        }

        this.ws.onclose = (ev) => {
            debugger
            this.connected = false
            if (ev.code === 1008)
                this.onErrorHandler && this.onErrorHandler(ev)
            else if (this.autoReconnect)
                this._reconnect()
        }

        this.ws.onerror = (ev) => {
            this.onErrorHandler && this.onErrorHandler(ev)
        }

        return this
    }

    _reconnect() {
        setTimeout(() => this.initConnection({
            wsServer: this.wsServer, 
            autoReconnect: this.autoReconnect, 
            reconnectTime: this.reconnectTime
        }), this.reconnectTime)
    }

    /**
     * @function registerOnMessageHandler Função responsável por registrar o callback de retorno no recebimento de mensagens socket
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     * @param { Event }  event - Instância atual do socket
     */
    registerOnMessageHandler(cb) {
        this.onMessageHandler = cb

        return this
    }

    /**
     * @function registerOnConnectionHandler Função responsável por registrar o callback de conexão de um socket
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     * @param { Event }  event - Evento
     */
    registerOnConnectionHandler(cb) {
        this.onConnectionHandler = cb

        return this
    }

    /**
     * @function registerOnConnectionHandler Função responsável por registrar o callback de conexão de um socket
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     * @param { Event }  event - Evento
     */
    registerOnErrorHandler(cb) {
        this.onErrorHandler = cb

        return this
    }

    send(event, content) {
        if (this.connected)
            this.ws.send(event, content)
        else
            setTimeout(() => this.send(event, content), 2000)
    }


}

const instance = new SocketClient();

module.exports = {
    socketInstance: (() => instance)()
}