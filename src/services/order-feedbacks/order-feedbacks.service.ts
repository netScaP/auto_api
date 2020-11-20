// Initializes the `order-feedbacks` service on path `/order-feedbacks`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { OrderFeedbacks } from './order-feedbacks.class';
import createModel from '../../models/order-feedbacks.model';
import hooks from './order-feedbacks.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'order-feedbacks': OrderFeedbacks & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/order-feedbacks', new OrderFeedbacks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('order-feedbacks');

  // @ts-ignore
  service.hooks(hooks);
}
