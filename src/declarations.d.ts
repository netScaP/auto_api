import { Application as ExpressFeathers } from '@feathersjs/express';

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

// A mapping of service models
export interface ServiceModels {}

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>;

export interface Config {
  carApi: {
    url: string;
  };
}
