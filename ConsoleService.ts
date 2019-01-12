import {Module} from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";
import {User} from "./User";
import {Bot} from "./Bot";
import { ConsoleInputHandler, InputQueueEntry} from './ConsoleInputHandler';

const readline = require('readline');

/// A service which allows interaction via the command line interface
export class ConsoleService implements Service {
    
    msgs: Message[] = [];
    username: string;

    constructor(handler: ConsoleInputHandler) {
    }

    getUser(): User {
        return new User("CONSOLE", this);
    }

    onMessage(msg: Message) : void {
        this.msgs.push(msg);
    } 
    
    getMessages() : Message[] {
        let out: Message[] = this.msgs.slice();
        this.msgs = [];
        return out;
    };

    sendMessage(msg: Message): void {
        console.log("\nConsole service: " + msg.messageData);
    }

    onInput(input: string): InputQueueEntry {
        let msg = new Message(
            input,
            new User(this.username,this),
            new User(this.username,this)
        );
        this.msgs.push(msg);
        return new InputQueueEntry(
            (input: string) => this.onInput(input),"MessageInput:"
        );

    }

    setUsername(username: string, caller?: ConsoleInputHandler): InputQueueEntry {
        this.username = username;
        return new InputQueueEntry( 
            (input: string) => this.onInput(input),"MessageInput:"
        );
    };

    login(): InputQueueEntry {
        console.log('\x1b[36m%s\x1b[0m', "\nConsole interface has been loaded");
        return new InputQueueEntry( 
            (input: string) => this.setUsername(input),"Console Username"
        );
    };
}