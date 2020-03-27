var jwt = require('jsonwebtoken');
const utils = require('../common/utils');


exports.generateAuthToken = function (payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: parseInt(process.env.SECRET_KEY_VALID_TIME) }, function (err, token) {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    })
}

exports.verifyAuthToken = function (request, response, next) {
    let token = request.headers['authorization'];
    jwt.verify(token, process.env.SECRET_KEY, function (err, data) {
        if (err && err.name === 'TokenExpiredError')
            return response.status(401).send({ error: true, code: 'TokenExpiredError', message: 'The token has been expired.' })

        if (err && err.name != 'TokenExpiredError')
            return response.status(401).send({ error: true, message: 'Unauthorized Access.' })
        request.headers.payload = data;
        next();
    })
}

exports.decodeForgotPasswordToken = function (response, token) {
    return jwt.verify(token, process.env.SECRET_KEY, function (err, data) {
        if (err && err.name === 'TokenExpiredError')
            return utils.sendResponse(response, true, 401, 4036);
        if (err && err.name != 'TokenExpiredError')
            return utils.sendResponse(response, false, 401, 4037);
        return data;
    })
}
