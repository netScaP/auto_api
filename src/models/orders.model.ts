// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const orders = sequelizeClient.define(
    'orders',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      vin: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['detailing', 'repair', 'spare']],
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['unhandled', 'closed', 'active', 'work', 'done']],
        },
        defaultValue: 'unhandled',
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
  (orders as any).associate = (models: any): void => {
    (orders as any).belongsTo(models.clients, {
      as: 'client',
      foreignKey: { name: 'clientId', allowNull: false },
      onDelete: 'CASCADE',
    });

    (orders as any).belongsTo(models.companies, {
      as: 'company',
      foreignKey: { name: 'companyId' },
    });
    (orders as any).belongsTo(models.order_response, {
      as: 'orderResponse',
      foreignKey: { name: 'orderResponseId' },
    });

    // (orders as any).hasMany(models.order_response, {
    //   as: 'orderResponses',
    //   foreignKey: { name: 'orderId', allowNull: false },
    //   onDelete: 'CASCADE',
    // });
    (orders as any).hasMany(models.order_feedbacks, {
      as: 'orderFeedbacks',
      foreignKey: { name: 'orderId', allowNull: false },
      onDelete: 'CASCADE',
    });

    (orders as any).belongsTo(models.cars, {
      as: 'car',
      foreignKey: { name: 'carId' },
    });
  };

  return orders;
}
