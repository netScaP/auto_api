import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.addColumn('cars', 'plateNumbers', {
      type: DataTypes.STRING,
    });
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.removeColumn('cars', 'plateNumbers');
  },
};
