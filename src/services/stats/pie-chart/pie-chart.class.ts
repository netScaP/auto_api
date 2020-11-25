import { Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class PieChart implements Partial<ServiceMethods<Data>> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }
}
