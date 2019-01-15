import {Service} from "./Service";
import {Message} from "./Message"
import {InputStackEntry} from "./InputStackEntry"
import * as http from "http"
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
        this.server = http.createServer(function (req, res) {
            var fs = require('fs');
            let path = __dirname + req.url;
            if (fs.existsSync(path) === false) {
                path = __dirname + "documentation/" + req.url;
            }
            
            fs.readFile(__dirname + req.url, 'utf8', function(err, contents) {
                
                
                if (err) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("an error occured searching for: " + req.url);
                } else {
                    let dotoffset: number = req.url.lastIndexOf('.');
                    var mimetype = dotoffset == -1
                                    ? 'text/plain'
                                    : {
                                        '.html' : 'text/html',
                                        '.ico' : 'image/x-icon',
                                        '.jpg' : 'image/jpeg',
                                        '.png' : 'image/png',
                                        '.gif' : 'image/gif',
                                        '.css' : 'text/css',
                                        '.js' : 'text/javascript'
                                        }[ req.url.substr(dotoffset) ];
                    res.setHeader('Content-type' , mimetype);
                    res.write(contents)
                }
                res.end();
            });
          }).listen(80);
          return null;
    }
    /** Not needed */
    msgs: Message[] = []; 
    /** The webserver */
    server : http.Server;
}