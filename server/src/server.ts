import { getDataFromPhraseApp } from "./phraseAppService";
import { getKeys } from "./phraseAppDetailsService";
import { authenticateUser } from "./login.service";
import { readFile } from "./promisified-io";
import { setupConfiguration } from "./configuration";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as _ from "lodash";
import { join } from "path";

var app = express();

app.use(bodyParser.json());   // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded
/*
 Init the configuration
 */
setupConfiguration().then(() => {

    /* START : Login Function */
    app.post("/api/login", (req: any, res: any) => {
        console.log(JSON.stringify(req.body));
        res.setHeader("Content-Type", "application/json");
        var resp = authenticateUser(req.body);

        if (!req.body || !req.body.username || !req.body.password) {
            res.status(400).send({ status: 'NOT_OK', 'error': 'bad request' });
        } else {
            if (resp.status === 'OK') {
                res.status(200).send(authenticateUser(req.body));
            } else {
                res.status(404).send(authenticateUser(req.body));
            }
        }
    });
    /* END : Login Function */

    /* START : Healthcheck */
    app.get("/api/phraseapp", (req: any, res: any) => {
        res.setHeader("Content-Type", "application/json");
        res.send({ 'message': 'Reached to server' });
    });
    /* END : Healthcheck */

    /*
     *  START : BLOCK - /api/phraseapp/data.json
     */
    var isFetchPhraseAppDataInProgress = false;
    var cachedPhraseappData = {
        timeStamp: null,
        data: null
    };

    app.get("/api/phraseapp/data.json", (req: any, res: any) => {
        var now = Date.now();

        function fetchDataAndSendResponse() {
            getDataFromPhraseApp().then(function (body: any) {
                isFetchPhraseAppDataInProgress = false;
                res.setHeader("Content-Type", "application/json");
                cachedPhraseappData.timeStamp = now;
                cachedPhraseappData.data = body;
                res.send(cachedPhraseappData.data);
            })
                .catch(function (err: any) {
                    isFetchPhraseAppDataInProgress = false;
                    res.send(err);
                });
        }

        if (isFetchPhraseAppDataInProgress) {
            res.setHeader("Content-Type", "application/json");
            res.send({ 'message': 'Update is in progress, please try again after some time' });
        }

        if (cachedPhraseappData.timeStamp && cachedPhraseappData.data) {
            if (now - cachedPhraseappData.timeStamp > 300000) {     // If request comes after 5 minutes, then fetch new data
                isFetchPhraseAppDataInProgress = true;
                fetchDataAndSendResponse();
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(cachedPhraseappData.data);
            }
        } else {
            fetchDataAndSendResponse();
            isFetchPhraseAppDataInProgress = true;
        }
    });

    /**
     * END : BLOCK - /api/phraseapp/data.json
     */

    /**
     *  Get Translation keys and all data -> experimental
     *  START : BLOCK /api/phraseapp/keys
     */
    var isFetchKeysInProgress = false;
    var cachedPhraseappTranslations = {
        timeStamp: null,
        data: null
    };

    function getCurrentTimeStamp() {
        return Date.now();
    }


    //fetch keys from backend
    function fetchKeyTranslations() {
        var now = getCurrentTimeStamp();
        isFetchKeysInProgress = true;
        return new Promise((resolve, reject) => {
            getKeys().then((body: any) => {
                isFetchKeysInProgress = false;
                console.log('saving cache');
                cachedPhraseappTranslations.timeStamp = now;
                cachedPhraseappTranslations.data = body;
                resolve(body);
            }, (err) => {
                isFetchKeysInProgress = false;
                console.log(err);
                reject(err);
            });
        });
    }

    app.get("/api/phraseapp/keys", (req: any, res: any) => {
        var now = getCurrentTimeStamp();

        // Force Fetch data if needed
        function fetchKeysAndSendResponse() {
            console.log('fetchKeysAndSendResponse');
            fetchKeyTranslations().then(() => {
                console.log('Sending Response after saving cache');
                res.setHeader("Content-Type", "application/json");
                res.send(cachedPhraseappTranslations.data);
            }, (err) => {
                res.status = 500;
                res.send(err);
            });
        }

        if (isFetchKeysInProgress) {
            res.setHeader("Content-Type", "application/json");
            res.send({ 'message': 'Update is in progress, please try again after some time' });
        }

        if (cachedPhraseappTranslations.timeStamp && cachedPhraseappTranslations.data) {
            console.log('Trying Cached keys');
            if (now - cachedPhraseappTranslations.timeStamp > 3600000) {     // If request comes after 5 minutes, then fetch new data
                fetchKeysAndSendResponse();
            } else {
                console.log('Data to be returned : ', cachedPhraseappTranslations.data.length);
                res.setHeader("Content-Type", "application/json");
                res.send(cachedPhraseappTranslations.data);
            }
        } else {
            fetchKeysAndSendResponse();
        }



    });

    //  END: BLOCK /api/phraseapp/keys

    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        // Pass to next layer of middleware
        next();
    });

    app.use(function (req, res, next) {

        if (req.path.indexOf('api') !== -1) {
            var logResp = {
                'Time': Date.now(),
                'request api': req.path,
                'request method': req.method,
                'request body': req.body,
                'request paras': JSON.stringify(req.params)
            };
            console.log(JSON.stringify(logResp));
        }

        next();
    });

    app.use(express.static(__dirname));
    app.use('/', express.static(join(__dirname, '../', 'dist')));

    var port = process.env.PORT || 8080;

    const server = app.listen(port, () => {
        console.log("Server listening on port ", port);
        //Calling Fetch Key Translations -> to preload data
        fetchKeyTranslations();
    });
}, (err) => {
    showError('Unable to start the server, please check the configurations and try again');
    process.exit();
});

function showError(error) {
    console.log('Really sorry for that, something went wrong....');
    console.log(error);
}


