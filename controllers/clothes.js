/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-25
 */

// 1. Import custom modules
const {upload_image} = require('./clothes/clothes_upload_image');
const {virtual_fitting} = require('./clothes/clothes_virtual_fitting');
const {images_info} = require('./clothes/clothes_images_info');

const clothes = {};
clothes.upload_image = upload_image;
clothes.virtual_fitting = virtual_fitting;
clothes.images_info = images_info;

module.exports = clothes;