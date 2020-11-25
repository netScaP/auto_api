import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ServiceModels } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  orderId: Id;
  companyId: Id;
  clientId: Id;
  title: string;
  description?: string;
  assessment: number;
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;

  company?: ServiceModels['companies'];
}

declare module '../../declarations' {
  interface ServiceModels {
    'order-feedbacks': Data;
  }
}

export class OrderFeedbacks extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
