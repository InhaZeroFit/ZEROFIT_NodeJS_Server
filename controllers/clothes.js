/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

// 1. Import custom modules
const {upload} = require('./clothes/upload');
const {virtual_fitting} = require('./clothes/virtual_fitting');
const {info} = require('./clothes/info');

const clothes = {};
clothes.upload = upload;
clothes.virtual_fitting = virtual_fitting;
clothes.info = info;

module.exports = clothes;