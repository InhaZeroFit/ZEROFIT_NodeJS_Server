'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 'size' 컬럼 수정
    await queryInterface.changeColumn('clothes', 'size', {
      type: Sequelize.DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL', 'FREE'),
      allowNull: true,
    });

    await queryInterface.addColumn('clothes', 'is_sale', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('clothes', 'price', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('clothes', 'post_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('clothes', 'sale_type', {
      type: Sequelize.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sale_type');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('sale_type', JSON.stringify(value));
      },
    });
    await queryInterface.sequelize.query(`
      UPDATE clothes
      SET size = CASE
        WHEN size = '90' THEN 'S'
        WHEN size = '95' THEN 'M'
        WHEN size = '100' THEN 'L'
        WHEN size = '105' THEN 'XL'
        WHEN size = '110' THEN 'XXL'
        ELSE 'FREE'
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // 'size' 컬럼을 이전 상태로 복원 (원래 값으로 변경)
    await queryInterface.changeColumn('clothes', 'size', {
      type: Sequelize.DataTypes.ENUM('90', '95', '100', '105', '110', 'Other'),
      allowNull: true,
    });
    await queryInterface.removeColumn('clothes', 'is_sale');
    await queryInterface.removeColumn('clothes', 'price');
    await queryInterface.removeColumn('clothes', 'post_name');
    await queryInterface.removeColumn('clothes', 'sale_type');
  },
};