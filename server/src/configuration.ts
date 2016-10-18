import { readFile } from "./promisified-io";

var configFile: string;
export var phraseAppURl: string;
export var locales: Object[] = [];
export var phraseAppData: any[] = [];
export var accessToken: string;

export async function setupConfiguration() {
    configFile = await readFile("config.json");
    phraseAppURl = JSON.parse(configFile).phraseAppUrl;
    locales = JSON.parse(configFile).LOCALES;
    accessToken = JSON.parse(configFile).ACCESS_TOKEN;
}
