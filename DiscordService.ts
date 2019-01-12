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
            this.msgs.push(msg);
        }
    }   
    
    getUser(): User {
        return new User(this.client.user.id, this);
    }

    sendMessage(msg: Message): void {
        let channel = this.client.channels.get(msg.destination.id)
        channel.send(msg.messageData);
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
        var fs = require('fs');
        if (fs.existsSync("discordToken.txt")) {
            console.log('\x1b[36m%s\x1b[0m', "\nReading token from file");
            this.BOT_TOKEN = fs.readFileSync("discordToken.txt", "utf8");
            console.log('\x1b[36m%s\x1b[0m', "\nDiscord will begin logging in");
            this.client.login(this.BOT_TOKEN)
        } else {
            console.log('\x1b[36m%s\x1b[0m', "\nUnable to find file to read token from, discord will not login.");
        }
        return null;
    };
}