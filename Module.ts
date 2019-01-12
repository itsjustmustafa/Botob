import {Message} from "./Message";
import {Service} from "./Service";

// A module encapsulates functionality of the bot into responsibilities
export interface Module {
    onMessage(msg: Message, service: Service): Message[];
    onTick(): void;
}