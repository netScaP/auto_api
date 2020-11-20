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

          query = { ...car };
        }

        const result = (
          await axios({
            method: 'GET',
            url: `${carApi.url}/car-info`,
            params: query,
          })
        ).data;

        context.result = result;

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
