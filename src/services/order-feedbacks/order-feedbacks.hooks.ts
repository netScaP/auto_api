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
    roles: ['admin', 'client'],
  }),
  relatePermissions({ type: 'client', relateField: 'clientId' }),
];

const ordersFeedbacksResolvers = {
  joins: {
    company: () => async (
      orderFeedback: ServiceModels['order-feedbacks'],
      context: HookContext<ServiceModels['order-feedbacks']>
    ) => {
      try {
        const company = await context.app.service('companies').get(orderFeedback.companyId);
        orderFeedback.dataValues
          ? (orderFeedback.dataValues.company = company)
          : (orderFeedback.company = company);
      } catch (err) {
        //
      }
      return orderFeedback;
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
    all: [fastJoin(ordersFeedbacksResolvers as any)],
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
