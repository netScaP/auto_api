import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.addColumn('clients', 'status', {
      type: DataTypes.STRING,
      validate: {
        isIn: [['active', 'unactive', 'banned']],
      },
      defaultValue: 'active',
    });
    await queryInterface.addColumn('companies', 'status', {
      type: DataTypes.STRING,
      validate: {
        isIn: [['active', 'unactive', 'banned']],
      },
      defaultValue: 'active',
    });
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.removeColumn('clients', 'status');
    await queryInterface.removeColumn('companies', 'status');
  },
};
