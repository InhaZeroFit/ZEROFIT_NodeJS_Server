/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-27
 */

const {register_clothes} = require('./market/market_register_clothes');
const {info} = require('./market/market_info');
const {purchase_clothes} = require('./market/market_purchase_clothes');

const market = {};
market.register_clothes = register_clothes;
market.info = info;
market.purchase_clothes = purchase_clothes;

module.exports = market;