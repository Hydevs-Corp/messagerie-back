import io from "./scripts/IO.js";
import User from "./classes/User.js";
import ChatRoom from "./classes/ChatRoom.js";
import { rooms } from "./scripts/GlobalData.js";

io.on("connection", (socket) => {
    console.log("someone connected");
    let user;
    let currentChatRoom;

    socket.on("init", ({ username }) => {
        user = new User(username, socket.id);
    });

    socket.on("CreateRoom", () => {
        currentChatRoom = new ChatRoom(roomName);
        socket.join(currentChatRoom);
        socket.emit("UpdateCurrentChatRoom", currentChatRoom);
    });

    /* input = roomName: string
       output
       emit =
       ev: "UpdateCurrentChatRoom"
       data: currentChatRoom */
    socket.on("joinRoom", (roomName) => {
        currentChatRoom = rooms.find(
            (element) => element.roomName === roomName
        );
        socket.join(roomName);
        socket.emit("UpdateCurrentChatRoom", currentChatRoom);
    });

    socket.on("ChangeAuthorName", ({ username }) => {
        user.updateUsername(username);
    });

    socket.on("DeleteMessage", (id) => {
        currentChatRoom.deleteMessage(id);
    });

    socket.on("RequestChatRoom", (callback) => {
        callback(rooms);
    });

    socket.on("RequestMessages", (currentChatRoom) => {
        currentChatRoom.getHistory(roomName);
    });

    socket.on("NewMessage", (user, messageContent) => {
        currentChatRoom.addMessage(user, messageContent);
    });
});
