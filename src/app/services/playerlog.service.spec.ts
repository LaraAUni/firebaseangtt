import { TestBed } from '@angular/core/testing';

import { PlayerlogService } from './playerlog.service';

describe('PlayerlogService', () => {
  let service: PlayerlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
