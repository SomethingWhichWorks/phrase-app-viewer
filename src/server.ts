import { httpRequest, readFile } from "./promisified-io";
import * as express from "express";
import redditService from "services/redditService";


let app = express();

app.get("/r/aww.json", (req, res) => {
    redditService.getRedditFeed("aww")
        .then(body => {
            res.setHeader("Content-Type", "application/json"); 
            res.send(body); 
        })
        .catch(err => console.error(err));
});

app.use("/", express.static(__dirname + "/../../react-reddit"));

const server = app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
