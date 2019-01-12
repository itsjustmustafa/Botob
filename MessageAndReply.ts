export class MessageAndReply {

    constructor(inputRegex: string, output: string){
        this.inputREGEX = inputRegex;
        this.output = output;
    }

    checkReply(toCheck: string): Boolean{
        return this.inputREGEX === toCheck;
    }
    getReply(): string {
        return this.output;
    }
    getKey(): string {
        return this.inputREGEX;
    }

    inputREGEX: string;
    output: string;
}