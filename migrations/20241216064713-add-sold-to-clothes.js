'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clothes', 'sold_to', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users', // 참조할 테이블 이름
        key: 'user_id', // 참조할 컬럼
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clothes', 'sold_to');
  },
};