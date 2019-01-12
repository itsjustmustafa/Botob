import {Module} from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";
import {User} from "./User";
import {Bot} from "./Bot";
import {InputQueueEntry, ConsoleInputHandler } from './ConsoleInputHandler';
const readline = require('readline');

/// A service which allows interaction via the command line interface
export class FBService implements Service {    
    msgs: Message[] = [];
    fbLogin = require("facebook-chat-api");
    api;
    username: string = "";
    password: string = "";

    constructor(input: ConsoleInputHandler) {
        
    }
    getUser(): User {
        return new User("CONSOLE", this);
    }

    login(): InputQueueEntry {
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
    getLoginDetails(): InputQueueEntry {
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
            return new InputQueueEntry((input: string) => this.setUsername(input),"Facebook Username");
        }
    }
    cancelLogin(): void {
        console.log('\x1b[36m%s\x1b[0m', "\nCancelling facebook login")
    }
    
    loginProcess(response : string): InputQueueEntry {
        if (response === "Y" || response === "Yes" || response === "YES"){
            console.log("\n" + '\x1b[36m%s\x1b[0m' + "Saving details");
        }
        this.login();
        return null;
    }
    
    askToSaveLogin(): InputQueueEntry {
        return new InputQueueEntry((input: string) => this.loginProcess(input),"Save login details?");
    }
    
    setUsername(username: string): InputQueueEntry{
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
                return new InputQueueEntry((input: string) => this.setPassword(input),"Facebook Password");
            }
            return null;
        }
    }

    setPassword(password: string, caller?: ConsoleInputHandler): InputQueueEntry{
        if (password === "/exit"){
            this.cancelLogin();
            return null;
        } else if (this.username !== "") {
            this.password = password;
            return this.askToSaveLogin();
        } 
        
        return null;
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
        this.api.sendMessage(msg.messageData, msg.destination.id);
    }

    receiveMessage(input: string, threadID: string): void {
        let msg = new Message(
            input,
            new User(threadID,this),
            new User(threadID,this));
        this.onMessage(msg);
    }    
}