import * as authentication from '@feathersjs/authentication';
import checkPermissions from 'feathers-permissions';
import { alterItems, fastJoin } from 'feathers-hooks-common';

import relatePermissions from '../../hooks/relate-permissions';

import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const carsResolvers = {
  joins: {
    photos: () => async (
      car: ServiceModels['cars'],
      context: HookContext<ServiceModels['cars']>
    ) => {
      try {
        const photos = <ServiceModels['uploads'][]>(
          await context.app.service('uploads').find({ query: { carId: car.id }, paginate: false })
        );
        car.dataValues ? (car.dataValues.photos = photos) : (car.photos = photos);
      } catch (err) {
        //
      }
      return car;
    },
  },
};

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
    all: [alterItems(getInfo as any)],
    find: [fastJoin(carsResolvers as any)],
    get: [fastJoin(carsResolvers as any)],
    create: [onPlateNumbersFill(), fastJoin(carsResolvers as any)],
    update: [onPlateNumbersFill(), fastJoin(carsResolvers as any)],
    patch: [onPlateNumbersFill(), fastJoin(carsResolvers as any)],
    remove: [onPlateNumbersFill(), fastJoin(carsResolvers as any)],
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
    params: { provider, $getInfo },
  } = context;
  const record = car && car.dataValues ? car.dataValues : car;

  if (!record || (!provider && !$getInfo)) {
    return car;
  }

  try {
    const info = <ServiceModels['car/info']>(
      await app.service('car/info').find({ query: { carId: record.id } })
    );

    record.info = info;
  } catch (err) {
    //
  }

  return car;
}

function onPlateNumbersFill() {
  return async (context: HookContext<ServiceModels['cars']>) => {
    const { app, data, result } = context;
    const record = result && result.dataValues ? result.dataValues : result;

    if (!data || !data.plateNumbers || !record || !record.plateNumbers) {
      return context;
    }

    // get url request to get photos
    const photos = [
      'http://apist.avtokod.org/img/photo/ad408aa0e368d032376297e0b48d8d1a.jpg',
      'http://apist.avtokod.org/img/photo/be58b1ae62ab98d3f57dfe94eeb53ba5.jpg',
    ];

    await app.service('uploads').create(
      photos.map(path => ({ path, carId: record.id })),
      { $create: false }
    );

    return context;
  };
}
