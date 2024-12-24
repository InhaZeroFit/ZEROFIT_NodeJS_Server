/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
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
            defaultValue: 'no_nick'
          },
          person_image: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'no_person_image',
          },
          profile_image: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: 'no_profile_image',
          },
          payment: {
            type: Sequelize.STRING(20),
            allowNull: true,
            defaultValue: 'no_payment',
          },
          bank_account: {
            type: Sequelize.STRING(30),
            allowNull: true,
            defaultValue: 'no_bank_account'
          },
          login_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.DataTypes.NOW,
          },
        },
        {
          sequelize,
          timestamps: true,   // Create automatically createdAt, updatedAt
          underscored: true,  // Set snake_case
          modelName: 'User',
          tableName: 'users',
          paranoid: true,  // Set soft delete
          charset: 'utf8',
          collate: 'utf8_general_ci',  // utf8_general_ci : option of Korean
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