'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {    
    await queryInterface.createTable('wishlists', {
      wishlist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // users 테이블 참조
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      clothes_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clothes', // clothes 테이블 참조
          key: 'clothes_id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wishlists');
  },
}
;