/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-28
 */

const {add} = require('./wishlist/wishlist_add');
const {info} = require('./wishlist/wishlist_info');

const wishlist = {};
wishlist.add = add;
wishlist.info = info;

module.exports = wishlist;