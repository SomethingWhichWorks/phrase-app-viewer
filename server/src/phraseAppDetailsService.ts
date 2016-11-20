import { httpRequest } from "./promisified-io";
import { phraseAppURl, accessToken } from "./configuration";
import * as _ from "lodash";
import * as request from "request";
import * as http from "http";
import * as URL from "url";


export async function getLabelDetails(labelId: string) {
    var labelDownloadUrl = phraseAppURl.concat('translations/',labelId,'?access_token=', accessToken);
    console.log(labelDownloadUrl);
    return new Promise((resolve, reject) => {
        httpRequest(`${labelDownloadUrl}`)
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

export async function getKeys() {
    var self = this;
    var defaultTimeout = 500;
    var phraseAppDownloadUrl = phraseAppURl.concat('translations?access_token=', accessToken, '&page=1&per_page=100');
    return new Promise((mainResolve, mainReject) => {
        var promises: Promise<any>[] = [];
        triggerPullAndFetchLinks(phraseAppDownloadUrl).then((response) => {
            if (response.links) {
                //3 links are sent, second [1] link contains the last page number
                var linkUrlParts = URL.parse(response.links[1], true, true);
                var lastPage = linkUrlParts.query.page;
                var urls = [];
                //Test 
                lastPage = 5;
                for (var i = 0; i < parseInt(lastPage); i++) {
                    var url = phraseAppURl.concat('translations?access_token=', accessToken, '&page=', i.toString(), '&per_page=100');
                    urls.push(url);
                }
                _.forEach(urls, (link) => {

                    var promise = new Promise((resolve, reject) => {
                        setTimeout(function () {
                            triggerPull(link).then((data) => {
                                resolve(data);
                            }, (error) => {
                                reject(error);
                            });
                        }, defaultTimeout += 1000);
                    });
                    promises.push(promise);
                });

                Promise.all(promises).then((data) => {
                    mainResolve(normalizeData(data));
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
}

function normalizeData(arrayData) {
    // merge all items from the array
    function mergeArrays(arrays) {
        var mergedArray = [];
        _.each(arrays, arrayItem => {
            mergedArray = _.concat(mergedArray, arrayItem);
        });
        return mergedArray;
    }

    function groupByKey(data): any {
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


    var bigArray = [];
    bigArray = mergeArrays(arrayData);
    bigArray = groupByKey(bigArray);

    return bigArray;
}

async function triggerPull(phraseAppDownloadUrl: any) {
    return new Promise((resolve, reject) => {
        console.log('download url in triggerPull: ', phraseAppDownloadUrl);
        httpRequest(`${phraseAppDownloadUrl}`)
            .then(responseData => {
                resolve(JSON.parse(responseData));
            })
            .catch(err => {
                console.log('Unable to download translations :', err);
                reject(err);
            });
    });
}

async function triggerPullAndFetchLinks(phraseAppDownloadUrl: any) {
    var phraseAppData = [];
    return new Promise((resolve, reject) => {
        httpReq(`${phraseAppDownloadUrl}`)
            .then((responseData) => {
                resolve(responseData);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function httpReq(uri: string) {
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
                    'links': getLinks(response.headers.link)
                };
                resolve(dataAndLinks);
            }
        });

    });
}

function getLinks(linkObj) {

    function tokanize(data) {
        if (data) {
            return JSON.stringify(data).split(',');
        } else {
            return [];
        }
    }

    function removeAdditionalParams(object) {
        var string = object;
        string = string.substring(0, string.indexOf(';'));
        string = string.replace('<', '');
        string = string.replace('>', '');
        return string;
    }

    var links = [];

    _.each(tokanize(linkObj), (token) => {
        links.push(removeAdditionalParams(token));
    });

    return links;
}

