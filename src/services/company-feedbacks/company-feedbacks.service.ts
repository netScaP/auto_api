// Initializes the `company-feedbacks` service on path `/company-feedbacks`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CompanyFeedbacks } from './company-feedbacks.class';
import createModel from '../../models/company-feedbacks.model';
import hooks from './company-feedbacks.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'company-feedbacks': CompanyFeedbacks & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/company-feedbacks', new CompanyFeedbacks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('company-feedbacks');

  service.hooks(hooks);
}
