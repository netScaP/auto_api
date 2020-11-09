import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  companyId: Id;
  clientId: Id;
  title: string;
  description?: string;
  assessment: number;
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;
}

declare module '../../declarations' {
  interface ServiceModels {
    'company-feedbacks': Data;
  }
}

export class CompanyFeedbacks extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
