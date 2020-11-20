import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.addColumn('orders', 'carId', {
      type: DataTypes.INTEGER,
      references: {
        model: 'cars',
        key: 'id',
      },
    });
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.removeColumn('orders', 'carId');
  },
};
