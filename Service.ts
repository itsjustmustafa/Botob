import {Message} from "./Message";
import { InputStackEntry } from "./InputStackEntry";

/// A service provides an adapter to chatroom services
/**
 * A service provides a consistent way for online chat services 
 * to be communicated to and handled
 */
export interface Service {
    /**
     * A method which will Send a message through the service
     * @param msg The message to send
     */
    sendMessage(msg: Message): void;
    /**
     * A method which will begin the login process for the service
     * @return A function that begins retrieving user input that is needed for the login process. Null if no input is needed.
     */
    login(): InputStackEntry;

    /** The messages which have been received from other users on the service */
    msgs: Message[];
}