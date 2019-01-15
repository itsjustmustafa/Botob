import {Service} from "./Service";
import {Message} from "./Message";
import {User} from "./User";
import { ConsoleInputHandler} from './ConsoleInputHandler';
import {InputStackEntry} from './InputStackEntry';

/**
 * A service which is entirely through the command line interface, 
 * useful for debugging and testing purposes
 */
export class ConsoleService implements Service {
    
    msgs: Message[] = [];
    /** An arbirary username */
    username: string;

    constructor(handler: ConsoleInputHandler) {
    }

    /**
     * Outputs the message to the console
     * @param msg The message to send
     */
    sendMessage(msg: Message): void {
        console.log("\nConsole service: " + msg.messageData);
    }
    /**
     * Handles user input
     * @param input The input string
     * @return Return this function, to infinitely loop
     */
    onInput(input: string): InputStackEntry {
        let msg = new Message(
            input,
            new User(this.username,this),
            new User(this.username,this)
        );
        this.msgs.push(msg);
        return new InputStackEntry(
            (input: string) => this.onInput(input),"MessageInput:"
        );
    }

    /**
     * Handles configuring the username for the session
     * @param username The username
     * @return Function to begin receiving user input as messages
     */
    setUsername(username: string): InputStackEntry {
        this.username = username;
        return new InputStackEntry( 
            (input: string) => this.onInput(input),"MessageInput:"
        );
    };
    /**
     * Emulates a login process by first requiring the user to provide a username
     * @return Function to begin the login process
     */
    login(): InputStackEntry {
        console.log('\x1b[36m%s\x1b[0m', "\nConsole interface has been loaded");
        return new InputStackEntry( 
            (input: string) => this.setUsername(input),"Console Username"
        );
    };
}