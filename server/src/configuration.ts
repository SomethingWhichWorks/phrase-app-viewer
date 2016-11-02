import { readFile } from "./promisified-io";

var configFile: string;
export var phraseAppURl: string;
export var phraseAppData: any[] = [];
export var accessToken: string;

export async function setupConfiguration() {
    configFile = await readFile(__dirname + "/config.json");
    phraseAppURl = JSON.parse(configFile).phraseAppUrl;
    accessToken = process.env.PHRASEAPP_ACCESS_TOKEN;
}
