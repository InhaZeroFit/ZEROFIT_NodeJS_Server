/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const {preprocess} = require('./flask/preprocess');
const {virtual_fitting} = require('./flask/virtual_fitting');

const flask = {};
flask.preprocess = preprocess;
flask.virtual_fitting = virtual_fitting;

module.exports = flask;