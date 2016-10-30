import * as _ from "lodash";

var allowedUsers = [
    {
        username: 'testuser',
        password: 'testuser'
    },
    {
        username: 'maheshtest',
        password: 'maheshtest'
    }
]


export function authenticateUser(userDetails) {
    var response = {
        username: userDetails.username,
        status: ''
    };

    var matchRecord = _.find(allowedUsers, (user) => {
        return user.username === userDetails.username && user.password === userDetails.password;
    });

    if (matchRecord) {
        response.status = 'OK';
    } else {
        response.status = 'NOT_OK';
    }
    console.log(response);
    return response;
}