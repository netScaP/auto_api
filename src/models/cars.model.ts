// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const cars = sequelizeClient.define(
    'cars',
    {
      title: {
        type: DataTypes.STRING,
      },

      id_car_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_car_mark: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_car_model: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_car_generation: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_car_serie: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_car_modification: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_car_equipment: {
        type: DataTypes.INTEGER,
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
  (cars as any).associate = (models: any): void => {
    (cars as any).belongsTo(models.clients, {
      as: 'client',
      foreignKey: { name: 'clientId', allowNull: false },
      onDelete: 'CASCADE',
    });
  };

  return cars;
}
