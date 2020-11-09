// Initializes the `send-sms` service on path `/send-sms`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { SendSms } from './send-sms.class';
import hooks from './send-sms.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'send-sms': SendSms & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/send-sms', new SendSms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('send-sms');

  service.hooks(hooks);
}
