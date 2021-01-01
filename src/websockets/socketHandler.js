import pubsub from "pubsub-js";

class SocketHandler {

    messageHandler(socket, msg) {
        const { type, content } = JSON.parse(msg)
        const send = socket.send

        pubsub.publish(type, [content, send])
    }

    on(ev, cb) {
        pubsub.subscribe(ev, async (_, value) => await cb(...value))
    }

    off(cb) {
        pubsub.unsubscribe(cb)
    }
}

const instance = new SocketHandler();

export const  socketHandlerInstance = (() => instance)()

