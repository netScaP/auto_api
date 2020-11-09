import { Hook, HookContext, Id } from '@feathersjs/feathers';

interface IOption {
  dataField: string;
  sourceField: string;
  targetField: string;
  service: string;
  excludeId?: string;
  findQuery?: { [key: string]: any };
}

/**
 * dataField.forEach(id => app.service(service).create({ [sourceField]: result.id, [targetField]: id }))
 * @param dataField passed ids to relate
 * @param sourceField Field on connect table to set result.id value
 * @param targetField Field on connect table to set one of passed id in dataField
 * @param service Service name for connect table
 * @param excludeId Id to ignore
 * @param findQuery
 */
export default (options: IOption): Hook => {
  return async (context: HookContext) => {
    const { app, service, data, method } = context;
    const result = context.result;

    if (method === 'find' || method === 'remove') {
      return context;
    }

    const {
      service: tableService,
      sourceField,
      targetField,
      dataField,
      excludeId,
      findQuery = {},
    } = options;
    const allRelates: { [key: string]: string | Id; id: Id }[] = await app
      .service(tableService)
      .find({
        query: {
          ...findQuery,
          [sourceField]: result.id,
        },
        paginate: false,
      });

    if (method === 'get') {
      result[dataField] = allRelates.map(e => e[targetField]);
      if (result.dataValues) {
        result.dataValues[dataField] = allRelates.map(e => e[targetField]);
      }

      return context;
    }

    if (!data[dataField]) {
      return context;
    }
    if (!Array.isArray(data[dataField])) {
      data[dataField] = [data[dataField]];
    }

    const services: { [key: string]: number } = allRelates.reduce(
      (obj: { [key: string]: number }, relate) => {
        // { [key: Id] }
        if (excludeId && result && String(result[excludeId]) === String(relate[targetField])) {
          return obj;
        }
        obj[relate[targetField]] = obj[relate[targetField]] || 0;

        return obj;
      },
      {}
    );
    data[dataField].forEach((id: Id) => {
      services[id] = services[id] || 0;
      services[id] += 1;
    });

    await Promise.all(
      Object.keys(services).map(async id => {
        const existedRelates = allRelates.filter(
          relate => String(relate[targetField]) === String(id)
        );
        const existedRelatesCount = existedRelates.length;
        if (services[id] > existedRelatesCount) {
          for (let i = existedRelatesCount; i < services[id]; i++) {
            try {
              await app
                .service(tableService)
                .create({ [sourceField]: result.id, [targetField]: id });
            } catch (err) {
              data[dataField] = data[dataField].filter((e: Id) => e !== id);
            }
          }
        }
        if (services[id] < existedRelatesCount) {
          for (let i = services[id]; i < existedRelatesCount; i++) {
            await app.service(tableService).remove(existedRelates[i].id);
          }
        }
      })
    );

    const id = context.id ? context.id : result.id;
    const record = await service.get(id, { $joins: context.params.$joins || true });
    const displayIds = data[dataField];
    if (displayIds && excludeId && !displayIds.includes(result[excludeId])) {
      displayIds.push(result[excludeId]);
    }

    record[dataField] = displayIds;

    if (record.dataValues) {
      record.dataValues[dataField] = displayIds;
    }

    context.result = record;

    return context;
  };
};
