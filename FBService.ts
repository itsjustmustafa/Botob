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
    
    //username: string = "";
    //password: string = "";
    session: any;
    loginSession: any;

    constructor(input: ConsoleInputHandler) {
        
    }

    /**
     * Begin the login process if details are configured. 
     * If details are not configured begin the process of configuration
     */
    login(): InputStackEntry {
        let getDetails = this.getLoginDetails();
        if (getDetails === null) {
            
            this.fbLogin(this.session, (err, api) => {
                if(err) return new console.error(err);

                this.api = api;
                var fs = require('fs');
                fs.writeFileSync('session.txt', JSON.stringify(api.getAppState()));

                api.listen((err, message) => {
                    this.receiveMessage(message.body,message.threadID);
                });
            });
            return null;
        } else {
            return getDetails; 
        }
    };

    /**
     * Attempts to retrieve a login configuration through saved data, 
     * or then attempts to use the CLI to retrieve login information
     * @return Null, or a function to retrieve login details if they're not provided.
     */
    getLoginDetails(): InputStackEntry {
        var fs = require('fs');
        this.session.forceLogin = true;
        if (fs.existsSync("session.txt")){
            this.session.appstate = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));
        }

        if (this.session.email && this.session.password){
            return null;
        }

        if (fs.existsSync("password.txt")) {
            this.session.password = fs.readFileSync("password.txt", "utf8");
        } 

        if (fs.existsSync("username.txt")) {
            this.session.email = fs.readFileSync("username.txt", "utf8");
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
        if (this.session.email && this.session.password){
            return null;
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
        this.session.email = username;
        if (username === "/exit"){
            this.cancelLogin()
            return null;
        } else {
            this.session.email = username;
            
            if (this.session.password !== "") {
                this.session.email = username;
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
        } else if (this.session.email !== "") {
            this.session.password = password;
            return this.askToSaveLogin();
        } 
        return null;
    }

    /**
     * Sends a message
     * @param msg Message to send
     */
    sendMessage(msg: Message): void {
        setTimeout(() => 
        {
            this.api.sendMessage(msg.messageData, msg.destination.id);
        },
        this.typingTimeDelay(msg.messageData)); 
    }
 /**
     * Computes a reading time given the string
     * This function has not been combined with 'readingTimeDelay' as although 
     * the code is identical, they are for different purposes. 
     * @param input The string to 'type'
     * @returns The length it would take to type the given input
     */
    typingTimeDelay(input: string): number {
        let typingSpeedWPM : number = 60;
        let words: number = (input.match(/\s/g) || []).length;
        let MSinMinute: number = 60 * 1000;
        let typingTimeMS: number = (words / typingSpeedWPM) * MSinMinute;

        let minDelay : number = 100;
        let maxDelay : number = 2000;
        let randomDelay : number = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        return randomDelay + typingTimeMS;
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

        
        setTimeout(() => 
        {
            this.msgs.push(msg);
        },
        this.readingTimeDelay(input));
    }

    /**
     * Computes a reading time given the string
     * @param input The input string
     * @returns The length it would take to read the given input
     */
    readingTimeDelay(input: string): number {
        let readingSpeedWPM : number = 200;
        let words: number = (input.match(/\s/g) || []).length;
        let MSinMinute: number = 60 * 1000;
        let readingTimeMS: number = (words / readingSpeedWPM) * MSinMinute;

        let minDelay : number = 100;
        let maxDelay : number = 500;
        let randomDelay : number = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        return randomDelay + readingTimeMS;
    } 
}