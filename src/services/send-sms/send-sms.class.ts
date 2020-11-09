import { Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';

interface Data {
  phone: string;
  text: string;
}

interface ServiceOptions {}

declare module '../../declarations' {
  interface ServiceModels {
    'send-sms': Data;
  }
}

export class SendSms implements Partial<ServiceMethods<Data>> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    return data;
  }
}
