import * as authentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import { fastJoin } from 'feathers-hooks-common';

import relatePermissions from '../../hooks/relate-permissions';

import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';
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

const ordersResponsesResolvers = {
  joins: {
    company: () => async (
      orderResponse: ServiceModels['order-response'],
      context: HookContext<ServiceModels['order-response']>
    ) => {
      try {
        const company = await context.app.service('companies').get(orderResponse.companyId);
        orderResponse.dataValues
          ? (orderResponse.dataValues.company = company)
          : (orderResponse.company = company);
      } catch (err) {
        //
      }
      return orderResponse;
    },
  },
};

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
    all: [fastJoin(ordersResponsesResolvers as any)],
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
