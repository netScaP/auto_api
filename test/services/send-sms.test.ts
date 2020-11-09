import assert from 'assert';
import app from '../../src/app';

describe('\'send-sms\' service', () => {
  it('registered the service', () => {
    const service = app.service('send-sms');

    assert.ok(service, 'Registered the service');
  });
});
