import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ServiceModels } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  timeWork: {
    day: string;
    time: { from: string; to: string }[];
  }[];
  status: 'active' | 'unactive' | 'banned';
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;

  user?: ServiceModels['users'];
  assessment?: string;
}

declare module '../../declarations' {
  interface ServiceModels {
    companies: Data;
  }
}

export class Companies extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
