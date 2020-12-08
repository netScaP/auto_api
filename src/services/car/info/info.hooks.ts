import { Paginated } from '@feathersjs/feathers';
import axios from 'axios';

import { HookContext } from '../../../app';
import { Config, ServiceModels } from '../../../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [],
    find: [
      async (context: HookContext<ServiceModels['car/info']>) => {
        const { app } = context;
        const carApi = <Config['carApi']>app.get('carApi');

        let query = context.params.query || {};

        if (query.carId) {
          const car = <ServiceModels['cars']>await app.service('cars').get(query.carId);

          query = Object.keys(car).reduce((q: { [key: string]: any }, key: string) => {
            if (
              [
                'id_car_type',
                'id_car_mark',
                'id_car_model',
                'id_car_generation',
                'id_car_serie',
                'id_car_modification',
                'id_car_equipment',
              ].includes(key)
            ) {
              // @ts-ignore
              q[key] = car[key];
            }

            return q;
          }, {});
        }

        const result = (
          await axios({
            method: 'GET',
            url: `${carApi.url}/car-info`,
            params: query,
          })
        ).data;

        const ordersCount = (<Paginated<ServiceModels['orders']>>await app.service('orders').find({
          query: {
            car: query,
            $limit: 0,
          },
        })).total;

        context.result = { ...result, ordersCount };

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
