// Initializes the `car/info` service on path `/car/info`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Info } from './info.class';
import hooks from './info.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'car/info': Info & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/car/info', new Info(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car/info');

  // @ts-ignore
  service.hooks(hooks);
}
