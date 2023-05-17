class Message {
    user;
    content = "";
    timesptamp = "";
    id = crypto.randomUUID();

    constructor(user, content) {
        this.user = user;
        this.content = content;
        this.timesptamp = Date.now();
    }
}

export default Message;
