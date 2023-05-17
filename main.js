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

    socket.on("CreateRoom", (roomName) => {
        currentChatRoom = new ChatRoom(roomName);
        socket.join(currentChatRoom);
        socket.emit(
            "UpdateCurrentChatRoom",
            currentChatRoom,
            currentChatRoom.getHistory(10)
        );
    });

    /* input = roomName: string
       output
       emit =
       ev: "UpdateCurrentChatRoom"
       data: currentChatRoom */
    socket.on("joinRoom", (roomName) => {
        console.log("request to join => ", roomName);
        currentChatRoom = rooms.find(
            (element) => element.roomName === roomName
        );
        if (!currentChatRoom) return;
        socket.join(roomName);
        socket.emit(
            "UpdateCurrentChatRoom",
            currentChatRoom,
            currentChatRoom.getHistory(10)
        );
    });

    socket.on("ChangeAuthorName", ({ username }) => {
        user.updateUsername(username);
    });

    socket.on("DeleteMessage", (id) => {
        currentChatRoom?.deleteMessage(id);
    });

    socket.on("RequestChatRoom", (callback) => {
        callback(rooms);
    });

    // currentChatRoom existe déjà, on ne l'attend pas
    // socket.on("RequestMessages", (currentChatRoom) => {
    //     du coup on ne fait rien avec la variables

    //     currentChatRoom?.getHistory(roomName);
    // });

    socket.on("RequestMessages", (callback) => {
        if (currentChatRoom) {
            callback(currentChatRoom.getHistory(10));
        }
    });

    socket.on("NewMessage", (messageContent) => {
        console.log("newmessage =>", messageContent);
        currentChatRoom?.addMessage(user, messageContent);
    });
});
