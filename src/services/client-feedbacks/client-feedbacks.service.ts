// Initializes the `client-feedbacks` service on path `/client-feedbacks`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ClientFeedbacks } from './client-feedbacks.class';
import createModel from '../../models/client-feedbacks.model';
import hooks from './client-feedbacks.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'client-feedbacks': ClientFeedbacks & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/client-feedbacks', new ClientFeedbacks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('client-feedbacks');

  service.hooks(hooks);
}
