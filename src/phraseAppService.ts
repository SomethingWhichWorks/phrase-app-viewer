import { httpRequest } from "./promisified-io";
import { phraseAppURl, locales, accessToken } from "./configuration";
import * as _ from "lodash";

export async function getDataFromPhraseApp() {
    var self = this;
    var defaultTimeout = 1000;
    var chunks = _.chunk(locales, 2);
    return new Promise((mainResolve, mainReject) => {
        var promises: Promise<any>[] = [];
        _.forEach(chunks, function(chunk) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(function() {
                    triggerPull(chunk).then((data) => {
                        resolve(data);
                    }, (error) => {
                        reject(error);
                    });
                }, defaultTimeout += 1000);
            });
            promises.push(promise);
        });

        Promise.all(promises).then((data) => {
            var array: Object[] = [];
            _.forEach(data, function(arr) {
                _.forEach(arr, function(collection) {
					_.forEach(collection, function(value, key) {
						array.push({ 'key': key, 'value': value });
					});
                });
            });

            mainResolve(UnionAndNormalize(array));
        }, (errors) => {
            console.log(errors);
            mainReject(errors);
        });
    });
}

async function triggerPull(localeIdData: any) {

    return new Promise((mainResolve, mainReject) => {
        var promises: Promise<any>[] = [];

        console.log('inside process');
        _.forEach(localeIdData, function(locale) {
            let promise = new Promise((resolve, reject) => {
                let phraseAppDownloadUrl = phraseAppURl.concat(locale.id, '/download?file_format=json&access_token=', accessToken);
                console.log('download url : ', phraseAppDownloadUrl);
                httpRequest(`${phraseAppDownloadUrl}`).then(body => {
                    //var response = {'locale':locale.locale, 'labels':JSON.parse(body)};

                    var response = normalizeResponse(JSON.parse(body), locale.locale);

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

function normalizeResponse(data: Object, locale: string) {
    return _.forEach(data, function(value: any, key: string) {
        value['locale'] = locale;
    });
}

function UnionAndNormalize(data: Object[]) {
    return _.chain(data)
        .groupBy('key')
        .toPairs()
        .map((object: any) => {
            let object1: any = {
                'key': object[0],
                'labels': _.zipObject(_.map(object[1], 'value.locale'),
                    _.map(object[1], 'value'))
            };
            return object1;
        })
        .value();

}

function generateJSON() {

}

function generateCsv() {

}

function generateExcel() {

}


