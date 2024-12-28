/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const db = require('../models');
const User = db.User;

module.exports = () => {
  passport.use(new LocalStrategy(
      {
        usernameField: 'email',  // Name of the field to be sent from the client
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          // Email User Inquiry
          const user = await User.findOne({where: {email}});

          // Check the presence of a user
          if (!user) {
            return done(null, false, {
              message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            });
          }

          // Check the password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, {
              message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            });
          }

          // Authentication successful
          return done(null, user);
        } catch (error) {
          return done(error);  // When a server error occurs
        }
      }));
};