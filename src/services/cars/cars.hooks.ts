import * as authentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import { alterItems } from 'feathers-hooks-common';

import relatePermissions from '../../hooks/relate-permissions';

import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const permissions = [
  checkPermissions({
    field: 'role',
    roles: ['admin', 'client'],
  }),
  relatePermissions({ type: 'client', relateField: 'clientId' }),
];

export default {
  before: {
    all: [authenticate('jwt')],
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
    get: [alterItems(getInfo as any)],
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

async function getInfo(car: ServiceModels['cars'], context: HookContext) {
  const {
    app,
    params: { provider },
  } = context;
  const record = car && car.dataValues ? car.dataValues : car;

  if (!record || !provider) {
    return car;
  }

  try {
    const info = <ServiceModels['car/info']>(
      await app.service('car/info').find({ query: { carId: record.id } })
    );
    console.log(info);

    record.info = info;
  } catch (err) {
    //
  }

  return car;
}
