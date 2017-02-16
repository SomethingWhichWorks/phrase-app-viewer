'use strict';
import { PromisedIO } from "./promisified-io";
import { join } from "path";

export class Configuration {

    static phraseAppURl: string;
    static accessToken: string;
    static mongoDbUrl: string;
    static httpPort: string;
    static httpsPort: string;

    static async setupConfiguration() {
        return new Promise((resolve, reject) => {
            PromisedIO.readFile(join(__dirname, '../','config.json'))
            .then((configFile) => {
                var configFileJson = JSON.parse(configFile);
                Configuration.phraseAppURl = configFileJson.phrase_App_Url;
                Configuration.accessToken = process.env.PHRASEAPP_ACCESS_TOKEN;
                var urlFromConfigFile = configFileJson.MONGO_DB_URL;

                if (process.env.MONGO_DB_URL && process.env.MONGO_DB_URL !== undefined) {
                    Configuration.mongoDbUrl = process.env.MONGO_DB_URL;
                } else {
                    Configuration.mongoDbUrl = urlFromConfigFile;
                }

                Configuration.httpPort = process.env.http_port ||  configFileJson.http_port;
                Configuration.httpsPort = process.env.https_port ||  configFileJson.https_port;    


                resolve();
            }, err => {
                console.log('Something wrong with config file, please check \'config.json\' configuration');
                reject();
            })
        });

    }


}

