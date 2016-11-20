import { readFile } from "./promisified-io";

export var phraseAppURl: string;
export var accessToken: string;

export async function setupConfiguration() {

    return new Promise((resolve, reject) => {
        readFile(__dirname + "/config.json").then((configFile) => {
            phraseAppURl = JSON.parse(configFile).phraseAppUrl;
            accessToken = process.env.PHRASEAPP_ACCESS_TOKEN;
            resolve();
        }, err => {
            console.log('Something wrong with config file, please check \'config.json\' configuration');
            reject();
        })

    });

}
