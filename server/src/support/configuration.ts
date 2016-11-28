'use strict';
import { PromisedIO } from "./promisified-io";
import { join } from "path";

export class Configuration {

    static phraseAppURl: string;
    static accessToken: string;
    static mongoDbUrl: string;

    static async setupConfiguration() {
        return new Promise((resolve, reject) => {
            PromisedIO.readFile(join(__dirname, '../','config.json'))
            .then((configFile) => {
                var configFileJson = JSON.parse(configFile);
                Configuration.phraseAppURl = configFileJson.phrase_App_Url;
                Configuration.accessToken = process.env.PHRASEAPP_ACCESS_TOKEN;
                Configuration.mongoDbUrl = configFileJson.MONGO_DB_URL;
                resolve();
            }, err => {
                console.log('Something wrong with config file, please check \'config.json\' configuration');
                reject();
            })
        });

    }


}

