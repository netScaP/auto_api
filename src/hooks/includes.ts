import errors from '@feathersjs/errors';

import { Hook, HookContext } from '@feathersjs/feathers';
import { Sequelize, ModelCtor, Model } from 'sequelize';

type optionType = { model: string; include?: optionType[]; [key: string]: any };
type includeType = {
  model: ModelCtor<Model<any, any>>;
  uniqueName?: string;
  include?: includeType[];
  [key: string]: any;
};
type defaultJoinsType = { include?: defaultJoinsType; [key: string]: any };

export default (options: { joins: optionType[]; defaultJoins?: defaultJoinsType }): Hook => {
  return async (context: HookContext) => {
    const { app, params } = context;
    const sequelize: Sequelize = app.get('sequelizeClient');
    const { models } = sequelize;
    const { joins, defaultJoins } = options;

    if (params.query && params.query.$joins) {
      params.$joins = params.query.$joins;
      delete params.query.$joins;
    }

    if (!params.provider && params.$joins === undefined) {
      return context;
    }

    const raw = false;

    context.params.sequelize = context.params.sequelize || {};

    let passedJoins: defaultJoinsType | undefined = undefined;
    const $joins =
      params.query && params.query.$joins !== undefined ? params.query.$joins : params.$joins;
    if (String($joins) === 'true' || !$joins) {
      passedJoins = defaultJoins;
    } else {
      passedJoins = $joins;
    }
    const include = loopIncludes(joins, models, context, passedJoins);

    Object.assign(context.params.sequelize, { include, raw });

    return context;
  };
};

function loopIncludes(
  modelsArr: optionType[],
  models: { [key: string]: ModelCtor<Model<any, any>> },
  context: HookContext,
  activeJoins?: defaultJoinsType
): includeType[] {
  if (!modelsArr) return [];
  return modelsArr.reduce((arr: includeType[], obj) => {
    if (activeJoins && !activeJoins[obj.uniqueName]) {
      return arr;
    }
    if (!obj.model) {
      throw new errors.BadRequest('Model must be included');
    }

    const includeObj: includeType = {
      ...obj,
      include: [],
      model: models[obj.model],
      uniqueName: undefined,
    };
    if (obj.include) {
      const joins = activeJoins && activeJoins[obj.uniqueName] ? activeJoins[obj.uniqueName] : {};
      includeObj.include = loopIncludes(obj.include, models, context, joins);
    }

    arr.push(includeObj);

    return arr;
  }, []);
}
