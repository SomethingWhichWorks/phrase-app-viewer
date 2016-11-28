'use strict';
import { PhraseAppDetailsService } from "./PhraseAppDetails.service";

export class PhraseAppDetailsResource {
    private phraseAppDetailsService = new PhraseAppDetailsService();

    private isFetchKeysInProgress = false;
    private cachedPhraseappTranslations = {
        timeStamp: null,
        data: null
    };
    private now = this.getCurrentTimeStamp();

    //constructor
    PhraseAppDetailsResource() {
        //init when services start    
        this.fetchKeyTranslations();
    }

    healthcheck(req, res) {
        console.log('PhraseAppDetailsResource API Healthcheck Successful');
        return res.status(200).json({ message: 'PhraseAppDetailsResource API Healthcheck Successful' });
    }

    getTranslations(req, res) {
        this.now = this.getCurrentTimeStamp();


        if (this.isFetchKeysInProgress) {
            res.setHeader("Content-Type", "application/json");
            res.send({ 'message': 'Update is in progress, please try again after some time' });
        }

        if (this.cachedPhraseappTranslations.timeStamp && this.cachedPhraseappTranslations.data) {
            console.log('Trying Cached keys');
            if (this.now - this.cachedPhraseappTranslations.timeStamp > 3600000) {     // If request comes after 5 minutes, then fetch new data
                this.fetchKeysAndSendResponse(req, res);
            } else {
                console.log('Data to be returned : ', this.cachedPhraseappTranslations.data.length);
                res.setHeader("Content-Type", "application/json");
                res.send(this.cachedPhraseappTranslations.data);
            }
        } else {
            this.fetchKeysAndSendResponse(req, res);
        }
    }

    // Get Label details for label Id
    getLabelDetails(req, res) {
        console.log('Label Id :', req.params.id);
        this.phraseAppDetailsService.getLabelDetails(req.params.id).then(data => {
            res.setHeader("Content-Type", "application/json");
            res.send(data);
        }, err => {
            res.setHeader("Content-Type", "application/json");
            res.status(500).send({ 'error': err });
        });
    }



    // Force Fetch data if needed
    private fetchKeysAndSendResponse(req, res) {
        console.log('fetchKeysAndSendResponse');
        this.fetchKeyTranslations().then(() => {
            console.log('Sending Response after saving cache');
            res.setHeader("Content-Type", "application/json");
            res.send(this.cachedPhraseappTranslations.data);
        }, (err) => {
            res.status = 500;
            res.send(err);
        });
    }

    // Get Currency Time Stamp
    private getCurrentTimeStamp() {
        return Date.now();
    }

    //fetch keys from backend
    private fetchKeyTranslations() {
        var now = this.getCurrentTimeStamp();
        this.isFetchKeysInProgress = true;
        return new Promise((resolve, reject) => {
            this.phraseAppDetailsService.getKeys().then((body: any) => {
                this.isFetchKeysInProgress = false;
                console.log('saving cache');
                this.cachedPhraseappTranslations.timeStamp = now;
                this.cachedPhraseappTranslations.data = body;
                resolve(body);
            }, (err) => {
                this.isFetchKeysInProgress = false;
                console.log(err);
                reject(err);
            });
        });
    }
}


