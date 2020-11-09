// Initializes the `order-response` service on path `/order-response`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { OrderResponse } from './order-response.class';
import createModel from '../../models/order-response.model';
import hooks from './order-response.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'order-response': OrderResponse & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/order-response', new OrderResponse(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('order-response');

  service.hooks(hooks);
}
