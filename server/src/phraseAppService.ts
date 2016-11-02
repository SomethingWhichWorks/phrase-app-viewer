import { httpRequest } from "./promisified-io";
import { phraseAppURl, accessToken } from "./configuration";
import * as _ from "lodash";

export async function getDataFromPhraseApp() {
    var self = this;
    var defaultTimeout = 500;

    return new Promise((mainResolve, mainReject) => {
        var promises: Promise<any>[] = [];

        return getLocales().then(locales => {
            //var chunks = _.chunk(locales, 2);
            _.forEach(locales, function (chunk) {
                var promise = new Promise((resolve, reject) => {
                    setTimeout(function () {
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
                _.forEach(data, function (collection) {
                    _.forEach(collection, function (value, key) {
                        array.push({ 'key': key, 'value': value });
                    });
                });

                var resolvedData = UnionAndNormalize(array);
                mainResolve(resolvedData);
            }, (errors) => {
                console.log(errors);
                mainReject(errors);
            });
        });
    });
}

async function triggerPull(locale: any) {

    return new Promise((resolve, reject) => {
        var phraseAppDownloadUrl = phraseAppURl.concat('/',locale.id, '/download?file_format=json&access_token=', accessToken);
        console.log('download url : ', phraseAppDownloadUrl);
        httpRequest(`${phraseAppDownloadUrl}`)
            .then(body => {
                var response = normalizeResponse(JSON.parse(body), locale.name);
                resolve(response);
            })
            .catch(err => {
               console.log('Unable to download labels :', err);
               reject(err);
            });
    });
}

function normalizeResponse(data: Object, locale: string) {
    return _.forEach(data, function (value: any, key: string) {
        value['locale'] = locale;
    });
}

function UnionAndNormalize(data: Object[]) {
    return _.chain(data)
        .groupBy('key')
        .toPairs()
        .map((object: any) => {
            var object1: any = {
                'key': object[0],
                'labels': _.zipObject(_.map(object[1], 'value.locale'),
                    _.map(object[1], 'value'))
            };
            return object1;
        })
        .value();
}

function getLocales() {
    var localeDownloadUrl = phraseAppURl + '?access_token=' + accessToken;

    return new Promise((resolve, reject) =>
        httpRequest(`${localeDownloadUrl}`).then(body => {
            resolve(JSON.parse(body))
        })
        .catch(err => {
            reject(err);
        }));
}


function generateJSON() {

}

function generateCsv() {

}

function generateExcel() {

}


