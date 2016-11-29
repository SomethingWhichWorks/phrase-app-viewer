'use strict';
import {PromisedIO} from "../support/promisified-io";
import {Configuration} from "../support/configuration";

import * as _ from "lodash";
import * as request from "request";
import * as http from "http";
import * as URL from "url";

export class PhraseAppDetailsService {

    // public method exposed
    public async getLabelDetails(labelId: string) {
        var labelDownloadUrl = Configuration.phraseAppURl.concat('translations/', labelId, '?access_token=', Configuration.accessToken);
        console.log(labelDownloadUrl);
        return new Promise((resolve, reject) => {
            PromisedIO.httpRequest(`${labelDownloadUrl}`)
                .then(responseData => {
                    console.log(responseData);
                    resolve(JSON.parse(responseData));
                })
                .catch(err => {
                    console.log('Unable to download label details :', err);
                    reject(err);
                });
        });
    }

    public async getKeys = () => {
        var defaultTimeout = 500;
        var phraseAppDownloadUrl = Configuration.phraseAppURl.concat('translations?access_token=', Configuration.accessToken, '&page=1&per_page=100');
        return new Promise((mainResolve, mainReject) => {
            var promises: Promise<any>[] = [];
            var self = this;

            self.triggerPullAndFetchLinks(phraseAppDownloadUrl).then((response) => {
                if (response.links) {
                    //3 links are sent, second [1] link contains the last page number
                    var linkUrlParts = URL.parse(response.links[1], true, true);
                    var lastPage = linkUrlParts.query.page;
                    var urls = [];
                    //Test 
                    //lastPage = 5;
                    for (var i = 0; i < parseInt(lastPage); i++) {
                        var url = Configuration.phraseAppURl.concat('translations?access_token=', Configuration.accessToken, '&page=', i.toString(), '&per_page=100');
                        urls.push(url);
                    }

                    _.forEach(urls, (link) => {
                        var promise = new Promise((resolve, reject) => {
                            setTimeout(function () {
                                self.triggerPull(link).then((data) => {
                                    resolve(data);
                                }, (error) => {
                                    reject(error);
                                });
                            }, defaultTimeout += 1000);
                        });
                        promises.push(promise);
                    });

                    Promise.all(promises).then((data) => {
                        mainResolve(this.normalizeData(data));
                    }, (errors) => {
                        console.log(errors);
                        mainReject(errors);
                    });
                }
            }, (err) => {
                console.log(err);
                mainReject(err);
            }).catch((err) => {
                console.log(err);
            });
        });
    };

    // merge all items from the array
    private mergeArrays(arrays) {
        var mergedArray = [];
        _.each(arrays, arrayItem => {
            mergedArray = _.concat(mergedArray, arrayItem);
        });
        return mergedArray;
    }

    //Just the grouping logic
    private groupByKey(data): any {
        return _.chain(data)
            .groupBy('key.name')
            .toPairs()
            .map((object: any) => {
                var object1: any = {
                    'key': object[0],
                    'labels': _.zipObject(_.map(object[1], 'locale.name'),
                        object[1])
                };
                return object1;
            })
            .value();
    }

    // Normalize the Data 
    private normalizeData(arrayData) {
        var bigArray = [];
        bigArray = this.mergeArrays(arrayData);
        bigArray = this.groupByKey(bigArray);
        return bigArray;
    }

    // Main triger to phrase-app
    private async triggerPull(phraseAppDownloadUrl: any) {
        return new Promise((resolve, reject) => {
            console.log('download url in triggerPull: ', phraseAppDownloadUrl);
            PromisedIO.httpRequest(`${phraseAppDownloadUrl}`)
                .then(responseData => {
                    resolve(JSON.parse(responseData));
                })
                .catch(err => {
                    console.log('Unable to download translations :', err);
                    reject(err);
                });
        });
    }

    //Trigger pull and fetch links
    private async triggerPullAndFetchLinks = (phraseAppDownloadUrl: any) => {
        return new Promise((resolve, reject) => {
            this.httpReq(`${phraseAppDownloadUrl}`)
                .then((responseData) => {
                    resolve(responseData);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    //
    private getLinks = (linkObj) => {
        var links = [];
        _.each(this.tokanize(linkObj), (token) => {
            links.push(this.removeAdditionalParams(token));
        });
        return links;
    }

    private httpReq(uri: string) {
        return new Promise((resolve, reject) => {
            var options = {
                url: uri,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode !== 200) {
                    reject(response.statusCode);
                }
                else {
                    var dataAndLinks = {
                        'data': body,
                        'links': this.getLinks(response.headers.link)
                    };
                    resolve(dataAndLinks);
                }
            });

        });
    }

    private tokanize(data) {
        if (data) {
            return JSON.stringify(data).split(',');
        } else {
            return [];
        }
    }

    private removeAdditionalParams(object) {
        var string = object;
        string = string.substring(0, string.indexOf(';'));
        string = string.replace('<', '');
        string = string.replace('>', '');
        return string;
    }
}