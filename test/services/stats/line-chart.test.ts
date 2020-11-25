import assert from 'assert';
import app from '../../../src/app';

describe('\'stats/line-chart\' service', () => {
  it('registered the service', () => {
    const service = app.service('stats/line-chart');

    assert.ok(service, 'Registered the service');
  });
});
