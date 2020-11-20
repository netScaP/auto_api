import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import checkPermissions from 'feathers-permissions';

import relatePermissions from '../../hooks/relate-permissions';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [authenticate('jwt'), relatePermissions({ type: 'company', relateField: 'companyId' })],
    find: [],
    get: [],
    create: [
      checkPermissions({ field: 'role', roles: ['admin', 'company'] }),
      hashPassword('password'),
    ],
    update: [
      checkPermissions({ field: 'role', roles: ['admin', 'company'] }),
      hashPassword('password'),
    ],
    patch: [
      checkPermissions({ field: 'role', roles: ['admin', 'company'] }),
      hashPassword('password'),
    ],
    remove: [checkPermissions({ field: 'role', roles: ['admin', 'company'] })],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
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
