import { TestBed } from '@angular/core/testing';

import { Userinfo } from './userinfo';

describe('Userinfo', () => {
  let service: Userinfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Userinfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
