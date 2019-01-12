import {Module}  from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";
import { MessageAndReply } from './MessageAndReply';

/// A simple module whcih will reply to the message with a response
export class ReplyModule implements Module {
    responses: MessageAndReply[] = [];
    constructor () {
        this.responses.push(new MessageAndReply("Hiyo","Hi ben"));
    }
    onTick(): void {};

    onMessage(msg: Message, service: Service): Message[] {
        let out: Message[] = [];    
        for (let response of this.responses) {
            if (response.checkReply(msg.messageData)){
                out.push(msg.source.makeReply(service.getUser(), response.getReply()));
            }
        }
        return out;
    }
}