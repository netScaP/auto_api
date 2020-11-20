import { BadRequest } from '@feathersjs/errors';
import axios from 'axios';

import { HookContext } from '../../../app';
import { Config, ServiceModels } from '../../../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [],
    find: [
      async (context: HookContext<ServiceModels['car/search']>) => {
        const {
          app,
          params: { query },
        } = context;
        const carApi = <Config['carApi']>app.get('carApi');

        if (!query || !query.service) {
          throw new BadRequest('Service is required in query');
        }

        const service = query.service;
        delete query.service;

        const result = (
          await axios({
            method: 'GET',
            url: `${carApi.url}/${service}`,
            params: query,
          })
        ).data;

        context.result = result;

        return context;
      },
    ],
    get: [
      async (context: HookContext<ServiceModels['car/search']>) => {
        const {
          app,
          params: { query },
          id,
        } = context;
        const carApi = <Config['carApi']>app.get('carApi');

        if (!query || !query.service) {
          throw new BadRequest('Service is required in query');
        }

        const service = query.service;
        delete query.service;

        const result = (
          await axios({
            method: 'GET',
            url: `${carApi.url}/${service}/${id}`,
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
