// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const clients = sequelizeClient.define(
    'clients',
    {
      name: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
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
  (clients as any).associate = (models: any): void => {
    (clients as any).belongsTo(models.users, {
      as: 'user',
      foreignKey: { name: 'userId' },
    });

    (clients as any).hasMany(models.cars, {
      as: 'cars',
      foreignKey: { name: 'clientId', allowNull: false },
      onDelete: 'CASCADE',
    });
  };

  return clients;
}
