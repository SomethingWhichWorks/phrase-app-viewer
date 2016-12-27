'use strict';
import { PhraseAppDetailsService } from "./phraseAppDetails.service";
import { DatabaseClientService } from '../common/services/databaseClient.service';
import { Observable } from 'rxjs/Rx';

export class PhraseAppDetailsResource {
    private phraseAppDetailsService = new PhraseAppDetailsService();

    private isFetchKeysInProgress = false;
    private cachedPhraseappTranslations = {
        timeStamp: null,
        data: null
    };
    private now = this.getCurrentTimeStamp();

    private table: string = 'detailed-translations';
    private dbClient: DatabaseClientService;
    private ticks = 0;
    //constructor
    constructor() {
        //init when services start    
        this.dbClient = new DatabaseClientService();

        // added a 30 minute timer to rerun jobs
        //let timer = Observable.timer(2000,1800000);
        let timer = Observable.timer(2000, 120000);
        timer.subscribe(t => {
            console.log('Triggering a phraseapp sync...');
            this.ticks = t;
            this.fetchKeyTranslations();
        });
    };

    healthcheck = (req, res) => {
        console.log('PhraseAppDetailsResource API Healthcheck Successful');
        return res.status(200).json({ message: 'PhraseAppDetailsResource API Healthcheck Successful' });
    };

    public getTranslations = (req, res) => {
        var cachedData = this.phraseAppDetailsService.getCachedTranslations();
        if (cachedData.data && cachedData.data.length !== 0) {
            this.checkDataAndSendResponse(cachedData, req, res);
        } else {
            this.dbClient.find(this.table, {}).then(data => {
                if (data && data.length === 1) {
                    var dataFromDb = data[0];
                    this.checkDataAndSendResponse(dataFromDb, req, res);
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.send({ error: 'No Cached data available, please wait until data is fetched' });
                }
            }, err => {
                console.log('Error thrown while fetching data from database: ', err);
                res.setHeader("Content-Type", "application/json");
                res.send({ error: 'No Cached data available, please wait until data is fetched' });
            });

        }
    };

    private checkDataAndSendResponse = (dataFromDb, req, res) => {
        if (dataFromDb.timeStamp && dataFromDb.data) {
            console.log('Data to be returned : ', dataFromDb.data.length);
            res.setHeader("Content-Type", "application/json");
            res.send(dataFromDb.data);
        } else {
            res.setHeader("Content-Type", "application/json");
            res.send({ error: 'No Cached data available, please wait until data is fetched' });
        }
    };

    // Get Label details for label Id
    public getLabelDetails = (req, res) => {
        console.log('Label Id :', req.params.id);
        this.phraseAppDetailsService.getLabelDetails(req.params.id).then(data => {
            res.setHeader("Content-Type", "application/json");
            res.send(data);
        }, err => {
            res.setHeader("Content-Type", "application/json");
            res.status(500).send({ 'error': err });
        });
    };

    // Get Currency Time Stamp
    private getCurrentTimeStamp() {
        return Date.now();
    }


    // Fetch keys and store them on database table
    private fetchKeyTranslations = () => {
        var now = this.getCurrentTimeStamp();
        this.isFetchKeysInProgress = true;

        this.phraseAppDetailsService.getKeys().then((body: any) => {
            this.isFetchKeysInProgress = false;
            console.log('saving data to the database');
            var translations = {
                timeStamp: now,
                data: body
            };
            var tempTable = this.table + '_temp';
            this.dbClient.dropTable(tempTable).then(() => {
                this.dbClient.insert(tempTable, translations);

                this.dbClient.dropTable(this.table).then(response => {
                    this.dbClient.renameTable(tempTable, this.table).then(response => {
                        this.phraseAppDetailsService.setCachedTranslations(translations);
                        console.log('updated the ', this.table, ', with latest data');
                    }, err => {
                        console.log('Unable to rename temp table with new table, : ', err);
                    });
                }, err => {
                    console.log('Unable to drop the existing table, : ', err);
                });
            }, (err) => {
                console.log(err);
            });

        }, (err) => {
            this.isFetchKeysInProgress = false;
            console.log(err);
        });
    }
}


