'use strict';
import { PhraseAppBasicService } from "./PhraseAppBasic.service";

export class PhraseAppBasicResource {
    phraseAppBasicService = new PhraseAppBasicService();

    private isFetchPhraseAppDataInProgress = false;
    private cachedPhraseappData = {
        timeStamp: null,
        data: null
    };
    private now = Date.now();

    healthcheck(req, res) {
        console.log('PhraseAppBasicResource API Healthcheck Successful');
        return res.status(200).json({ message: 'PhraseAppBasicResource API Healthcheck Successful' });
    }

    getTranslations(req, res) {
        this.now = Date.now();

        if (this.isFetchPhraseAppDataInProgress) {
            res.setHeader("Content-Type", "application/json");
            res.send({ 'message': 'Update is in progress, please try again after some time' });
        }

        if (this.cachedPhraseappData.timeStamp && this.cachedPhraseappData.data) {
            if (this.now - this.cachedPhraseappData.timeStamp > 300000) {     // If request comes after 5 minutes, then fetch new data
                this.isFetchPhraseAppDataInProgress = true;
                this.fetchDataAndSendResponse(req, res);
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(this.cachedPhraseappData.data);
            }
        } else {
            this.fetchDataAndSendResponse(req, res);
            this.isFetchPhraseAppDataInProgress = true;
        }

    }

    private fetchDataAndSendResponse(req, res) {
        this.phraseAppBasicService.getDataFromPhraseApp()
            .then(function (body: any) {
                this.isFetchPhraseAppDataInProgress = false;
                res.setHeader("Content-Type", "application/json");
                this.cachedPhraseappData.timeStamp = this.now;
                this.cachedPhraseappData.data = body;
                res.send(this.cachedPhraseappData.data);
            })
            .catch(function (err: any) {
                this.isFetchPhraseAppDataInProgress = false;
                res.send(err);
            });
    }
}


