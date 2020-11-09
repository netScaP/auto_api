import assert from 'assert';
import app from '../../src/app';

describe('\'order-feedbacks\' service', () => {
  it('registered the service', () => {
    const service = app.service('order-feedbacks');

    assert.ok(service, 'Registered the service');
  });
});
