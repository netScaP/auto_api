import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  clientId: Id;
  companyId?: Id;
  title: string;
  description?: string;
  vin?: string;
  type: 'detailing' | 'repair' | 'spare';
  status: 'unhandled' | 'closed' | 'active' | 'work' | 'done';
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;
}

declare module '../../declarations' {
  interface ServiceModels {
    orders: Data;
  }
}

export class Orders extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
