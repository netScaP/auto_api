import { Hook, HookContext } from '@feathersjs/feathers';
import { maskPhone } from '../utils/helpers';

export default (): Hook => {
  return async (context: HookContext) => {
    const { data } = context;

    if (data && data.phone) {
      data.phone = maskPhone(data.phone);
    }

    return context;
  };
};
