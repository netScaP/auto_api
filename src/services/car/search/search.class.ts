import { Id, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

declare module '../../../declarations' {
  interface ServiceModels {
    'car/search': Data;
  }
}

export class Search implements Partial<ServiceMethods<Data>> {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }
}
