// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const clientFeedbacks = sequelizeClient.define(
    'client_feedbacks',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      assessment: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 10,
        },
        allowNull: false,
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
  (clientFeedbacks as any).associate = (models: any): void => {
    (clientFeedbacks as any).belongsTo(models.clients, {
      as: 'client',
      foreignKey: { name: 'clientId', allowNull: false },
      onDelete: 'CASCADE',
    });
    (clientFeedbacks as any).belongsTo(models.companies, {
      as: 'company',
      foreignKey: { name: 'companyId', allowNull: false },
      onDelete: 'CASCADE',
    });
  };

  return clientFeedbacks;
}
