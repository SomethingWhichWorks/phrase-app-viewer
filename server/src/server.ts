import { getDataFromPhraseApp } from "./phraseAppService";
import { setupConfiguration } from "./configuration";
import * as express from "express";
import * as _ from "lodash";
import { join } from "path";

var app = express();

/*
 Init the configuration
 */
setupConfiguration();

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
app.use('/', express.static(join(__dirname, '../','dist')));

let port = process.env.PORT || 8080;

const server = app.listen(port, () => {
    console.log("Server listening on port ", port);
});
