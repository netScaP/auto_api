import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface IData {
  id: Id;
  path: string;
  filename: string;
  originalname: string;
  carId?: Id;
  createdAt: Date;
  updatedAt: Date;
}

declare module '../../declarations' {
  // tslint:disable-next-line
  interface ServiceModels {
    uploads: IData;
  }
}

export class Uploads extends Service {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
