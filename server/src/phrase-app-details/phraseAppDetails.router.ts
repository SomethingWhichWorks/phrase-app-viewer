'use strict';
import { PhraseAppDetailsResource } from "./phraseAppDetails.resource";

export class PhraseAppDetailsRouter {
    app: any;
    phraseAppDetailsResource = new PhraseAppDetailsResource();

    public init(app) {
        this.app = app;
        this.addRoutes();
    }

    public addRoutes() {
        this.app.route('/api/phraseapp/keys')
            .head(this.phraseAppDetailsResource.healthcheck)
            .get(this.phraseAppDetailsResource.getTranslations);

        // Label data             
        this.app.route('/api/phraseapp/label/:id')
            .get(this.phraseAppDetailsResource.getLabelDetails);

    }
}





