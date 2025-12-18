import { TestBed } from '@angular/core/testing';

import { AbnologService } from './abnolog.service';

describe('AbnologService', () => {
  let service: AbnologService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbnologService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
