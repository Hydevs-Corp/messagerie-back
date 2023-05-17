import Message from "./Message.js";
import { rooms } from "../scripts/GlobalData.js";
import io from "../scripts/IO.js";

class ChatRoom {
    #history = [];
    roomName = "";
    constructor(roomName) {
        this.roomName = roomName;
        rooms.push(this);
        io.emit("UpdateRoom", rooms);
        return this;
    }
    addMessage(user, content) {
        const mess = new Message(user, content);
        this.#history.push(mess);
        if (this.#history.length > 10) {
            this.#history.shift();
        }
        io.to(this.roomName).emit("NewMessage", mess);
    }
    deleteMessage(id) {
        this.#history = this.#history.filter((el) => {
            id !== el.id;
        });
        io.to(this.roomName).emit("DeleteMessage", id);
    }
    getHistory(max) {
        return this.#history;
    }
}

export default ChatRoom;
