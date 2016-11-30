'use strict';
import { PhraseAppBasicResource } from "./phraseAppBasic.resource";

export class PhraseAppBasicRouter {
    app: any;
    phraseAppBasicResource = new PhraseAppBasicResource();

    init(app) {
        this.app = app;
        this.addRoutes();
    }

    addRoutes() {
        this.app.route('/api/phraseapp')
            .head(this.phraseAppBasicResource.healthcheck)
            .get(this.phraseAppBasicResource.getTranslations);
    }
}





