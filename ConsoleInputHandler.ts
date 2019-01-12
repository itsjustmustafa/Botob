import {InputStackEntry} from "./InputStackEntry"
const readline = require('readline');

/**
 * Handle console input in an organised manner
 */
export class ConsoleInputHandler {
    
    /** The stack of enties that require console input */
    InputStack: InputStackEntry[] = [];
    
    /** Interface to console I/O */
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    constructor(){
        this.rl.on('line', (input) => {this.onInput(input)});
    }
    
    /**
     * Sends the input to the topmost function on the stack for processing.
     * 
     * After the current function proesses the input, if it returns a new 
     * function it is placed on the top of the stack.
     *  
     * Null is a valid return for a function and represents no further processing
     * being required. 
     * @param input The input string
     */
    onInput(input: string): void { 
        if (this.InputStack.length > 0){
            let lastEntry: InputStackEntry = this.InputStack.pop();
            let optFunc: InputStackEntry = lastEntry.listener(input);

            if (optFunc){
                this.outputLabel();
                this.InputStack.push(optFunc);
            }
        }
        this.outputLabel();
    }

    /**
     * Updates the CLI's label (text before ">" symbol)
     */
    outputLabel(): void {
        if (this.InputStack.length > 0){
            this.rl.setPrompt("\x1b[32m" + this.InputStack[this.InputStack.length-1].label + ">" + '\x1b[0m');
            this.rl.prompt();
        }
    }
    /** Push a new function to the stack of functions requesting CLI input */
    push(listener: InputStackEntry): void {
        if (listener){
            this.InputStack.push(listener);
        }
    }

}