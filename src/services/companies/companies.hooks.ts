import * as authentication from '@feathersjs/authentication';
import { disablePagination } from 'feathers-hooks-common';
import checkPermissions from 'feathers-permissions';
import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';

import relatePermissions from '../../hooks/relate-permissions';
import search from '../../hooks/search';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const permissions = [
  authenticate('jwt'),
  checkPermissions({
    field: 'role',
    roles: ['admin', 'company'],
  }),
  relatePermissions({ type: 'company', relateField: 'id' }),
];

export default {
  before: {
    all: [],
    find: [
      search({ fields: ['name', 'email', 'phone'] }),
      companyAccumulatedFields(),
      disablePagination(),
    ],
    get: [companyAccumulatedFields()],
    create: [
      authenticate('jwt'),
      checkPermissions({
        field: 'role',
        roles: ['admin'],
      }),
      createUser(),
    ],
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

function companyAccumulatedFields() {
  return async (context: HookContext<ServiceModels['companies']>) => {
    context.params.sequelize = context.params.sequelize || {};
    context.params.sequelize.attributes = context.params.sequelize.attributes || {};
    context.params.sequelize.attributes.include = context.params.sequelize.attributes.include || [];
    context.params.sequelize.attributes = {
      include: [
        ...context.params.sequelize.attributes.include,
        [
          `(
            cast(
              (SELECT AVG("company_feedbacks"."assessment") FROM company_feedbacks WHERE "company_feedbacks"."companyId" = "companies"."id")
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

function createUser() {
  return async (context: HookContext<ServiceModels['companies']>) => {
    const {
      app,
      data,
      result,
      params: { $user },
      type,
    } = context;

    if (type === 'before' && data && data.user) {
      context.params.$user = data.user;

      return context;
    }

    const record = result && result.dataValues ? result.dataValues : result;

    if (!$user || !record) {
      return context;
    }

    try {
      await app.service('users').create({
        ...$user,
        role: 'company',
      });
    } catch (err) {
      await app.service('companies').remove(record.id);
      throw err;
    }

    return context;
  };
}
