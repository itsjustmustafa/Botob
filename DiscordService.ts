import {Module} from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";
import {User} from "./User";
import {Bot} from "./Bot";
const Discord = require('discord.js')


import { ConsoleInputHandler, InputQueueEntry} from './ConsoleInputHandler';

const readline = require('readline');

/// A service which allows interaction via the command line interface
export class DiscordService implements Service {
    
    msgs: Message[] = [];
    username: string;
    BOT_TOKEN: string = ""
    client = new Discord.Client()
    
    constructor(handler: ConsoleInputHandler) {
        this.client.on('message', msg => {
           this.receiveMessage(msg.cleanContent, msg.channel.id,msg.member.id);
        })
    }

    receiveMessage(input: string, channel_id: string, user_id: string): void {
        if (user_id !== this.getUser().id){
            let msg = new Message(
                input,
                this.getUser(),
                new User(channel_id,this),
            );
            this.onMessage(msg);
        }
    }   
    
    getUser(): User {
        return new User( this.client.user.id,this);
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
        let channel = this.client.channels.get(msg.destination.id)
        channel.send(msg.messageData);
    }

    onInput(input: string): InputQueueEntry {
        let msg = new Message(
            input,
            new User(this.username,this),
            new User(this.username,this));
        this.onMessage(msg);
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
        console.log('\x1b[36m%s\x1b[0m', "\nDiscord will begin logging in");
        this.client.login(this.BOT_TOKEN)
        return null;
    };
}