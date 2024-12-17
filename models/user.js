/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
        {
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING(50),
            allowNull: true,
          },
          email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
            },
          },
          password: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          address: {
            type: Sequelize.STRING(40),
            allowNull: false,
          },
          phone_number: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          gender: {
            type: Sequelize.DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: true,
            defaultValue: 'Other',
          },
          nick: {
            type: Sequelize.STRING(20),
            allowNull: true,
            defaultValue: 'noname',
          },
          person_image: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'default_image',
          },
          profile_image: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'default_image',
          },
          payment: {
            type: Sequelize.STRING(20),
            allowNull: true,
          },
          login_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.DataTypes.NOW,
          },
          bank_account: {
            type: Sequelize.STRING(30),
            allowNull: true,
          },
        },
        {
          sequelize,
          timestamps: true,   // create automatically createdAt, updatedAt
          underscored: true,  // set snake_case
          modelName: 'User',
          tableName: 'users',
          paranoid: true,  // true is soft delete.
          charset: 'utf8',
          collate: 'utf8_general_ci',  // utf8_general_ci : option of Korean
          hooks: {
            // Before saving, check if name is null, and set it to email's
            // prefix
            beforeCreate: (user, options) => {
              if (!user.name) {  // name is null or empty
                const emailPrefix = user.email.split(
                    '@')[0];  // The beginning of the '@' in the email
                user.name = emailPrefix;
              }
            },
          }
        })
  };
  static associate(db) {
    db.User.hasMany(db.Clothes, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
      as: 'Clothes',
    });
    db.User.hasMany(db.Market, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
    });
    db.User.hasMany(db.Wishlist, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
    });
  };
}

module.exports = User;