import {User} from "./User";

/**
 * A representation of a message (regardless if its inbound or outbound) 
 */
export class Message {
    /* The message received */
    messageData: string;
    /* Who the message is (or was) intended for */
    destination: User;
    /* Where the message originated from */
    source: User;

    constructor(messageData: string, destination: User, source: User) {
        this.messageData = messageData;
        this.destination = destination;
        this.source = source;
    }
}