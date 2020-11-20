import assert from 'assert';
import app from '../../../src/app';

describe('\'car/search\' service', () => {
  it('registered the service', () => {
    const service = app.service('car/search');

    assert.ok(service, 'Registered the service');
  });
});
