import {Module}  from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";
import { MessageAndReply } from './MessageAndReply';

/**
 * A simple module which gives specific responses to specific phrases
 */
export class ReplyModule implements Module {
    /**
     * The mapping of input messages to responses
     */
    responses: MessageAndReply[] = [];

    constructor () {
        this.responses.push(new MessageAndReply("Hiyo","Hi ben"));
    }
    /**
     * Does nothing
     */
    onTick(): void {};
    /**
     * Finds if the message given matches any stored key, 
     * and if so replies with the response stored
     * 
     * @param msg 
     * @param service 
     */
    onMessage(msg: Message, service: Service): Message[] {
        let out: Message[] = [];    
        for (let response of this.responses) {
            if (response.checkReply(msg.messageData)){
                out.push(msg.source.makeReply(msg.destination, response.getReply()));
            }
        }
        return out;
    }
}