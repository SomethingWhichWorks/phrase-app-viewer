import { httpRequest, readFile } from "./promisified-io";
import * as express from "express";
import * as _ from "lodash";

let configFile:string;
let phraseAppURl:string;
let locales:Object;
let localeIDs:Object;
let phraseAppData: any[] = [];
let accessToken: string;
let app = express();

/*
 Init all
 */
setupConfiguration();

app.get("/phraseapp", (req:any, res:any) => {
    res.setHeader("Content-Type", "application/json");
    res.send({'message': 'Reached to server'});
});

app.get("/phraseapp/data.json", (req:any, res:any) => {
    getDataFromPhraseApp().then(function (body:any) {
        console.log('Call returned : ', body);
        res.setHeader("Content-Type", "application/json");
        res.send(body);
    })
    .catch(function (err:any) {
        console.error(err);
        res.send(err);
    });
});

async function setupConfiguration() {
    configFile = await readFile("config.json");
    phraseAppURl = JSON.parse(configFile).phraseAppUrl;
    locales = JSON.parse(configFile).LOCALES.split(' ');
    localeIDs = JSON.parse(configFile).LOCALE_IDS.split(' ');
    accessToken = JSON.parse(configFile).ACCESS_TOKEN;
}

async function getDataFromPhraseApp() {
    var self = this;
    var defaultTimeout = 2000;

    return new Promise((mainResolve, mainReject) => {
        var promises:Promise<any>[] = [];

        console.log('inside process');
        _.forEach(localeIDs, function (locale) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(function () {
                    console.log('inside loop');
                    let phraseAppDownloadUrl = phraseAppURl.concat(locale, '/download?file_format=json&access_token=', accessToken);
                    console.log('download url : ', phraseAppDownloadUrl);
                    httpRequest(`${phraseAppDownloadUrl}`).then(body => {
                        resolve(body);
                    })
                    .catch(err => {
                       reject(err);
                    });
                }, defaultTimeout);
            });
            promises.push(promise);
        });

        Promise.all(promises).then((data) => {
            console.log(data);
            mainResolve(data);
        }, (errors) => {
            console.log(errors);
            mainReject(errors);
        });
    });
}

function generateJSON() {

}

function generateCsv() {

}

function generateExcel() {

}


const server = app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
