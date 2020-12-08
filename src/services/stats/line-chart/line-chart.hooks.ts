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
        const { Model: OrderModel } = app.service('orders');
        const { Model: ClientModel } = app.service('clients');
        const { Model: OrderResponseModel } = app.service('order-response');

        const modelQuery: { [key: string]: any } = {
          createdAt: {
            $gte: moment().subtract(24, 'hour').startOf('day').format(),
            $lte: moment().subtract(24, 'hour').endOf('day').format(),
          },
        };

        if (query && query.createdAt) {
          modelQuery.createdAt = query.createdAt;
        }

        let dateRange: 'hour' | 'day' | 'month' | 'year' = 'day';
        if (
          moment(modelQuery.createdAt.$lte).diff(moment(modelQuery.createdAt.$gte), 'hours') <= 25
        ) {
          dateRange = 'hour';
        } else if (
          moment(modelQuery.createdAt.$lte).diff(moment(modelQuery.createdAt.$gte), 'days') <= 55
        ) {
          dateRange = 'day';
        } else if (
          moment(modelQuery.createdAt.$lte).diff(moment(modelQuery.createdAt.$gte), 'months') <= 18
        ) {
          dateRange = 'month';
        } else {
          dateRange = 'year';
        }

        interface IRecord {
          date: string;
          val: number;
          dataValues?: IRecord;
        }

        const dateFormats = {
          hour: 'DD - HH:mm',
          day: 'DD.MM',
          month: 'MM.YY',
          year: 'YYYY',
        };

        const responses = [];
        const lineData: { [key: string]: { [key: string]: number } } = {};
        const endDate = moment(modelQuery.createdAt.$lte);
        for (
          let i = moment(modelQuery.createdAt.$gte);
          i <= endDate;
          i = i.clone().add(1, dateRange)
        ) {
          lineData[i.clone().format()] = {
            detailing: 0,
            repair: 0,
            spare: 0,
            sum: 0,
            newClients: 0,
            newOrders: 0,
            responses: 0,
          };
        }

        async function getStats(
          model: any,
          field: string,
          additionalQuery?: { [key: string]: any }
        ) {
          const typeResponse = <IRecord[]>await model.findAll({
            // logging: console.log,
            where: { ...modelQuery, ...(additionalQuery || {}) },
            group: [sequelizeClient.fn('date_trunc', dateRange, sequelizeClient.col('createdAt'))],
            attributes: [
              [
                sequelizeClient.fn('date_trunc', dateRange, sequelizeClient.col('createdAt')),
                'date',
              ],
              [sequelizeClient.fn('count', sequelizeClient.col('id')), 'val'],
            ],
          });
          responses.push(typeResponse);
          typeResponse
            .map(e => e.dataValues || e)
            .sort((x, y) => moment(x.date).unix() - moment(y.date).unix())
            .map(e => {
              const record = e && e.dataValues ? e.dataValues : e;
              const date = moment(record.date).format(); //dateFormats[dateRange]);
              lineData[date] = lineData[date] || {};
              lineData[date][field] = record.val;
            });
        }
        const companyQuery: { companyId?: any } = {};
        if (user && user.role === 'company') {
          companyQuery.companyId = user.companyId;
        } else if (query && query.companyId) {
          companyQuery.companyId = query.companyId;
        }
        for (const type of ['detailing', 'repair', 'spare']) {
          const doneQuery: { [key: string]: any } = { type, status: 'done' };
          await getStats(OrderModel, type, { ...doneQuery, ...companyQuery });
        }
        await getStats(OrderResponseModel, 'responses', companyQuery);
        await getStats(OrderModel, 'newOrders', companyQuery);
        await getStats(ClientModel, 'newClients');

        context.result = {};
        context.result = {
          line: Object.keys(lineData)
            .map(date => ({ date, ...lineData[date] }))
            .sort((x, y) => moment(x.date).unix() - moment(y.date).unix())
            .map(e => ({ ...e, date: moment(e.date).format(dateFormats[dateRange]) })),
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
