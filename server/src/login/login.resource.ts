'use strict';
import { LoginService } from "./login.service";

export class LoginResource {
    loginService = new LoginService();

    healthcheck(req, res) {
        console.log('Advertisement API Healthcheck Successful');
        return res.status(200).json({ message: 'Login API Healthcheck Successful' });
    }

    authenticateUser(req, res) {
        console.log(JSON.stringify(req.body));
        res.setHeader("Content-Type", "application/json");
        var resp = this.loginService.authenticateUser(req.body);

        if (!req.body || !req.body.username || !req.body.password) {
            res.status(400).send({ status: 'NOT_OK', 'error': 'bad request' });
        } else {
            if (resp.status === 'OK') {
                res.status(200).send(this.loginService.authenticateUser(req.body));
            } else {
                res.status(404).send(this.loginService.authenticateUser(req.body));
            }
        }
    }

}