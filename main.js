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

    socket.on("ChangeAuthorName", ({ userName }, callback) => {
        console.log(userName, callback);
        if (!user) {
            user = new User(userName, socket.id);
            console.log(userName);
        } else {
            user.updateUsername(userName);
            console.log(userName);
        }
        console.log("backCallBack", callback);
        console.log("ssss", user);
        callback(user);
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

    socket.on("DeleteRoom", (roomName) => {
        console.log(roomName);
        let roomIndex = rooms.findIndex((e) => {
            console.log("eee", e, roomName);
            return e.roomName === roomName;
        });
        console.log("ererere", roomIndex, rooms);
        rooms?.splice(roomIndex, 1);
        console.log("ererere2", roomIndex, rooms);
        io.emit("DeleteRoom", roomName);
    });

    socket.on("DeleteMessage", (id) => {
        currentChatRoom?.deleteMessage(id);
    });
});
