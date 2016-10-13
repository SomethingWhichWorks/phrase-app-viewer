import { getDataFromPhraseApp } from "./phraseAppService";
import { setupConfiguration } from "./configuration";
import * as express from "express";
import * as _ from "lodash";

let app = express();

/*
 Init the configuration
 */
setupConfiguration();

app.get("/phraseapp", (req:any, res:any) => {
    res.setHeader("Content-Type", "application/json");
    res.send({'message': 'Reached to server'});
});

app.get("/phraseapp/data.json", (req:any, res:any) => {
    getDataFromPhraseApp().then(function (body:any) {
        res.setHeader("Content-Type", "application/json");
        res.send(body);
    })
    .catch(function (err:any) {
        res.send(err);
    });
});

app.use("/", express.static(__dirname + "/../static"));

const server = app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
