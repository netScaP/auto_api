import assert from 'assert';
import app from '../../../src/app';

describe('\'stats/pie-chart\' service', () => {
  it('registered the service', () => {
    const service = app.service('stats/pie-chart');

    assert.ok(service, 'Registered the service');
  });
});
