import { getDataFromPhraseApp } from "./phraseAppService";
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

app.get("/api/phraseapp/data.json", (req: any, res: any) => {
    getDataFromPhraseApp().then(function (body: any) {
        res.setHeader("Content-Type", "application/json");
        res.send(body);
    })
        .catch(function (err: any) {
            res.send(err);
        });
});

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
});
