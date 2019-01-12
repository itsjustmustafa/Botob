import {Service} from "./Service";
import {Message} from "./Message";
export class User {
    id: string;
    service : string

    constructor(id: string, service: Service) {
        this.id = id;
        this.service = service.constructor.toString();
    }

    makeReply(source: User, message: string):Message {
        return new Message(message, this, source);
    }
}