// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { Unavailable } from '@feathersjs/errors';

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { id } = context;

    if (id === null) {
      throw new Unavailable();
    }

    return context;
  };
};
