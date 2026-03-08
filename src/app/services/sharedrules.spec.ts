import { TestBed } from '@angular/core/testing';

import { Sharedrules } from './sharedrules';

describe('Sharedrules', () => {
  let service: Sharedrules;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sharedrules);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
