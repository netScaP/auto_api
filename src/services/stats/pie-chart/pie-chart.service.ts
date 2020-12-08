// Initializes the `stats/pie-chart` service on path `/stats/pie-chart`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { PieChart } from './pie-chart.class';
import hooks from './pie-chart.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'stats/pie-chart': PieChart & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/stats/pie-chart', new PieChart(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('stats/pie-chart');

  service.hooks(hooks as any);
}
