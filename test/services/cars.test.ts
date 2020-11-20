import assert from 'assert';
import app from '../../src/app';

describe('\'cars\' service', () => {
  it('registered the service', () => {
    const service = app.service('cars');

    assert.ok(service, 'Registered the service');
  });
});
