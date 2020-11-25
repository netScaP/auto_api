import { BadRequest } from '@feathersjs/errors';
import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';

import { generatePassword, maskPhone } from '../../utils/helpers';

export default {
  before: {
    all: [],
    create: [
      async (context: HookContext<ServiceModels['auth']>) => {
        const { app, data } = context;

        if (!data || !data.phone) {
          throw new BadRequest('Phone is required');
        }

        const phone = maskPhone(data.phone);

        let client = (<ServiceModels['clients'][]>await app.service('clients').find({
          query: {
            phone,
            $limit: 1,
          },
          paginate: false,
        }))[0];

        const password = generatePassword();

        if (client) {
          client = await app
            .service('clients')
            .patch(client.id, { ...data, phone }, { $password: password });
        } else {
          client = await app.service('clients').create(
            {
              ...data,
              phone,
            },
            { $password: password }
          );
        }

        await app.service('users').patch(client.userId, { password });

        await app.service('send-sms').create({
          phone,
          text: `Ваш пароль для входа - ${password}`,
        });

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
