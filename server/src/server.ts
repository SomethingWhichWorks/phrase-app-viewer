import { getDataFromPhraseApp } from "./phraseAppService";
import { getKeys } from "./phraseAppDetailsService";
import { authenticateUser } from "./login.service";

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
setupConfiguration();


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
app.get("/api/phraseapp", (req: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send({ 'message': 'Reached to server' });
});


/*
 *  START : BLOCK - /api/phraseapp/data.json
 */

var cachedPhraseappData = {
    timeStamp: null,
    data: null
};

app.get("/api/phraseapp/data.json", (req: any, res: any) => {
    var now = Date.now();

    function fetchDataAndSendResponse() {
        getDataFromPhraseApp().then(function (body: any) {
            res.setHeader("Content-Type", "application/json");
            cachedPhraseappData.timeStamp = now;
            cachedPhraseappData.data = body;
            res.send(body);
        })
            .catch(function (err: any) {
                res.send(err);
            });
    }


    if (cachedPhraseappData.timeStamp && cachedPhraseappData.data) {
        if (now - cachedPhraseappData.timeStamp > 300000) {     // If request comes after 5 minutes, then fetch new data
            fetchDataAndSendResponse();
        } else {
            res.setHeader("Content-Type", "application/json");
            res.send(cachedPhraseappData.data);
        }
    } else {
        fetchDataAndSendResponse();
    }
});

/*
   END : BLOCK - /api/phraseapp/data.json
 */

/**
 *  Get Translation keys and all data -> experimental
 *  START : BLOCK /api/phraseapp/keys
 */
var isFetchInProgress = false;
var cachedPhraseappTranslations = {
    timeStamp: null,
    data: null
};

function getCurrentTimeStamp() {
    return Date.now();
}

function fetchKeyTranslations() {
    var now = getCurrentTimeStamp();

    isFetchInProgress = true;
    return new Promise((resolve, reject) => {
        getKeys().then((body: any) => {
            isFetchInProgress = false;
            cachedPhraseappTranslations.timeStamp = now;
            cachedPhraseappTranslations.data = body;
            resolve(body);
        }, (err) => {
            isFetchInProgress = false;
            console.log(err);
            reject(err);
        });
    });
}

app.get("/api/phraseapp/keys", (req: any, res: any) => {
    var now = getCurrentTimeStamp();

    if (isFetchInProgress) {
        res.setHeader("Content-Type", "application/json");
        res.send({ 'message': 'Update is in progress, please try again after some time' });
    }

    if (cachedPhraseappData.timeStamp && cachedPhraseappData.data) {
        if (now - cachedPhraseappData.timeStamp > 3600000) {     // If request comes after 5 minutes, then fetch new data
            fetchKeysAndSendResponse();
        } else {
            console.log('Data to be returned : ', cachedPhraseappData.data.length);
            res.setHeader("Content-Type", "application/json");
            res.send(cachedPhraseappTranslations.data);
        }
    } else {
        fetchKeysAndSendResponse();
    }

    // Force Fetch data if needed
    function fetchKeysAndSendResponse() {
        fetchKeyTranslations().then(() => {
            res.setHeader("Content-Type", "application/json");
            res.send(cachedPhraseappTranslations.data);
        }, (err) => {
            res.status = 500;
            res.send(err);
        });
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
    //fetchKeyTranslations();
});