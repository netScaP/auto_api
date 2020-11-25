// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const companies = sequelizeClient.define(
    'companies',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.TEXT,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      timeWork: {
        type: DataTypes.ARRAY(DataTypes.JSON),
      },
      status: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['active', 'unactive', 'banned']],
        },
        defaultValue: 'active',
      },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (companies as any).associate = (models: any): void => {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return companies;
}
