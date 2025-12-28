import { GoogleSso } from './google-sso';

describe('GoogleSso', () => {
  it('should create an instance', () => {
    const directive = new GoogleSso();
    expect(directive).toBeTruthy();
  });
});
