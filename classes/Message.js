class Message {
    user;
    content = "";
    timestamp = "";

    constructor(user, content) {
        this.user = user;
        this.content = content;
        this.timestamp = Date.now();
        this.id = crypto.randomUUID();
    }
}

export default Message;
