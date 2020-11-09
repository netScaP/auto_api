// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const orderResponse = sequelizeClient.define(
    'order_response',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      priceFrom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      priceTo: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATE,
      },

      status: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['active', 'spam']],
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
  (orderResponse as any).associate = (models: any): void => {
    (orderResponse as any).belongsTo(models.companies, {
      as: 'company',
      foreignKey: { name: 'companyId', allowNull: false },
      onDelete: 'CASCADE',
    });
    (orderResponse as any).belongsTo(models.orders, {
      as: 'order',
      foreignKey: { name: 'orderId', allowNull: false },
      onDelete: 'CASCADE',
    });
  };

  return orderResponse;
}
