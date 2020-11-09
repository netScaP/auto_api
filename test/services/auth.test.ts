import assert from 'assert';
import app from '../../src/app';

describe('\'auth\' service', () => {
  it('registered the service', () => {
    const service = app.service('auth');

    assert.ok(service, 'Registered the service');
  });
});
