import {Module}  from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";

/** A simple module whcih will reply to the message with the same text */
export class CopyCatModule implements Module {
    
    /** Does nothing */
    onTick(): void {};
    
    /** Returns the given input as a response */
    onMessage(msg: Message, service: Service): Message[] {
        let ret: Message[] = [];
        ret.push(msg.source.makeReply(msg.destination, msg.messageData));
        return ret;
    }
}