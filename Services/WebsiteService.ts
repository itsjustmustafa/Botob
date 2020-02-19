import {Service} from "./Service";
import {Message} from "./Message"
import {InputStackEntry} from "./InputStackEntry"
import * as http from "express"
export class WebsiteService implements Service {
    
    /**
     * Does nothing
     * @param msg Message received
     */
    sendMessage(msg: Message): void {}  

    /**
     * Initialises the webserver, begins listening for webpage requests to send
     */  
    login(): InputStackEntry {
        this.app.use(this.express.static('documentation'));
        //make way for some custom css, js and images
        /*
        this.app.use('/css',    this.express.static(__dirname + '/public/css'));
        this.app.use('/js',     this.express.static(__dirname + '/public/js'));
        this.app.use('/images', this.express.static(__dirname + '/public/images'));
        */
        var server = this.app.listen(80, function(){
            var port = server.address().port;
        });
        return null;
    }
    /** Not needed */
    msgs: Message[] = []; 
    /** The webserver */
    express = require("express");
    app = this.express();
}
