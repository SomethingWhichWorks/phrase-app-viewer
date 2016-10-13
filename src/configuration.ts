import { readFile } from "./promisified-io";

let configFile: string;
export let phraseAppURl: string;
export let locales: Object[] = [];
export let phraseAppData: any[] = [];
export let accessToken: string;

export async function setupConfiguration() {
    configFile = await readFile("config.json");
    phraseAppURl = JSON.parse(configFile).phraseAppUrl;
    locales = JSON.parse(configFile).LOCALES;
    accessToken = JSON.parse(configFile).ACCESS_TOKEN;
}
