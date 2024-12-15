/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const dotenv = require('dotenv');
dotenv.config();

exports.home = async (req, res, next) => {
  try {
    const response = {
      title: 'ZEROFIT - MAIN',
    };
    if (process.env.NODE_ENV == 'development') {
      response['notice'] = 'This is development server';
    }
    res.render('main', response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};