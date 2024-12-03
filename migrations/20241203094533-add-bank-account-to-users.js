'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // `bank_account` 컬럼 추가
    await queryInterface.addColumn('users', 'bank_account', {
      type: Sequelize.STRING(30),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // `bank_account` 컬럼 제거
    await queryInterface.removeColumn('users', 'bank_account');
  },
};