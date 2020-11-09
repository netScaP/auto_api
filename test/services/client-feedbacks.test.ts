import assert from 'assert';
import app from '../../src/app';

describe('\'client-feedbacks\' service', () => {
  it('registered the service', () => {
    const service = app.service('client-feedbacks');

    assert.ok(service, 'Registered the service');
  });
});
