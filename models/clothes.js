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

class Clothes extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
        {
          clothes_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
          },
          image_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          clothes_name: {
            type: Sequelize.STRING(30),
            allowNull: false,
          },
          rating: {
            type: Sequelize.ENUM('1', '2', '3', '4', '5'),
            allowNull: false,
          },
          clothes_type: {
            type: Sequelize.TEXT,
            allowNull: false,
            get() {
              const rawValue = this.getDataValue('clothes_type');
              return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
              this.setDataValue('clothes_type', JSON.stringify(value));
            },
          },
          clothes_style: {
            type: Sequelize.TEXT,
            allowNull: false,
            get() {
              const rawValue = this.getDataValue('clothes_style');
              return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
              this.setDataValue('clothes_style', JSON.stringify(value));
            },
          },
          memo: {
            type: Sequelize.STRING(100),
            allowNull: true,
          },
          include_point: {
            type: Sequelize.TEXT,
            allowNull: true,
            get() {
              const rawValue = this.getDataValue('include_point');
              return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
              this.setDataValue('include_point', JSON.stringify(value));
            },
          },
          exclude_point: {
            type: Sequelize.TEXT,
            allowNull: true,
            get() {
              const rawValue = this.getDataValue('exclude_point');
              return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
              this.setDataValue('exclude_point', JSON.stringify(value));
            },
          },
          size: {
            type: Sequelize.DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL', 'FREE'),
            allowNull: true,
          },
          color: {
            type: Sequelize.STRING(10),
            allowNull: true,
          },
          date_purchase: {
            type: Sequelize.STRING(10),
            allowNull: true,
          },
          is_sale: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          is_sold: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          sold_to: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          price: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          post_name: {
            type: Sequelize.STRING(50),
            allowNull: true,
          },
          sale_type: {
            type: Sequelize.TEXT,
            allowNull: true,
            get() {
              const rawValue = this.getDataValue('sale_type');
              return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
              this.setDataValue('sale_type', JSON.stringify(value));
            },
          },
        },
        {
          sequelize,
          timestamps: true,
          underscored: true,
          modelName: 'Clothes',
          tableName: 'clothes',
          paranoid: true,
          charset: 'utf8',
          collate: 'utf8_general_ci',
        })
  };
  static associate(db) {
    db.Clothes.belongsTo(db.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
    db.Clothes.hasMany(db.Market, {
      foreignKey: 'clothes_id',
      sourceKey: 'clothes_id',
    });
    db.Clothes.hasMany(db.Wishlist, {
      foreignKey: 'clothes_id',
      sourceKey: 'clothes_id',
    });
  };
}

module.exports = Clothes;