export class Message {
    content: string;
    username: string;
    messageId: string;
    userId: string;
    anonymous: boolean;

    constructor (content: string, messageId?: string, username?: string, userId?: string, anonymous?: boolean) {
        this.content = content;
        this.messageId = messageId;
        this.username = username;
        this.userId = userId;
        this.anonymous = anonymous;
    }
}