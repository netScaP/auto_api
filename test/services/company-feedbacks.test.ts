import assert from 'assert';
import app from '../../src/app';

describe('\'company-feedbacks\' service', () => {
  it('registered the service', () => {
    const service = app.service('company-feedbacks');

    assert.ok(service, 'Registered the service');
  });
});
