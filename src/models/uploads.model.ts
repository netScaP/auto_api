// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const uploads = sequelizeClient.define(
    'uploads',
    {
      path: {
        type: DataTypes.STRING,
      },
      originalname: {
        type: DataTypes.STRING,
      },
      filename: {
        type: DataTypes.STRING,
      },
      mimetype: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeCount(options: any) {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  (uploads as any).associate = (models: any) => {
    (uploads as any).belongsTo(models.cars, {
      as: 'car',
      foreignKey: { name: 'carId' },
    });
  };

  return uploads;
}
