import {Service} from "./Service";
import {Message} from "./Message";

/** Represents a user from a service */
export class User {

    /** The User's identifier on the service, which can set as a destination for a reply. */
    id: string;
    
    /* The service the user originated from */ 
    service : string 

    constructor(id: string, service: Service) {
        this.id = id;
        this.service = service.constructor.toString();
    }

    /** 
     * Creates a reply to the user which can be sent 
     * @return A message which can be used to reply to this user
     */
    makeReply(source: User, message: string):Message {
        return new Message(message, this, source);
    }
}