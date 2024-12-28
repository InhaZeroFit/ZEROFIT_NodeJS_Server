/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const {join} = require('./auth/join');
const {login} = require('./auth/login');
const {logout} = require('./auth/logout');

const auth = {};
auth.join = join;
auth.login = login;
auth.logout = logout;

module.exports = auth;