class User {
    username = "";
    id = "";

    constructor(username, id) {
        this.username = username;
        this.id = id;
    }
    updateUsername(newUsername) {
        this.username = newUsername;
    }
}

export default User;
