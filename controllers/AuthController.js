const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");


//helper file to prepare responses.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



exports.register = (request, response) => {
    console.log(request, "register triggered");
    response.send("API Working")
};

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

exports.login = () => {

};

/**
 * Verify Confirm otp.
 *
 * @param {string}      email
 * @param {string}      otp
 *
 * @returns {Object}
 */

exports.verifyConfirm = () => {

};

/**
 * Resend Confirm otp.
 *
 * @param {string}   email
 *
 * @returns {Object}
 */

exports.resendConfirmOtp = () => {

};