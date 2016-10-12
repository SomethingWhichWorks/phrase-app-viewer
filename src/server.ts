import { httpRequest, readFile } from "./promisified-io";
import * as express from "express";
import * as _ from "lodash";

let configFile:string;
let phraseAppURl:string;
let locales:Object[] = [];
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
        res.setHeader("Content-Type", "application/json");
        res.send(body);
    })
    .catch(function (err:any) {
        res.send(err);
    });
});

async function setupConfiguration() {
    configFile = await readFile("config.json");
    phraseAppURl = JSON.parse(configFile).phraseAppUrl;
    locales = JSON.parse(configFile).LOCALES;
    accessToken = JSON.parse(configFile).ACCESS_TOKEN;
}

async function getDataFromPhraseApp() {
    var self = this;
    var defaultTimeout = 1000;
    var chunks = _.chunk(locales, 2);
    return new Promise((mainResolve, mainReject) => {
        var promises:Promise<any>[] = [];
        _.forEach(chunks, function(chunk) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(function(){
                    triggerPull(chunk).then((data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }, defaultTimeout+=1000);
            });
            promises.push(promise);
        });

        Promise.all(promises).then((data) => {
            var array:Object[] = [];
            _.forEach(data, function(arr){
                _.forEach(arr, function(collection) {
                   array.push(collection);
                });
            });
            mainResolve(array);
        }, (errors) => {
            console.log(errors);
            mainReject(errors);
        });
    });
}

async function triggerPull(localeIdData:any) {

    return new Promise((mainResolve, mainReject) => {
        var promises:Promise<any>[] = [];

        console.log('inside process');
        _.forEach(localeIdData, function (locale) {
            let promise = new Promise((resolve, reject) => {
                let phraseAppDownloadUrl = phraseAppURl.concat(locale.id, '/download?file_format=json&access_token=', accessToken);
                console.log('download url : ', phraseAppDownloadUrl);
                httpRequest(`${phraseAppDownloadUrl}`).then(body => {
                    var response = {'locale':locale.locale, 'labels':JSON.parse(body)};
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                });
            });
            promises.push(promise);
        });

        Promise.all(promises).then((data) => {
            mainResolve(data);
        }, (errors) => {
            mainReject(errors);
        });
    });
}

function normalizeLabelData(data: Object) {

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
