/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const {sale} = require('./market/market_sale');
const {info} = require('./market/market_info');
const {purchase} = require('./market/market_purchase');

const market = {};
market.sale = sale;
market.info = info;
market.purchase = purchase;

module.exports = market;