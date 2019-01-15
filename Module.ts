import {Message} from "./Message";
import {Service} from "./Service";

/**
 * A module is responsible for a section of fucntionality for the program
 */
export interface Module {
    /**
     * How the module responds to messages that are sent to it
     * @param msg Message received
     * @param service The service through the message was acquired
     * @return The responses to the input
     */
    onMessage(msg: Message, service: Service): Message[];
    /**
     * A function which will be repeatedly called at a set interval 
     * throughout the application's lifetime
     */
    onTick(): void;
}