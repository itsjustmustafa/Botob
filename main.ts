import {Bot} from "./Bot";
import { SSL_OP_EPHEMERAL_RSA } from "constants";
import { worker } from "cluster";
import {Service} from "./Service";
let boBot: Bot;
boBot = new Bot();


boBot.loop();