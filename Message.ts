import {User} from "./User";

/// A message which has been received from a service, or is going to be sent via a service
export class Message {
    messageData: string;
    destination: User;
    source: User;

    constructor(messageData: string, destination: User, source: User) {
        this.messageData = messageData;
        this.destination = destination;
        this.source = source;
    }
}