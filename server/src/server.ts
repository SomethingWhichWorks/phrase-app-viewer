import * as express from "express";
import * as bodyParser from "body-parser";
import * as _ from "lodash";
import http = require("http");
import https = require("https");
import fs = require('fs');

import { join } from "path";

import { Configuration } from "./support/configuration";
import { LoginRouter } from './login/login.router';
import { PhraseAppBasicRouter } from './phrase-app-basic/phraseAppBasic.router';

var app = express();
var router = express.Router();

app.use(bodyParser.json());   // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded

try {
    //Init Configuration and regiuster all routers 
    Configuration.setupConfiguration()
        .then(() => {
            console.log('Configs loded now');
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

            /**
             * This thing will remain here, I am sure 
             */

            app.use(express.static(__dirname));
            app.use('/', express.static(join(__dirname, '../', 'dist')));

            var port = process.env.PORT || 8080;

            // middleware that is specific to this router
            router.use(function (req, res, next) {
                var logResp = {
                    'Time': Date.now(),
                    'request api': req.path,
                    'request method': req.method,
                    'request body': req.body,
                    'request paras': JSON.stringify(req.params)
                };
                console.log(JSON.stringify(logResp));
                next();
            });
            
            var loginRouter = new LoginRouter();
            var phraseAppBasicRouter = new PhraseAppBasicRouter();
            loginRouter.init(app);
            phraseAppBasicRouter.init(app);
            

            // Added routers            
            app.get('/', router);

            //Need the https enabled in server
            /*var privateKey  = fs.readFileSync('/opt/keys/phrase-app-server-key.pem', 'utf8');
            var certificate = fs.readFileSync('/opt/keys/phrase-app-server-cert.pem', 'utf8');

            var credentials = {key: privateKey, cert: certificate};*/
            
            //starting and listening http server
            app.listen(Configuration.httpPort, () => {
                console.log("Server is listening on http port ", Configuration.httpPort);
            });

            //starting and listening https server
            /*var httpsServer = https.createServer(credentials, app);
            httpsServer.listen(Configuration.httpsPort, () => {
                console.log("Server is also listening on https port ", Configuration.httpsPort);
            });*/
        }, (err) => {
            showError('Unable to start the server, please check the configurations and try again');
            process.exit();
        });
} catch (err) {
    console.log('Error thown: ', err);
}

function showError(error) {
    console.log('Really sorry for that, something went wrong....');
    console.log(error);
}


