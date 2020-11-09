import { Hook, HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../declarations';

interface IOption {
  type: 'client' | 'company';
  relateField: string;
}

/**
 * @param type
 * @param relateField
 */
export default (options: IOption): Hook => {
  return async (context: HookContext) => {
    const {
      app,
      data,
      params: { user },
      method,
    } = context;
    const { type, relateField } = options;

    if (!user) {
      return context;
    }

    const query = context.params.query || {};

    let val;
    if (type === 'company' && user.role === 'company' && user.companyId) {
      val = user.companyId;
    }

    if (type === 'client' && user.role === 'client') {
      const client = (<ServiceModels['clients'][]>await app.service('clients').find({
        query: {
          userId: user.id,
          $limit: 1,
        },
        paginate: false,
      }))[0];

      if (client) {
        val = client.id;
      }
    }

    if (val) {
      query[relateField] = val;

      if (['create', 'update', 'patch'].includes(method) && data) {
        data[relateField] = val;
      }
    }

    context.params.query = query;

    return context;
  };
};
