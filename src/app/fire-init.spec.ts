import { TestBed } from '@angular/core/testing';

import { FireInit } from './fire-init';

describe('FireInit', () => {
  let service: FireInit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireInit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
