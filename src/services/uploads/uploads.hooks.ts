import * as authentication from '@feathersjs/authentication';
import { iff, isProvider } from 'feathers-hooks-common';
import errors from '@feathersjs/errors';

import fs from 'fs';
import { promisify } from 'util';

import disableMultiItemChange from '../../hooks/disable-multi-item-change';

import { HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../../declarations';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const unlinkAsync = promisify(fs.unlink);

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      /**
       * Get files array and create each with file url (path),
       */
      async (context: HookContext) => {
        if (!context.params.provider && !context.params.$create) {
          return context;
        }

        const { app, service } = context;
        const files: Express.Multer.File[] = context.params.files;

        const apiUrl = app.get('apiUrl');

        if (!files || files.length === 0) {
          throw new errors.BadRequest('No files found to upload');
        }

        const data = Object.keys(context.data).reduce(
          (obj: Partial<ServiceModels['uploads'] & { [key: string]: any }>, key) => {
            if (key !== 'file') {
              obj[key] = context.data[key];
            }

            return obj;
          },
          {}
        );

        context.result = await Promise.all(
          files.map(async file => {
            const newFile = { ...data, ...file };

            try {
              return await service.create(newFile);
            } catch (err) {
              return { ...err };
            }
          })
        );

        return context;
      },

      async (context: HookContext<ServiceModels['uploads']>) => {
        const { app, data } = context;
        const apiUrl = app.get('apiUrl');

        if (!data || Array.isArray(data) || !data.filename) {
          return context;
        }

        if (!data.path) {
          data.path = `${apiUrl}uploads/${data.filename}`;
        }

        return context;
      },
    ],
    update: [],
    patch: [iff(isProvider('external'), disableMultiItemChange())],
    remove: [iff(isProvider('external'), disableMultiItemChange())],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
      async (context: HookContext) => {
        const { result } = context;

        if (context.params.$ignoreSoftDelete) {
          await unlinkAsync(`./public/uploads/${result.filename}`);
        }

        return context;
      },
    ],
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
