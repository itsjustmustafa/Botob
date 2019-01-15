/**
 * An item which requests user input for processing
 */
export class InputStackEntry {
    constructor( listener: (input: string) => InputStackEntry, label: string) {
        this.label = label;
        this.listener = listener;
    }

    /**
     *  The function to execute upon receiving user input. 
     *  
     *     Return a function which will next begin receiving user input.
     *     Return null to signify no further processing is required
     * 
     * @TODO: Make return type an optional to better demonstrate intent
     */
    listener: (input: string) => InputStackEntry;

    /** The label which will be displayed on the command line preceeding user input */
    label: string;
}