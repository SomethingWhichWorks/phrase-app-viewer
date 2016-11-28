'use strict';
import { PromisedIO } from "../support/promisified-io";
import { Configuration } from "../support/configuration";

import * as _ from "lodash";

export class PhraseAppBasicService {
    public async getDataFromPhraseApp() {
        var defaultTimeout = 500;

        return new Promise((mainResolve, mainReject) => {
            var promises: Promise<any>[] = [];

            return this.getLocales().then(locales => {
                _.forEach(locales, function (chunk) {
                    var promise = new Promise((resolve, reject) => {
                        setTimeout(function () {
                            this.triggerPull(chunk).then((data) => {
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

                    var resolvedData = this.UnionAndNormalize(array);
                    mainResolve(resolvedData);
                }, (errors) => {
                    console.log(errors);
                    mainReject(errors);
                });
            });
        });
    }

    // Trigger pull, actual phraseapp work happens here 
    private async triggerPull(locale: any) {
        return new Promise((resolve, reject) => {
            var phraseAppDownloadUrl = Configuration.phraseAppURl.concat('locales/', locale.id, '/download?file_format=json&access_token=', Configuration.accessToken);
            console.log('download url : ', phraseAppDownloadUrl);
            PromisedIO.httpRequest(`${phraseAppDownloadUrl}`)
                .then(body => {
                    var response = this.normalizeResponse(JSON.parse(body), locale.name);
                    resolve(response);
                })
                .catch(err => {
                    console.log('Unable to download labels :', err);
                    reject(err);
                });
        });
    }

    private normalizeResponse(data: Object, locale: string) {
        return _.forEach(data, function (value: any, key: string) {
            value['locale'] = locale;
        });
    }

    private UnionAndNormalize(data: Object[]) {
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

    //
    private getLocales() {
        var localeDownloadUrl = Configuration.phraseAppURl.concat('locales?access_token=', Configuration.accessToken);
        console.log('Download Locales: ', localeDownloadUrl);
        return new Promise((resolve, reject) =>
            PromisedIO.httpRequest(`${localeDownloadUrl}`)
                .then(body => {
                    resolve(JSON.parse(body))
                })
                .catch(err => {
                    reject(err);
                }));
    }
}