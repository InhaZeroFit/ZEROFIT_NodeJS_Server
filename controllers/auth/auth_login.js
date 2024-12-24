/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

// 1. Import modules
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// 2. Set environmental variables
dotenv.config();

exports.login = async (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return res.status(500).json(
          {message: '내부 서버 오류', error: error.message});
    }

    if (!user) {
      return res.status(401).json({message: info.message});
    }

    return req.login(user, (error) => {
      if (error) {
        return res.status(501).json(
            {message: '로그인 실패', error: error.message});
      }

      // Make JWT Token
      const token = jwt.sign(
          {'user_id': user.user_id}, process.env.JWT_SECRET,
          {expiresIn: process.env.JWT_EXPIRES_IN});

      // JSON Response on Successful Login
      return res.status(200).json({
        'token': token,
        message: '로그인 성공!',
      });
    });
  })(req, res, next);
};