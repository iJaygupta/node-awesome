const responseFile = require('../lib/response');

exports.sendResponse = function (response, error, statusCode, responseCode, data) {
	let output = {
		error: error,
		statusCode: error ? "Failed" : "OK",
		code: responseFile[responseCode]['code'],
		message: responseFile[responseCode]['message'],
	}
	if (data) {
		output.data = data;
	}
	response.status(statusCode).send(output);
}
