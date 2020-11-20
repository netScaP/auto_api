// Initializes the `cars` service on path `/cars`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Cars } from './cars.class';
import createModel from '../../models/cars.model';
import hooks from './cars.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'cars': Cars & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cars', new Cars(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cars');

  service.hooks(hooks);
}
