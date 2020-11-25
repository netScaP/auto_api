import * as authentication from '@feathersjs/authentication';
import moment from 'moment';
import { HookContext } from '../../../app';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      async (context: HookContext) => {
        const {
          app,
          params: { user, query },
        } = context;

        const sequelizeClient = app.get('sequelizeClient');
        const { Model } = app.service('orders');

        const modelQuery: { [key: string]: any } = {
          createdAt: {
            $gte: moment().subtract(24, 'hour').format(),
            $lte: moment().format(),
          },
          status: 'done',
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

        if (user && user.role === 'company') {
          modelQuery.companyId = user.companyId;
        } else if (query && query.companyId) {
          modelQuery.companyId = query.companyId;
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
        for (const type in ['detailing', 'repair', 'spare']) {
          const typeResponse = <IRecord[]>await Model.findAll({
            logging: console.log,
            where: { ...modelQuery, type },
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
              const date = moment(record.date).format(dateFormats[dateRange]);
              lineData[date] = lineData[date] || {};
              lineData[date][type] = record.val;
            });
        }

        Object.keys(lineData).forEach(
          key =>
            (lineData[key].sum = Object.values(lineData[key]).reduce(
              (sum: number, e: number) => (sum += +e),
              0
            ))
        );

        context.result = {};
        context.result = {
          line: Object.keys(lineData)
            .map(date => ({ date, ...lineData[date] }))
            .sort((x, y) => moment(x.date).unix() - moment(y.date).unix()),
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
