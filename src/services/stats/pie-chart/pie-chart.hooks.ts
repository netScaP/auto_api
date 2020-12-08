import * as authentication from '@feathersjs/authentication';
import moment from 'moment';

import { HookContext } from '../../../app';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    // all: [authenticate('jwt')],
    find: [
      async (context: HookContext) => {
        const {
          app,
          params: { user, query },
        } = context;

        const sequelizeClient = app.get('sequelizeClient');
        const { models } = sequelizeClient;
        const { Model: OrderModel } = app.service('orders');

        const modelQuery: { [key: string]: any } = {
          createdAt: {
            $gte: moment().subtract(24, 'hour').format(),
            $lte: moment().format(),
          },
        };

        if (query && query.createdAt) {
          modelQuery.createdAt = query.createdAt;
        }

        if (user && user.role === 'company') {
          modelQuery.companyId = user.companyId;
        } else if (query && query.companyId) {
          modelQuery.companyId = query.companyId;
        }

        interface IPieData {
          name: string;
          val: string;
          dataValues?: IPieData;
        }
        const orderTypes = <IPieData[]>await OrderModel.findAll({
          where: modelQuery,
          group: [sequelizeClient.col('type')],
          attributes: [
            [sequelizeClient.col('type'), 'name'],
            [sequelizeClient.fn('count', sequelizeClient.col('id')), 'val'],
          ],
        });
        const orderStatuses = <IPieData[]>await OrderModel.findAll({
          where: modelQuery,
          group: [sequelizeClient.col('status')],
          attributes: [
            [sequelizeClient.col('status'), 'name'],
            [sequelizeClient.fn('count', sequelizeClient.col('id')), 'val'],
          ],
        });
        const orderCompanies = <IPieData[]>await OrderModel.findAll({
          where: { ...modelQuery, status: 'done' },
          group: [sequelizeClient.col('"company"."name"')],
          include: [
            {
              model: models.companies,
              as: 'company',
              attributes: [],
            },
          ],
          attributes: [
            [sequelizeClient.col('"company"."name"'), 'name'],
            [sequelizeClient.fn('count', sequelizeClient.col('"orders"."id"')), 'val'],
          ],
        });

        context.result = {
          orderTypes,
          orderStatuses,
          orderCompanies,
        };

        return context;
      },
    ],
  },

  after: {
    all: [],
    find: [],
  },

  error: {
    all: [],
    find: [],
  },
};
