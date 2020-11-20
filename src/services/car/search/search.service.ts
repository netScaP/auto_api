// Initializes the `car/search` service on path `/car/search`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Search } from './search.class';
import hooks from './search.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'car/search': Search & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/car/search', new Search(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('car/search');

  // @ts-ignore
  service.hooks(hooks);
}
