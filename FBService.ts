import {Service} from "./Service";
import {Message} from "./Message";
import {User} from "./User";
import {InputStackEntry} from './InputStackEntry'
import {ConsoleInputHandler } from './ConsoleInputHandler';

/**
 * An implementation of the 'facebook-chat-api' as a service.
 */
export class FBService implements Service {    
    msgs: Message[] = [];
    fbLogin = require("facebook-chat-api");
    api;
    username: string = "";
    password: string = "";

    constructor(input: ConsoleInputHandler) {
        
    }

    /**
     * Begin the login process if details are configured. 
     * If details are not configured begin the process of configuration
     */
    login(): InputStackEntry {
        if ((this.username !== "") && (this.password !== "")) {
            this.fbLogin({email: this.username, password: this.password}, (err, api) => {
                if(err) return console.error(err);
                this.api = api;
                api.listen((err, message) => {
                    this.receiveMessage(message.body,message.threadID);
                });
            });
        }
        return this.getLoginDetails(); 
    };

    /**
     * Attempts to retrieve a login configuration through saved data, 
     * or then attempts to use the CLI to retrieve login information
     * @return Null, or a function to retrieve login details if they're not provided.
     */
    getLoginDetails(): InputStackEntry {
        var fs = require('fs');
        if (this.username && this.password){
            return null;
        }

        if (fs.existsSync("password.txt")) {
            let password: string = fs.readFileSync("password.txt", "utf8");
        } 

        if (fs.existsSync("username.txt")) {
            let username: string = fs.readFileSync("username.txt", "utf8");
        } else {
            let color: string = "\x1b[33m"
            let resetColor: string = "\x1b[0m";
            console.log
            ( color
            + "\nYou need to provide your login details for Facebook. Type" 
            + resetColor + " /exit "+ color
            + "to cancel logging in."
            )
            return new InputStackEntry((input: string) => this.setUsername(input),"Facebook Username");
        }
    }

    /**
     * Cancels the login process
     */
    cancelLogin(): void {
        console.log('\x1b[36m%s\x1b[0m', "\nCancelling facebook login")
    }
    
    /**
     * Ask if the given login details should be stored for future usage
     * @return The input required to request if login details should be saved. Then logs in regardless of input
     */
    askToSaveLogin(): InputStackEntry {
        return new InputStackEntry((input: string) => this.loginProcess(input),"Save login details?");
    }

    /**
     * @param response The input string from the CLI
     * @return The result of the login process which is executed regardless of input
     */
    loginProcess(response : string): InputStackEntry {
        if (response === "Y" || response === "Yes" || response === "YES"){
            console.log("\n" + '\x1b[36m%s\x1b[0m' + "Saving details");
        }
        return this.login();
    }

    /**
     * Handles the CLI functionality to set the username required for logging in.
     * /exit can be provided to cancel the process
     * @param username The input string given. May be /exit to signify cancelling.
     * @return Begin the password retrieval process, null if the login is cancelled, or the result of the login process
     */
    setUsername(username: string): InputStackEntry{
        this.username = username;
        if (username === "/exit"){
            this.cancelLogin()
            return null;
        } else {
            this.username = username;
            
            if (this.password !== "") {
                this.username = username;
                return this.askToSaveLogin();
            } else {
                return new InputStackEntry((input: string) => this.setPassword(input),"Facebook Password");
            }
        }
    }

    /**
     * Handles the CLI functionality to set the password required for logging in.
     * /exit can be provided to cancel the process
     * @param password The input string given. May be /exit to signify cancelling.
     * @return The input required to request if login details should be saved. Then logs in regardless of input
     */
    setPassword(password: string): InputStackEntry{
        if (password === "/exit"){
            this.cancelLogin();
            return null;
        } else if (this.username !== "") {
            this.password = password;
            return this.askToSaveLogin();
        } 
        return null;
    }

    /**
     * Sends a message
     * @param msg Message to send
     */
    sendMessage(msg: Message): void {
        this.api.sendMessage(msg.messageData, msg.destination.id);
    }

    /**
     * Handles messages which are received
     * @param input The text sent by the user
     * @param threadID The threadID the message was received from
     */
    receiveMessage(input: string, threadID: string): void {
        let msg = new Message(
            input,
            new User(threadID,this),
            new User(threadID,this));
        this.msgs.push(msg);
    }    
}