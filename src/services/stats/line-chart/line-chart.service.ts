// Initializes the `stats/line-chart` service on path `/stats/line-chart`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { LineChart } from './line-chart.class';
import hooks from './line-chart.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'stats/line-chart': LineChart & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/stats/line-chart', new LineChart(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('stats/line-chart');

  service.hooks(hooks as any);
}
