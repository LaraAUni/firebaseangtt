import { TestBed } from '@angular/core/testing';

import { MaplogService } from './maplog.service';

describe('MaplogService', () => {
  let service: MaplogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaplogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
