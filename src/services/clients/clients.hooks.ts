import * as authentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';

import relatePermissions from '../../hooks/relate-permissions';
import transformPhone from '../../hooks/transform-phone';

import { generatePassword } from '../../utils/helpers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const permissions = [
  checkPermissions({
    field: 'role',
    roles: ['admin', 'client'],
  }),
  relatePermissions({ type: 'client', relateField: 'id' }),
];

export default {
  before: {
    all: [authenticate('jwt'), transformPhone()],
    find: [],
    get: [],
    create: [],
    update: [...permissions],
    patch: [...permissions],
    remove: [...permissions],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createUser()],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

function createUser() {
  return async (context: HookContext<ServiceModels['clients']>) => {
    const {
      app,
      result,
      params: { $password },
    } = context;
    const record = result && result.dataValues ? result.dataValues : result;

    if (!record) {
      return context;
    }

    const newPassword = generatePassword();

    try {
      const user = await app.service('users').create({
        role: 'client',
        email: record.email,
        phone: record.phone,
        password: $password || newPassword,
      });
      await app.service('clients').patch(record.id, { userId: user.id });
      record.userId = user.id;
    } catch (err) {
      await app.service('clients').remove(record.id);
      throw err;
    }

    return context;
  };
}
