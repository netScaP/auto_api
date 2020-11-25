import * as authentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import { fastJoin } from 'feathers-hooks-common';

import includes from '../../hooks/includes';
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

const ordersResolvers = {
  joins: {
    client: () => async (
      order: ServiceModels['orders'],
      context: HookContext<ServiceModels['orders']>
    ) => {
      try {
        const client = await context.app.service('clients').get(order.clientId);
        order.dataValues ? (order.dataValues.client = client) : (order.client = client);
      } catch (err) {
        //
      }
      return order;
    },
    car: () => async (
      order: ServiceModels['orders'],
      context: HookContext<ServiceModels['orders']>
    ) => {
      try {
        const car = await context.app.service('cars').get(order.carId || '', { $getInfo: true });
        order.dataValues ? (order.dataValues.car = car) : (order.car = car);
      } catch (err) {
        //
      }
    },
  },
};

const joins = [
  {
    uniqueName: 'client',
    as: 'client',
    model: 'clients',
    attributes: [],
    // attributes: ['id', 'name', 'phone', 'email'],
  },
  {
    uniqueName: 'car',
    as: 'car',
    model: 'cars',
    attributes: [],
  },
];
const defaultJoins = {
  client: true,
  car: true,
};

export default {
  before: {
    all: [includes({ joins, defaultJoins }), orderAccumulatedFields()],
    find: [],
    get: [],
    create: [...permissions],
    update: [...permissions],
    patch: [...permissions],
    remove: [...permissions],
  },

  after: {
    all: [fastJoin(ordersResolvers as any)],
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

function orderAccumulatedFields() {
  return async (context: HookContext<ServiceModels['orders']>) => {
    context.params.sequelize = context.params.sequelize || {};
    context.params.sequelize.attributes = context.params.sequelize.attributes || {};
    context.params.sequelize.attributes.include = context.params.sequelize.attributes.include || [];
    context.params.sequelize.attributes = {
      include: [
        ...context.params.sequelize.attributes.include,
        [
          `(
            cast(
              (SELECT AVG("order_feedbacks"."assessment") FROM order_feedbacks WHERE "order_feedbacks"."orderId" = "orders"."id")
              as decimal(10,2)
            )
          )`,
          'assessment',
        ],
      ],
    };

    return context;
  };
}
