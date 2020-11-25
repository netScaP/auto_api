import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ServiceModels } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  clientId: Id;
  companyId?: Id;
  carId?: Id;
  title: string;
  description?: string;
  vin?: string;
  type: 'detailing' | 'repair' | 'spare';
  status: 'unhandled' | 'closed' | 'active' | 'work' | 'done';
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;

  assessment?: string;
  client?: ServiceModels['clients'];
  car?: ServiceModels['cars'];
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
