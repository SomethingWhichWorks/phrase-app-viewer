'use strict';
import { PhraseAppBasicService } from "./phraseAppBasic.service";

export class PhraseAppBasicResource {
    phraseAppBasicService = new PhraseAppBasicService();

    private cachedPhraseappData = {
        timeStamp: null,
        data: null
    };
    private now = Date.now();

    healthcheck(req, res) {
        console.log('PhraseAppBasicResource API Healthcheck Successful');
        return res.status(200).json({ message: 'PhraseAppBasicResource API Healthcheck Successful' });
    }

    getTranslations = (req, res) => {
        var self = this;
        self.now = Date.now();

        if (self.cachedPhraseappData.timeStamp && self.cachedPhraseappData.data) {
            if (self.now - this.cachedPhraseappData.timeStamp > 300000) {     // If request comes after 5 minutes, then fetch new data
                self.fetchDataAndSendResponse(req, res);
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(self.cachedPhraseappData.data);
            }
        } else {
            self.fetchDataAndSendResponse(req, res);            
        }

    }

    private fetchDataAndSendResponse = (req, res) => {
        var self = this; 
        self.phraseAppBasicService.getDataFromPhraseApp()
            .then(function (body: any) {
                res.setHeader("Content-Type", "application/json");
                self.cachedPhraseappData.timeStamp = self.now;
                self.cachedPhraseappData.data = body;
                res.send(self.cachedPhraseappData.data);
            })
            .catch(function (err: any) {
                res.send(err);
            });
    }
}


