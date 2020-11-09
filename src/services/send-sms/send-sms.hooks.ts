// import axios from 'axios';
import {
  BadRequest,
  // BadGateway
} from '@feathersjs/errors';
import { disallow } from 'feathers-hooks-common';

import { HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../../declarations';
// import logger from '../../logger';

export default {
  before: {
    all: [disallow('external')],
    create: [
      async (
        context: HookContext<ServiceModels['send-sms']>
      ): Promise<HookContext<ServiceModels['send-sms']>> => {
        const {
          // app,
          data,
        } = context;
        // const { url, login, password, originator } = <
        //   { url: string; login: string; password: string; originator: string }
        // >app.get('sms');

        if (!data || !data.phone || !data.text) {
          throw new BadRequest('Phone and text are required');
        }

        // try {
        //   const response = await axios({
        //     url: `${url}/send_sms`,
        //     method: 'GET',
        //     params: {
        //       login,
        //       password,
        //       originator,
        //       phone: data.phone,
        //       text: data.text,
        //     },
        //   });
        //   if (response.data.includes('ERROR')) {
        //     throw new Error(response.data);
        //   }
        // } catch (err) {
        //   logger.log('error', 'Error on sending sms: ', err);
        //   if (err && err.response && err.response.status === 403) {
        //     throw new BadGateway('Can not send sms due to server error');
        //   }

        //   throw new BadRequest('Can not send sms to the phone');
        // }

        return context;
      },
    ],
  },

  after: {
    all: [],
    create: [],
  },

  error: {
    all: [],
    create: [],
  },
};
