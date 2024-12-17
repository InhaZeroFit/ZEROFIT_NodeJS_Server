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
const local = require('./local_strategy');

const db = require('../models');
const User = db.User;

module.exports = () => {
  passport.serializeUser((user, done) => {  // Save to session.
    done(null, user.email);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({
          where: {user_id: id},  // Look up with 'user_id'
          attributes: [
            'user_id', 'email', 'nick', 'name'
          ],  // Include only the data you need
        })
        .then(user => {
          if (!user) {
            return done(null, false);  // No User
          }
          return done(null, user);  // Restore User Data
        })
        .catch(error => done(error));
  })
  local();
};