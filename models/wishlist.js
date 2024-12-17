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

class Wishlist extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
        {
          wishlist_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
        },
        {
          sequelize,
          modelName: 'Wishlist',
          tableName: 'wishlists',
          timestamps: true,
          paranoid: true,
          underscored: true,
          charset: 'utf8',
          collate: 'utf8_general_ci',
        });
  }

  static associate(db) {
    db.Wishlist.belongsTo(db.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
    db.Wishlist.belongsTo(db.Clothes, {
      foreignKey: 'clothes_id',
      targetKey: 'clothes_id',
      as: 'Clothes',
    });
  }
}

module.exports = Wishlist;