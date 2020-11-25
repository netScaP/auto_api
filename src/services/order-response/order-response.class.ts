import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ServiceModels } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  companyId: Id;
  orderId: Id;
  title: string;
  description?: string;
  priceFrom: number;
  priceTo?: number;
  date?: Date;
  status: 'active' | 'spam';
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;

  company?: ServiceModels['companies'];
}

declare module '../../declarations' {
  interface ServiceModels {
    'order-response': Data;
  }
}

export class OrderResponse extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
