import { Id, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {
  car_type: {
    id_car_type: number;
    name: string;
  };
  car_mark: {
    id_car_mark: number;
    name: string;
    date_create?: string;
    date_update?: string;
    id_car_type: number;
    name_rus?: string;
  };
  car_model: {
    id_car_model: number;
    id_car_mark: number;
    name: string;
    date_create?: string;
    date_update?: string;
    id_car_type: number;
    name_rus?: string;
  };
  car_generation: {
    id_car_generation: number;
    name: string;
    id_car_model: number;
    year_begin: string;
    year_end: string;
    date_create?: string;
    date_update?: string;
    id_car_type: number;
    name_rus?: string;
  };
  car_serie: {
    id_car_serie: number;
    id_car_model: number;
    name: string;
    date_create?: string;
    date_update?: string;
    id_car_generation: number;
    id_car_type: number;
  };
  car_modification: {
    id_car_modification: number;
    id_car_serie: number;
    id_car_model: number;
    name: string;
    date_create?: string;
    date_update?: string;
    id_car_type: number;
  };
  car_equipment: {
    id_car_equipment: number;
    name: string;
    date_create?: string;
    date_update?: string;
    id_car_modification: number;
    price_min?: number;
    id_car_type: number;
    year: number;
  };
  car_characteristic_values: {
    id_car_characteristic_value: number;
    value: string;
    unit?: string;
    id_car_characteristic: number;
    id_car_modification: number;
    date_create?: string;
    date_update?: string;
    id_car_type: number;
    name?: string;
  }[];
}

interface ServiceOptions {}

declare module '../../../declarations' {
  interface ServiceModels {
    'car/info': Data;
  }
}

export class Info implements Partial<ServiceMethods<Data>> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data> {
    return {
      car_type: {
        id_car_type: 1,
        name: '',
      },
      car_mark: {
        id_car_mark: 1,
        name: '',
        id_car_type: 1,
      },
      car_model: {
        id_car_model: 1,
        id_car_mark: 1,
        name: '',
        id_car_type: 1,
      },
      car_generation: {
        id_car_generation: 1,
        id_car_model: 1,
        name: '',
        year_begin: '',
        year_end: '',
        id_car_type: 1,
      },
      car_serie: {
        id_car_serie: 1,
        id_car_generation: 1,
        id_car_model: 1,
        name: '',
        id_car_type: 1,
      },
      car_modification: {
        id_car_modification: 1,
        id_car_model: 1,
        id_car_serie: 1,
        name: '',
        id_car_type: 1,
      },
      car_equipment: {
        id_car_equipment: 1,
        name: '',
        id_car_type: 1,
        id_car_modification: 1,
        year: 1000,
      },
      car_characteristic_values: [],
    };
  }
}
