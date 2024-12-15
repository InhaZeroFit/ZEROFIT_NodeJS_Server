/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

const passport = require('passport');
const local = require('./local_strategy');

const db = require('../models');
const User = db.User;

module.exports = () => {
  passport.serializeUser((user, done) => {  // Save to session.
    done(null, user.email);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({
          where: {user_id: id},  // `user_id`로 조회
          attributes:
              ['user_id', 'email', 'nick', 'name'],  // 필요한 데이터만 포함
        })
        .then(user => {
          if (!user) {
            return done(null, false);  // 사용자 없음
          }
          return done(null, user);  // 사용자 데이터 복원
        })
        .catch(error => done(error));
  })
  local();
};