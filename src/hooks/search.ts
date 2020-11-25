// before: { find }
import { Hook, HookContext } from '@feathersjs/feathers';

/**
 * params.sequelize = {
 *  [field]: { $iLike: query.$search }
 * }
 */
export default (options: {
  fields?: string[];
  queries?: string[];
  external?: { service: string; externalIdField: string; idField: string };
}): Hook => {
  return async (context: HookContext) => {
    const { app, params } = context;
    const sequelizeClient = app.get('sequelizeClient');
    const { fields, queries, external } = options;

    if (!params.query || !params.query.$search) {
      return context;
    }

    const $or: any[] = [];

    const searchString = params.query.$search.replace(/(_)/g, '\\$1');

    if (fields) {
      fields.forEach(key => {
        if (external) {
          $or.push(
            sequelizeClient.literal(`(
              SELECT CASE WHEN EXISTS (
                SELECT *
                FROM "${external.service}"
                WHERE "${external.service}".${external.externalIdField} = ${external.idField}
                AND "${key}" iLike '%${searchString}%'
              )
              THEN TRUE
              ELSE FALSE
              END
            )`)
          );
        } else {
          $or.push({ [key]: { $iLike: `%${searchString}%` } });
        }
      });
    }

    if (queries) {
      queries.forEach(query => {
        $or.push(
          sequelizeClient.literal(`(
          ${query} iLike '%${searchString}%'
        )`)
        );
      });
    }

    delete params.query.$search;

    params.query = params.query || {};
    params.query.$and = params.query.$and || [];
    params.query.$and.push({ $or });

    return context;
  };
};
