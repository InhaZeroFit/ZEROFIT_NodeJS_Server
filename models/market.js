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
            defaultValue: 0,  // Check this line
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
      as: 'Clothes', // 별칭 설정
    });
  };
}

module.exports = Market;