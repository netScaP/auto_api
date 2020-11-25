import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  userId: Id;
  phone: string;
  email?: string;
  name?: string;
  status: 'active' | 'unactive' | 'banned';
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;

  assessment?: string;
}

declare module '../../declarations' {
  interface ServiceModels {
    clients: Data;
  }
}

export class Clients extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
