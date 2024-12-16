/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-16
 */

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