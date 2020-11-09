import assert from 'assert';
import app from '../../src/app';

describe('\'order-response\' service', () => {
  it('registered the service', () => {
    const service = app.service('order-response');

    assert.ok(service, 'Registered the service');
  });
});
