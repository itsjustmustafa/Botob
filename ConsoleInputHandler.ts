import { removeListener } from "cluster";

const readline = require('readline');


export class InputQueueEntry {
    constructor( listener: (input: string) => InputQueueEntry, label: string) {
        this.label = label;
        this.listener = listener;
    }

    listener: (input: string) => InputQueueEntry;
    label: string;
}

// Handle console input
export class ConsoleInputHandler {
    
    InputQueue: InputQueueEntry[] = [];
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    constructor(){
        this.rl.on('line', (input) => {this.onInput(input)});
    }
    
    onInput(input: string): void { 
        if (this.InputQueue.length > 0){
            let lastEntry: InputQueueEntry = this.InputQueue.pop();
            let optFunc: InputQueueEntry = lastEntry.listener(input);

            if (optFunc){
                this.outputLabel();
                this.InputQueue.push(optFunc);
            }
        }
        this.outputLabel();
    }

    outputLabel(): void {
        if (this.InputQueue.length > 0){
            this.rl.setPrompt("\x1b[32m" + this.InputQueue[this.InputQueue.length-1].label + ">" + '\x1b[0m');
            this.rl.prompt();
        }
    }
    push(listener: InputQueueEntry): void {
        if (listener){
            this.InputQueue.push(listener);
        }
    }

}