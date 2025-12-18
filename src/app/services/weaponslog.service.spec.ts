import { TestBed } from '@angular/core/testing';

import { WeaponslogService } from './weaponslog.service';

describe('WeaponslogService', () => {
  let service: WeaponslogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaponslogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
