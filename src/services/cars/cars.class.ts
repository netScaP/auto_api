import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application, ServiceModels } from '../../declarations';
import { Id } from '@feathersjs/feathers';

export interface Data {
  id: Id;
  title?: string;
  plateNumbers?: string;

  id_car_type: number;
  id_car_mark: number;
  id_car_model: number;
  id_car_generation: number;
  id_car_serie: number;
  id_car_modification: number;
  id_car_equipment?: number;
  createdAt: Date;
  updatedAt: Date;

  dataValues?: Data;
  toJSON?: () => Data;

  info?: ServiceModels['car/info'];

  photos?: ServiceModels['uploads'][];
}

declare module '../../declarations' {
  interface ServiceModels {
    cars: Data;
  }
}

export class Cars extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
