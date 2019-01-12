
import {Service} from "./Service";
import {Module} from "./Module";
import {ConsoleService} from "./ConsoleService";
import {CopyCatModule} from "./CopyCatModule";
import {Message} from "./Message";
import { ReplyModule } from "./ReplyModule";
import { FBService } from "./FBService";
import { ConsoleInputHandler } from './ConsoleInputHandler';
import { DiscordService } from "./DiscordService";
export class Bot {
    input: ConsoleInputHandler = new ConsoleInputHandler();
    services: Service[] =[];
    modules: Module[] = [];
    messagesTimer;
    moduleTickTimer;

    constructor() {
        this.services = [];
        this.modules = [];

        this.services.push(new ConsoleService(this.input));
        this.services.push(new DiscordService(this.input));
        //this.services.push(new FBService(this.input));
        this.modules.push (new CopyCatModule(/* Give config*/));
        this.modules.push(new ReplyModule());

        for (let service of this.services){
            this.input.push(service.login());
        }
        this.input.outputLabel();
    }


    sendMessages(msgsToSend: Message[]) : void {
        for (let msg of msgsToSend){
            for (let service of this.services) {
                if (msg.destination.service === service.constructor.toString()){
                    service.sendMessage(msg);
                }
            }
        }
    }

    onSingleMessage(msg: Message, service: Service): void {
        let msgs: Message[] = [];
        msgs.push(msg);
        this.onMessages(msgs,service);
    }

    onMessages(msgs: Message[], service: Service): void {
        for (let msg of msgs){
            for (let item of this.modules) {
                // Assert: msg.source.service === service.constructor.toString();
                this.sendMessages(item.onMessage(msg,service));
            }
        }
    }
    loop(): void {
        this.messagesTimer = setInterval(()=> {this.checkMessages()}, 500); 
        this.moduleTickTimer = setInterval(()=> {this.tickModules()}, 500); 
    }

    tickModules(): void {
        for (let item of this.modules){
            item.onTick();
        }
    }

    checkMessages(): void {
        for (let service of this.services){
            for (let msg of service.getMessages()){
                for (let item of this.modules) {
                    // Assert: msg.source.service === service.constructor.toString();
                    
                    this.sendMessages(item.onMessage(msg,service));
                }
            }
        }
    }
}