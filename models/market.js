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

class Market extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
        {
          market_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
          },
          price: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          period_sale: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        },
        {
          sequelize,
          timestamps: true,
          underscored: true,
          modelName: 'Market',
          tableName: 'market',
          paranoid: true,
          charset: 'utf8',
          collate: 'utf8_general_ci',
        })
  };
  static associate(db) {
    db.Market.belongsTo(db.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
    db.Market.belongsTo(db.Clothes, {
      foreignKey: 'clothes_id',
      targetKey: 'clothes_id',
      as: 'Clothes',
    });
  };
}

module.exports = Market;