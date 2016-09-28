'use strict';

(function (redditService) {
   
    redditService.getRedditFeed(subreddit: string) {
   
	    let configFile = await readFile("config.json");
	    let targetUrl = JSON.parse(configFile).targetUrl;
	    let result = await httpRequest(`${targetUrl}/r/${subreddit}.json`);
	    return result;
	}


})(module.exports);



