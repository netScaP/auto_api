import assert from 'assert';
import app from '../../../src/app';

describe('\'car/info\' service', () => {
  it('registered the service', () => {
    const service = app.service('car/info');

    assert.ok(service, 'Registered the service');
  });
});
