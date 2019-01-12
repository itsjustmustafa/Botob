import {Message} from "./Message";
import {User} from "./User";
import { InputQueueEntry } from "./ConsoleInputHandler";

/// A service provides an adapter to chatroom services
export interface Service {
    sendMessage(msg: Message): void;
    getUser(): User;
    getMessages() : Message[];
    onMessage(msg: Message) : void;
    login(): InputQueueEntry;
}