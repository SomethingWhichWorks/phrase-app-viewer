'use strict';
import { LoginResource } from "./login.resource";

export class LoginRouter {
    app: any;
    loginResource = new LoginResource();

    init(app) {
        this.app = app;
        this.addRoutes();
    }

    addRoutes() {
        this.app.route('/api/login')
            .head(this.loginResource.healthcheck)
            .post(this.loginResource.authenticateUser);
    }
}





