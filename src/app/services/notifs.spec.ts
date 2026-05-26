import { TestBed } from '@angular/core/testing';

import { Notifs } from './notifs';

describe('Notifs', () => {
  let service: Notifs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notifs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
