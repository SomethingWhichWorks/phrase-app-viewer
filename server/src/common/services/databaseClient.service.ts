'use strict';

import {MongoClient} from 'mongodb';
import {Configuration} from '../../support/configuration';
import * as _ from "lodash";


export class DatabaseClientService {

    private mongoClient = MongoClient;
    private connection;

    public init = () => {
        console.log('connecting to Mongo Db database on :', Configuration.mongoDbUrl);
    };

    private getConnection = () => {
        return new Promise((resolve, reject) => {
            if (this.connection === undefined) {
                this.mongoClient.connect(Configuration.mongoDbUrl, (err, db) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    this.connection = db;
                    resolve(this.connection);
                });
            } else {
                resolve(this.connection);
            }
        });
    };

    // we should call this whenever application close
    private closeConnection = () => {
        this.connection.close();
        console.log('Connection to db closed');
    };


    // Insert into table
    // supports both, single record and bulk records
    public insert = (table, payload) => {
        return new Promise((resolve, reject) => {
            this.getConnection().then(db => {
                var collection = db.collection(table);

                if (Array.isArray(payload)) {
                    collection.insertMany(payload, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    collection.insertOne(payload, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            }, err => {
                reject(err);
            });
        });
    };

    /** Update database **/
    public update = (table, searchFilter, updatedPayload) => {
        return new Promise((resolve, reject) => {
            this.getConnection().then(db => {
                var collection = db.collection(table);
                collection.updateOne(
                    searchFilter,
                    updatedPayload,
                    (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });

            }, err => {
                reject(err);
            });
        });
    };

    /** Find query to return data **/
    public find = (table, searchFilter) => {
        return new Promise((resolve, reject) => {
            this.getConnection().then(db => {
                var collection = db.collection(table);
                collection.find(searchFilter).toArray(function (err, docs) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }

                });
            }, err => {
                reject(err);
            });
        });
    };

    // Drop table/collection
    public dropTable = (table) => {
        return new Promise((resolve, reject) => {
            this.getConnection().then(db => {

                db.listCollections().toArray().then((replies) => {
                    var collection = _.find(replies, (reply) => {
                        return reply.name === table;
                    });

                    if (collection) {
                        collection = db.collection(table);
                        collection.drop((err, reply) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(reply);
                        });
                    } else {
                        resolve();
                    }
                });

            });
        });
    };

    //rename the collection/table
    public renameTable = (oldName, newName) => {

        return new Promise((resolve, reject) => {
            this.getConnection().then(db => {
                var collection = db.collection(oldName);

                if (oldName === newName) {
                    reject('old and new names should be different');
                }

                collection.rename(newName, (err, newCollection) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(newCollection);
                });

            });
        });
    };


    /** Exit function - Close connection before exit **/
    private exit = () => {
        this.closeConnection();
    };
}
