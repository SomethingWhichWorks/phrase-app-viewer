'use strict';

import * as fs from "fs";
import * as request from "request";
import * as http from "http";

export class PromisedIO {

    static httpRequest(uri: string) {
        return new Promise<any>((resolve, reject) => {
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
                    resolve(body);
                }
            });

        });
    }

    static readFile(fileName: string) {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(fileName, 'utf8', (error, data) => {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    resolve(data);
                }
            });
        });
    }

}



