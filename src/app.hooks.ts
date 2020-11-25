// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from './app';

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      (context: HookContext) => {
        const { result } = context;

        const records = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : [result];

        records.forEach((r: any) => (r = r && r.dataValues ? r.dataValues : r));

        return context;
      },
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
