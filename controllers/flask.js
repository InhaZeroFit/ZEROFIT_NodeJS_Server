/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

const {send_preprocess_image_request} =
    require('./flask/flask_send_preprocess_image_request');
const {send_virtual_fitting} = require('./flask/flask_send_virtual_fitting');

const flask = {};
flask.send_preprocess_image_request = send_preprocess_image_request;
flask.send_virtual_fitting = send_virtual_fitting;

module.exports = flask;