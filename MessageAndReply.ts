/**
 * A key and value pair of strings
 */
export class MessageAndReply {

    constructor(inputRegex: RegExp, output: string){
        this.inputREGEX = inputRegex;
        this.output = output;
    }
    /**
     * Checks if the given string matches the key 
     * @TODO: MAKE REGEX
     * @param toCheck String to check the key against
     * @return True if the regex matches
     */
    checkReply(toCheck: string): Boolean{
        return toCheck.match(this.inputREGEX) !== null;
    }
    /** 
     * Returns the key that input strings are compared against
     * @return The key
     */
    getKey(): RegExp {
        return this.inputREGEX;
    }

    getReply(): string {
        return this.output;
    }

    inputREGEX: RegExp;
    output: string;
}