import * as authentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';

import relatePermissions from '../../hooks/relate-permissions';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const permissions = [
  authenticate('jwt'),
  checkPermissions({
    field: 'role',
    roles: ['admin', 'company'],
  }),
  relatePermissions({ type: 'company', relateField: 'companyId' }),
];

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [...permissions],
    update: [...permissions],
    patch: [...permissions],
    remove: [...permissions],
  },

  after: {
    all: [],
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
