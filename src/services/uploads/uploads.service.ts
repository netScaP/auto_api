// Initializes the `uploads` service on path `/uploads`
import path from 'path';
import multer from 'multer';
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Uploads } from './uploads.class';
import createModel from '../../models/uploads.model';
import hooks from './uploads.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  // tslint:disable-next-line
  interface ServiceTypes {
    uploads: Uploads & ServiceAddons<any>;
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const multipartMiddleware = multer({ storage });

export default function (app: Application) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    multi: ['create', 'patch', 'remove'],
  };

  // Initialize our service with any options it requires
  app.use('/uploads', multipartMiddleware.array('file', 5), (req: any, res: any, next: any) => {
    req.feathers!.files = req.files;
    next();
  });
  app.use('/uploads', new Uploads(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');

  service.hooks(hooks as any);
}
